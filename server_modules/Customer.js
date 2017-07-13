/****************************************
 *             CUSTOMER MODULE          *
 ****************************************/
(function() {
    var assert = require('assert');

    var insertCustomer = function(db, customer, callback) {
        db.collection('customers').insertOne(customer, function(err, result) {
            assert.equal(err, null);
            console.log("Inserted a customer into the customers collection.");
            callback();
        });
    };

    var findCustomer = function(db, customer, callback) {
        db.collection('customers').findOne(customer, function(err, cstmr) {
            assert.equal(null, err);
            callback(cstmr);
        });
    };

    var removeAllCustomers = function(db) {
        db.collection('customers').remove({});
    };

    var updateCustomer = function(db, usrID, usr, callback) {
        db.collection('customers').update({
            _id: usrID
        }, usr, function(err, recordsModified, status) {
            callback(err, recordsModified, status);
        });
    };

    var findAllCustomers = function(db, callback) {
        var myCursor = db.collection('customers').find();
        myCursor.forEach(callback);
    };

    var removecustomer = function(db, customerID) {
        db.collection('customers').remove({
            _id: customerID
        });
    };

    exports.insertCustomer = insertCustomer;
    exports.findCustomer = findCustomer;
    exports.removeAllCustomers = removeAllCustomers;
    exports.updateCustomer = updateCustomer;
    exports.findAllCustomers = findAllCustomers;
}).call(this);
