var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/beacon';
var assert = require('assert');
var Customer = require('./server_modules/Customer');

var clearDatabase = function() {
    MongoClient.connect(url, function(err, db) {
        assert.equal(null, err);
        console.log("Cleared out database!");
        Customer.removeAllCustomers(db);
        db.close();
    });
};

clearDatabase();

/* Connecting to the database server */
// MongoClient.connect(url, function(err, db) {
//     assert.equal(null, err);
//     var customer = {
//         name: "Hozaifa Abdalla",
//         actNm: 1,
//         queueNum: 3
//     };
//     console.log("Connected correctly to server.");

//     /* Insert the customer into the database */
//     Customer.insertCustomer(db, customer, function() {
//         console.log(customer.name + " was successfully Added to the database!");
//         /* Find all the customers once they are inserted!*/
//         db.close();
//     });
// });
