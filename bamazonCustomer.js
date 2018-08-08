var mysql = require("mysql");
var inquirer = require("inquirer");
var itemQuantity;

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "coriolis",
  database: "bamazon_db"
});

// connect to the mysql server and sql database
connection.connect(function(err) {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
  console.log("connected as id " + connection.threadId + "\n");
  readProducts();
});

function readProducts() {
    console.log("Selecting all products...\n");
    connection.query("SELECT * FROM products", function(err, res) {
      if (err) throw err;
      // Log all results of the SELECT statement
      console.log(res);
      chooseItem();
    });
  }

//  function for choosing item 
function chooseItem() {
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
    inquirer
        .prompt([
        {
            name: "item",
            type: "list",
            choices: function() {
                var choiceArray = [];
                for (var i = 0; i < res.length; i++) {
                  choiceArray.push(res[i].product_name);
                }
                
                //console.log("result: ", choiceArray);
                return choiceArray;
              },
            message: "Choose the item you would like to buy"
        },
        {
        name: "Quantity",
        type: "input",
        message: "How many?",
        validate: function(value) {
            if (isNaN(value) === false) {
              return true;
            }
            return false;
          }
        }
    ])
    // take this answer and read from the db then ask the next question
        .then(function(answer) {
            
            for (var i = 0; i < res.length; i++) {
                
                console.log("product name: ", res[i].product_name);
                console.log("Userchoice: ", res[i].stock_quantity);

            }
        console.log("Item: ", answer.item)
        itemQuantity = answer.Quantity;
        console.log("Quantity: ", itemQuantity);
        
        checkQuantity();
    });
});
}

function checkQuantity() {
    // if (itemQuantity <= )
    connection.end();
}