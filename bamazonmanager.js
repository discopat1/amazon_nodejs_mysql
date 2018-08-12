var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('cli-table');


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

connection.connect(function(err) {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    console.log("connected as id " + connection.threadId + "\n");
    managerOptions();
  });

function managerOptions() {
    inquirer
    .prompt([
        {
            name: "options",
            type: "rawlist",
            choices: ['View Products', 'Add Inventory', 'Add new product'],
            message: "What would you like to do?"
        }
    ])
    .then(function(answer){
        switch (answer.options) {
            case 'View Products':
            viewProducts()
            break;

            case 'Add Inventory':
            addInventory();
            break;

            case 'Add new product':
            addProduct();
        }
    // provide a list of option for manager
    // View Products for Sale
    
    // View Low Inventory
    
    // Add to Inventory
    
    // Add New Product
})
};

function viewProducts() {
    console.log("Selecting all products...\n");
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        // Table start--------------------------
        // =====================================
        var table = new Table({
            head: ['Product', 'Department', 'Price', 'Inventory']
            , colWidths: [40, 40, 20, 20]
        });
            
        // table is an Array, so you can `push`, `unshift`, `splice` and friends
            for (var i = 0; i < res.length; i++) {
        table.push([res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity])// If inventory is less than 7
        if (res[i].stock_quantity < 7) {
            lowInventory(res[i]);
        };
        console.log("Inventory: ", res[i].stock_quantity)
    }
                    
        console.log(table.toString());
        // ===================================
        // Table end--------------------------
        
    });
}

function lowInventory(lowProduct) {
    console.log(lowProduct);
}

function addInventory() {
    // update database by adding
}

function newProduct() {
    // insert into database 
}
