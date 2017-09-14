var inquirer = require('inquirer');
var mysql    = require('mysql');

var util = function(){

  var connection = mysql.createConnection({
    host         : "localhost",
    port         : 8889,
    user         : "root",
    password     : "Insecure",
    database     : "bamazon",
  });

  this.startConnnection = function(doFunc){
    connection.connect(function(err) {
      if (err) {
        return console.log(err);
      }
      doFunc;
    });
  }

  this.getInfoDB = function(doFunc){
    var query = 'SELECT * FROM products';
    this.callBackQuery(query,undefined,(resp)=>{
      doFunc(resp);
    });
  }

  this.getDeptInfo = function(doFunc){
    var query = 'SELECT * FROM departments';
    this.callBackQuery(query,undefined,(resp)=>{
      doFunc(resp);
    });
  }

  this.getSupervisorInfo = function(doFunc){
    var query = 'SELECT departments.department_id, departments.department_name, departments.over_head_costs, products.product_sales FROM products INNER JOIN departments ON products.department_name=departments.department_name';
    this.callBackQuery(query,undefined,(resp)=>{
      doFunc(resp);
    });
  }

  this.inquireMessage = function(yourMessage, doFunc){
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

  this.inquireList = function(yourMessage, choiceList, doFunc){
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

  this.callBackQuery = function(query,value,doFunc){
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
}

module.exports = util;
