/**
 * @fileOverview Server file that handles all the requests from the web app and mobile app.
 * @author Hozaifa Abdalla
 * @version 1.0.0
 * @module beacon js
 */

/* LIBRARY IMPORTS */
var express = require('express');
var fs = require('fs');
var app = express();
var bodyParser = require("body-parser");
var events = require('events');
var eventEmitter = new events.EventEmitter().setMaxListeners(0);
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var Customer = require('./server_modules/Customer');
var AlterDatabase = require('./server_modules/AlterDatabase');

/* GLOBAL VARIABLES */
var url = 'mongodb://localhost:27017/beacon';
var wtCount = 2;
var queueNm = 1;

/* Initially clearing the database during every server start up for presentation purposes! */
AlterDatabase.clearDatabase();

/* Express Body Parser*/
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

/* Serving static files*/
app.use('/assets', express.static('www/assets'));
app.use('/bower_components', express.static('bower_components'));
app.use('/atm.js', express.static('www/js/atm.js'));
app.use('/branch.js', express.static('www/js/branch.js'));
app.use('/documentation', express.static('out'));

/****************************************
 *      HTTP REQUEST HANDLERS           *
 ****************************************/

/**
 * GET Request handler for '/atm'
 * Sends the client the atm file.
 * @function
 * @param {string} - The string url for the handler
 * @param {callback} - The callback function
 * @module beacon js
 */
app.get('/atm', function(req, res) {
    fs.readFile('www/html/atm.html', 'utf8', function(err, data) {
        if (!err) res.send(data);
        else return console.log(err);
    });
});

/**
 * GET Request handler for '/tvscreen'
 * Sends the client the branch html.
 * @function
 * @param {string} - The string url for the handler
 * @param {callback} - The callback function
 * @module beacon js
 */
app.get('/tvscreen', function(req, res) {
    fs.readFile('www/html/branch.html', 'utf8', function(err, data) {
        if (!err) res.send(data);
        else return console.log(err);
    });
});


/*****************************************************
 *      LONG POLLING HTTP REQUEST HANDLERS           *
 *****************************************************/
/**
 * GET Request handler for '/event'
 * Sends the customer object to the client with the promotion.
 * @function
 * @param {string} - The string url for the handler
 * @param {callback} - The callback function
 * @module beacon js
 */
app.get('/event', function(req, res) {

    /* Sends Customer Data to the Client that is waiting */
    var addMessageListener = function(res) {
        eventEmitter.once('sendDataToClient', function(data) {
            console.log(data);
            var customer = data.customer;
            if (data.event == "promotion") {
                console.log("Sending promotion event!");
                if (customer.balance > 0 && customer.balance <= 1000) {
                    customer.promotion = "brewery.gif";
                }
                else if (customer.balance > 1000 && customer.balance <= 1000) {
                    customer.promotion = "chasecard.png";
                }
                else {
                    customer.promotion = "saphhirecard.png";
                }
            }
            else if (data.event == "transaction") {
                console.log("Sending transaction event!");
            }
            res.send(JSON.stringify(customer));
        });
    };

    /* Adding a message listener */
    addMessageListener(res);
});


/**
 * GET Request handler for '/queueClient'
 * Sends the customer queuing data to the web app.
 * @function
 * @param {string} - The string url for the handler
 * @param {callback} - The callback function
 * @module beacon js
 */
app.get('/queueClient', function(req, res) {
    var addMessageListener = function() {
        eventEmitter.once('alterQueue', function() {
            var dbPrsArr = [];
            var customerCnt = 1;
            MongoClient.connect(url, function(err, db) {
                assert.equal(null, err);
                console.log("Connected correctly to server.");
                db.collection('customers').count(function(err, cnt) {
                    assert.equal(null, err);
                    Customer.findAllCustomers(db, function(customer) {
                        dbPrsArr.push(customer);
                        if (customerCnt == cnt) {
                            console.log(dbPrsArr);
                            res.send(JSON.stringify(dbPrsArr));
                        }else {
                            customerCnt++;
                        }
                        db.close();
                    });
                });
            });
        });
    };
    addMessageListener(res);
});

/***************************************************
 *      MOBILE APP HTTP REQUEST HANDLERS           *
 ***************************************************/
/**
 * POST Request handler for '/queue'
 * Adds each incoming customer to the database from the mobile app .
 * @function
 * @param {string} - The string url for the handler
 * @param {callback} - The callback function
 * @module beacon js
 */
app.post('/queue', function(req, res) {
    var customer = {
        name: req.body.name,
        actNm: req.body.account,
        waitTime: wtCount,
        queueNum: queueNm
    };

    wtCount += 2;
    queueNm++;

    /* Connecting to the database server */
    MongoClient.connect(url, function(err, db) {
        assert.equal(null, err);
        console.log("Connected correctly to server.");

        /* Insert the customer into the database */
        Customer.insertCustomer(db, customer, function() {
            console.log(customer.name + " was successfully Added to the database!");
            /* Find all the customers once they are inserted!*/
            res.send(JSON.stringify(customer));
            eventEmitter.emit("alterQueue");
            db.close();
        });
    });
});

/**
 * POST Request handler for '/promotion'
 * Initializes the customer data and sends to client for testing purposes.
 * @function
 * @param {string} - The string url for the handler
 * @param {callback} - The callback function
 * @module beacon js
 */
app.post('/promotion', function(req, res) {
    console.log(req.body);
    var data = {
        customer: req.body,
        event: "promotion"
    };
    eventEmitter.emit('sendDataToClient', data);
    res.send("Done");
});

/**
 * POST Request handler for '/transaction'
 * Emits an event alterqueue event .
 * @function
 * @param {string} - The string url for the handler
 * @param {callback} - The callback function
 * @module beacon js
 */
app.post('/transaction', function(req, res) {
    console.log("Transaction received!");
    var data = {
        customer: req.body,
        event: "transaction"
    };
    eventEmitter.emit('sendDataToClient', data);
    res.send("Done");
});


/***************************************************
 *      TESTING HTTP REQUEST HANDLERS              *
 ***************************************************/
/**
 * GET Request handler for '/addHozaifa'
 * Emits an alterqueue event .
 * @function
 * @param {string} - The string url for the handler
 * @param {callback} - The callback function
 * @module beacon js
 */
app.get('/turnOnQueue', function(req, res) {
    eventEmitter.emit("alterQueue");
    res.send(null);
    res.end();
});

/**
 * GET Request handler for '/sendName'
 * Sets and sends the customer data.
 * @function
 * @param {string} - The string url for the handler
 * @param {callback} - The callback function
 * @module beacon js
 */
app.get('/sendCustomer', function(req, res) {
    var customer = {
        name: "Hozaifa Abdalla",
        balance: 12000,
        languages: "Spanish",
        amount: "550",
        event: "transaction"
    };
    var data = {
        customer: customer,
        event: "promotion"
    };
    eventEmitter.emit('sendDataToClient', data);
    res.send(null);
    res.end();
});

/**
 * Server function for listening for request on the port 8080
 * @function
 * @param {string} - The string url for the port
 * @param {callback} - The callback function
 * @module beacon js
 */
var server = app.listen(process.env.PORT || '8080', '0.0.0.0', function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log('running at http://' + host + ':' + port + "/atm");
    console.log('running at http://' + host + ':' + port + "/tvscreen");
    console.log('running at http://' + host + ':' + port + "/documentation/index.html");
});
