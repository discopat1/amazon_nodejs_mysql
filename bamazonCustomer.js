var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('cli-table');

// instantiate
var table = new Table({
    head: ['TH 1 label', 'TH 2 label']
  , colWidths: [100, 200]
});
 
// table is an Array, so you can `push`, `unshift`, `splice` and friends
table.push(
    ['First value', 'Second value']
  , ['First value', 'Second value']
);
 
console.log(table.toString());

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
                    // var newString = `id: ${res[i].id} - ${res[i].product_name}`;
                  choiceArray.push(res[i].product_name);
                }
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
            
        console.log("Item: ", answer.item)
        console.log("Quantity: ", answer.Quantity);

        var chosenItem;
        for (var i = 0; i < res.length; i++) {
          if (res[i].product_name === answer.item) {
            chosenItem = res[i];
          }
        }

        // console.log("Chosen Item: ", chosenItem);
        // console.log("Chosen Inventory: ", chosenItem.stock_quantity);
        var newQuantity = (chosenItem.stock_quantity -= answer.Quantity);
        // console.log("New Inventory: " , newQuantity);
        var itemPrice = (chosenItem.price * answer.Quantity);
        if (chosenItem.stock_quantity < answer.Quantity) {
            console.log("Not enough inventory to supply this demand. Please order less.");
        }
        else {
            // Update database to subtact inventory based on the amount bought
            connection.query(
                "UPDATE products SET ? WHERE ?",
                [
                    {
                        stock_quantity: newQuantity
                    },
                    {
                        id: chosenItem.id
                    }
                ],
                function(err) {
                    if (err) throw err;
                    console.log("Your total cost is: ", itemPrice)
                }
            )
        }

        // Table start--------------------------
        // =====================================
        var table = new Table({
            head: ['Product', 'Department', 'Price', 'Inventory']
          , colWidths: [25, 25, 25, 25]
        });
         
        // table is an Array, so you can `push`, `unshift`, `splice` and friends
         for (var i = 0; i < res.length; i++) {
        table.push(
            [res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]
        )}
                  
        console.log(table.toString());
        // ===================================
        // Table end--------------------------
        
        
        
        
    
        connection.end();
    });
});
}

