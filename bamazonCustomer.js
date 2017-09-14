var inquirer = require('inquirer');
var mysql    = require(  'mysql' );

var connection = mysql.createConnection({
  host         : "localhost",
  port         : 8889,
  user         : "root",
  password     : "Insecure",
  database     : "bamazon",
});

start();

function start(){
  connection.connect(function(err) {
    if (err) {
      return console.log(err);
    }
    init();
  });
}

function init(){
  getInfoDB((resp)=>{
    displayList(resp);
    promptBuyItem();
  });
}

function restart(){
  setTimeout(()=>{ init(); }, 2500);
}

function promptBuyItem(){
  inquirer.prompt([
    {
      type    : 'message',
      message : 'Enter the id for the item you would like to purchase.',
      name    : 'id'
    },
    {
      type    : 'message',
      message : 'How much would you like to purchase?',
      name    : 'amount'
    }
  ]).then((inquiry)=>{
    validatePurchase(inquiry);
  });
}

function validatePurchase(inquiry){
  if (!isNaN(inquiry.amount)){
    getInfoDB((resp)=>{
      var index;
      for (var i = 0; i < resp.length; i++){
        if(resp[i].item_id == inquiry.id){
          index = i;
          break;
        }
      }
      if(inquiry.amount <= resp[index].stock_quantity){
        var qtyLeft = resp[index].stock_quantity - inquiry.amount;
        purchaseItem(resp[index],qtyLeft,inquiry.amount);
        console.log('You purchased ' + inquiry.amount + ' of ' + resp[index].product_name + ' for a total of $' + (parseInt(inquiry.amount) * parseInt(resp[index].price)) + '.');
      }
      else{
        console.log('Insufficient quantity!');
      }
      restart();
    });
  }
}

function purchaseItem(resp,qtyLeft,qtyBought){
  var query = 'UPDATE products SET ? WHERE ?';
  var value =
    [
      {
        stock_quantity : qtyLeft,
        product_sales  : resp.product_sales + parseInt(qtyBought) * parseInt(resp.price)
      },
      {
        item_id        : resp.item_id
      }
    ];
    callBackQuery(query,value);
}

function displayList(resp){
  console.log('Current Listing');
  console.log('----------------');
  resp.forEach((value)=>{
    console.log('Item#' + value.item_id + ' => ' + value.product_name + ' - $' + value.price + ' - QTY:' + value.stock_quantity);
  });
}

function getInfoDB(doFunc){
  var query = 'SELECT * FROM products';
  callBackQuery(query,undefined,(resp)=>{
    doFunc(resp);
  });
}

function inquireMessage(yourMessage, doFunc){
  inquirer.prompt([
    {
      type    : 'message',
      message : yourMessage,
      name    : 'objName'
    }
  ]).then(resp=>{
    doFunc(resp['objName']);
  });
}

function inquireList(yourMessage, choiceList, doFunc){
  inquirer.prompt([
    {
      type    : 'list',
      message : yourMessage,
      choices : choiceList,
      name    : 'objName'
    }
  ]).then(resp=>{
    doFunc(resp['objName']);
  });
}

function callBackQuery(query,value,doFunc){
  if(doFunc && value){
    connection.query(query,value,(err,res)=>{
      if (err)throw err;
      doFunc(res);
    });
  }
  else if (value && !doFunc){
    connection.query(query,value,(err,res)=>{
      if (err)throw err;
    });
  }
  else if (doFunc){
    connection.query(query,(err,res)=>{
      if (err)throw err;
      doFunc(res);
    });
  }
  else{
    connection.query(query,(err,res)=>{
      if (err)throw err;
    });
  }
}
