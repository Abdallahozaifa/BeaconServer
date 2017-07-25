(function() {
    /****************************************
     *             CUSTOMER MODULE          *
     ****************************************/

    var MongoClient = require('mongodb').MongoClient;
    var url = 'mongodb://localhost:27017/beacon';
    var assert = require('assert');
    var Customer = require('./Customer');

    var customers = [{
        name: "Hozaifa Abdalla",
        actNm: 1,
        queueNum: 1,
        balance: 5550,
        languages: "English",
        amount: "550",
        promotion: ""
    }, {
        name: "Brendon James",
        actNm: 1,
        queueNum: 2,
        balance: 10110,
        languages: "French",
        amount: "340",
        promotion: ""
    }, {
        name: "Sean Kirkland",
        actNm: 1,
        queueNum: 3,
        balance: 103000,
        languages: "Spanish",
        amount: "230",
        promotion: ""
    }];

    var clearDatabase = function() {
        MongoClient.connect(url, function(err, db) {
            assert.equal(null, err);
            console.log("Cleared out database!");
            Customer.removeAllCustomers(db);
            db.close();
        });
    };

    var addCustomer = function(customer) {
        MongoClient.connect(url, function(err, db) {
            assert.equal(null, err);

            /* Insert the customer into the database */
            Customer.insertCustomer(db, customer, function() {
                console.log(customer.name + " was successfully Added to the database!");
                /* Find all the customers once they are inserted!*/
                db.close();
            });
        });
    };

    var addSampleCustomers = function() {
        customers.forEach(function(customer) {
            addCustomer(customer);
        });
    };
    
    exports.addSampleCustomers = addSampleCustomers;
    exports.clearDatabase = clearDatabase;
}).call(this);
