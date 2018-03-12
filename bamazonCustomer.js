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
        connection.end();
    });
}