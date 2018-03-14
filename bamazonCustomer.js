var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "woodpen10",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    readProducts();
    
});

function readProducts() {
    connection.query("SELECT item_id, product_name, department_name, price FROM products", function (err, res) {
        if (err) throw err;

        // Log all results of the SELECT statement
        console.log(res);
        var inventory = res;
        start(inventory);
        // connection.end();
    });
}

function start(inventory) {
      inquirer
        .prompt([
          {
            name: "choice",
            type: "input",
            message: "What item would you like to buy? Type in the item_id",
            validate: function(val){
              return !isNaN(val) || val.toLowerCase() === "q";
            }
            // name: "available",
            // type:"input"
          }
          // {
          //   name: "quantity",
          //   type: "input",
          //   message: "How many items would you like to buy?"
          // }
        ])
        .then(function(val) {
          // get the information of the chosen item
          
          // var chosenItem;
          // for (var i = 0; i < results.length; i++) {
          //   console.log(results);
          //   if (results[i].item_id === answer.choice) {
          //     chosenItem = results[i];
          checkIfShouldExit(val.choice);
            var choiceId = parseInt(val.choice);
            var product = checkInventory(choiceId, inventory);
            if (product) { 
            promptUserForQuantity(product);
              } else {
                console.log("\nSorry that item is not in our inventory");
                readProducts();
              }
            })
      }

    function promptUserForQuantity(product){
        inquirer
          .prompt([
            {
              name: "quantity",
              type: "input",
              message: "How many items would you like to buy? [Quit with Q]",
              validate: function(val){
                return val > 0 || val.toLowerCase() === "q";
              }
            }
          ])
          .then(function(val){
            var quantity = parseInt(val.quantity);
            if (quantity > product.stock_quantity){
            console.log("\nInsufficient quantity!")
            readProducts();
          }
          else {
            makePurchase(product, quantity);
          }
        })
      }

    function makePurchase(product, quantity){
      connection.query(
        "UPDATE products SET stock_quantity = stock_quantity - ? WHERE item_id=?",
        [quantity, product.item_id],
        function(err,res){
        console.log("\nSuccessfully purchased " + quantity + " " + product.product_name + " 's!");
        readProducts();
      }
    )
  };
          
  function checkInventory(choiceId, inventory) {
    for (var i = 0; i < inventory.length; i++){
      if (inventory[i].item_id === choiceId){
        return inventory[i];
      }
    }
    return null;
  }

  function checkIfShouldExit(choice){
    if (choice.toLowerCase() === "q"){
      console.log("Goodbye");
      process.exit(0);
    }
  }