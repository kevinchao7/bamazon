var inquirer = require('inquirer');
var mysql    = require(  'mysql' );
var utility  = require('./util.js');
var menu     = ['View Products for Sale','View Low Inventory','Add to Inventory','Add New Product'];
var util     = new utility();

util.startConnnection(init());

function init(){
  util.inquireList('Select the following options: ',menu,(resp)=>{processSelection(resp);});
}

function restart(){
  setTimeout(()=>{init();},1000);
}

function processSelection(menuState){
  if(menuState == menu[0]){
    viewProducts();
    restart();
  }
  else if (menuState == menu[1]){
    viewLowInventory();
    restart();
  }
  else if (menuState == menu[2]){
    promptInventory();
  }
  else{
    promptNew();
  }
}

function viewProducts(){
  util.getInfoDB((resp)=>{
    displayList(resp);
  });
}

function viewLowInventory(){
  util.getInfoDB((resp)=>{
    var tmpArray = [];
    resp.forEach((value)=>{
      if(value.stock_quantity < 5){
        tmpArray.push(value);
      }
    });
    displayList(tmpArray);
  });
}

function promptInventory(){
  inquirer.prompt([
    {
      type    : 'message',
      message : 'Enter the id for the item you would add to inventory.',
      name    : 'id'
    },
    {
      type    : 'message',
      message : 'How much would you like to add?',
      name    : 'amount'
    }
  ]).then((inquiry)=>{
    util.getInfoDB((resp)=>{
      if(!isNaN(inquiry.id) && !isNaN(inquiry.amount)){
        addInventory(inquiry,resp);
      }
      else {
        console.log('Invalid inquiry. Please enter appropriate values.');
      }
      restart();
    });
  });
}

function promptNew(){
  util.getDeptInfo((dept)=>{
    var deptList = [];
    dept.forEach((value)=>{
      deptList.push(value.department_name)
    });
    inquirer.prompt([
      {
        type    : 'input',
        message : 'Enter the product name.',
        name    : 'name'
      },
      {
        type    : 'input',
        message : 'Enter the price.',
        name    : 'price'
      },
      {
        type    : 'input',
        message : 'Enter the qty.',
        name    : 'qty'
      },
      {
        type    : 'list',
        choices : deptList,
        message : 'Select the department.',
        name    : 'department'
      }
    ]).then((resp)=>{
      addNew(resp);
      restart();
    });
  });
}

function addNew(item){
  var query = 'INSERT INTO products SET ?';
  var value =
  {
    product_name    : item.name,
    department_name : item.department,
    stock_quantity  : item.qty,
    price           : item.price
  }
  console.log(item.name + ' has been added to the inventory.');
  util.callBackQuery(query,value);
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

function displayList(resp){
  console.log('Current Listing');
  console.log('----------------');
  resp.forEach((value)=>{
    console.log('Item#' + value.item_id + ' => ' + value.product_name + ' - $' + value.price + ' - QTY:' + value.stock_quantity);
  });
}
