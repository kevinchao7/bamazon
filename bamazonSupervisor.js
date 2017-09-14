var inquirer = require('inquirer');
var mysql    = require(  'mysql' );
var utility  = require('./util.js');
var Table    = require('cli-table');

var menu     = ['View Products Sales by Department','Create New Department'];
var util     = new utility();

util.startConnnection(init());

function init(){
  util.inquireList('Select the following options: ',menu,(resp)=>{ processSelection(resp) });
}

function restart(){
  setTimeout(()=>{init();},1000);
}

function processSelection(menuState){
  if(menuState == menu[0]){
    viewProductsByDept();
    restart();
  }
  else{
    promptNew();
  }
}

function viewProductsByDept(){
  util.getDeptInfo((resp)=>{
    displayList(resp);
  });
}

function displayList(dept){
  util.getInfoDB((resp)=>{
    var table = new Table( { head : ['department_id','department_name','over_head_costs','product_sales','total_profit'] } );
    dept.forEach((depart)=>{
      var product_sales = 0;
      resp.forEach((value)=>{
        if(value.department_name == depart.department_name){
          product_sales += (value.product_sales != null) ? parseInt(value.product_sales) : 0;
        }
      });
      var total = product_sales - parseInt(depart.over_head_costs);
      table.push( [ String(depart.department_id), depart.department_name, String(depart.over_head_costs), String(product_sales), String(total) ] );
    });
    console.log( table.toString() );
  });
}


function promptNew(){
  util.getDeptInfo((dept)=>{
    util.inquireMessage('Enter new department name.',(resp)=>{
      addNew(resp);
    });
  });
}

function addNew(department){
  var query = 'INSERT INTO departments SET ?';
  var value =
  {
    department_name : department,
    over_head_costs : 0
  }
  console.log(department + ' has been added to the list of departments.');
  util.callBackQuery(query,value);
  restart();
}

function addInventory(inquiry,db){
  var index;
  for (var i = 0; i < db.length; i++){
    if(db[i].item_id == inquiry.id){
      index = i;
      break;
    }
  }
  var query = 'UPDATE products SET ? WHERE ?';
  var value =
    [
      {
        stock_quantity : parseInt(db[index].stock_quantity) + parseInt(inquiry.amount)
      },
      {
        item_id        : inquiry.id
      }
    ];
  console.log('The inventory of ' + db[index].product_name + ' has been updated to ' + value[0].stock_quantity + '.');
  util.callBackQuery(query,value);
}
