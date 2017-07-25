/**
 * @fileOverview Customer Module with methods for altering customers in the database.
 * @author Hozaifa Abdalla
 * @version 1.0.0
 * @module Customer js
 */

/****************************************
 *             CUSTOMER MODULE          *
 ****************************************/
(function() {
    var assert = require('assert');

    /**
     * Insert a customer into the database.
     * @function
     * @param{object} db - The database connection object
     * @param{object} customer - The customer object to be inserted
     * @param{function} callback - The callback function
     * @module Customer js
     */
    var insertCustomer = function(db, customer, callback) {
        db.collection('customers').insertOne(customer, function(err, result) {
            assert.equal(err, null);
            callback();
        });
    };
    
    /**
     * Finds a customer in the database.
     * @function
     * @param{object} db - The database connection object
     * @param{object} customer - The customer object to be inserted
     * @param{function} callback - The callback function
     * @module Customer js
     */
    var findCustomer = function(db, customer, callback) {
        db.collection('customers').findOne(customer, function(err, cstmr) {
            assert.equal(null, err);
            callback(cstmr);
        });
    };
    
    /**
     * Removes all customers from the database.
     * @function
     * @param{object} db - The database connection object
     * @module Customer js
     */
    var removeAllCustomers = function(db) {
        db.collection('customers').remove({});
    };

    /**
     * Updates a customer from the database.
     * @function
     * @param{object} db - The database connection object
     * @param{string} usrID - The usrID of the customer to be updated
     * @param{function} callback - The callback function
     * @module Customer js
     */
    var updateCustomer = function(db, usrID, usr, callback) {
        db.collection('customers').update({
            _id: usrID
        }, usr, function(err, recordsModified, status) {
            callback(err, recordsModified, status);
        });
    };

    /**
     * Finds all customers from the database.
     * @function
     * @param{object} db - The database connection object
     * @param{function} callback - The callback function
     * @module Customer js
     */
    var findAllCustomers = function(db, callback) {
        var myCursor = db.collection('customers').find();
        myCursor.forEach(callback);
    };

    /**
     * Removes a customer from the database.
     * @function
     * @param{object} db - The database connection object
     * @param{string} customerID - The customer id
     * @module Customer js
     */
    var removeCustomer = function(db, customerID) {
        db.collection('customers').remove({
            _id: customerID
        });
    };

    exports.insertCustomer = insertCustomer;
    exports.findCustomer = findCustomer;
    exports.removeCustomer = removeCustomer;
    exports.removeAllCustomers = removeAllCustomers;
    exports.updateCustomer = updateCustomer;
    exports.findAllCustomers = findAllCustomers;
}).call(this);
