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

/* GLOBAL VARIABLES */
var url = 'mongodb://localhost:27017/beacon';
var wtCount = 2;
var queueNm = 1;
var globalCustomer = {
    name: "",
    balance: "",
    languages: "",
    amount: "",
    promotion: ""
};

/* Express Body Parser*/
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

/* Serving static files*/
app.use('/assets', express.static('assets'));
app.use('/bower_components', express.static('bower_components'));
app.use('/atm.js', express.static('atm.js'));
app.use('/branch.js', express.static('branch.js'));

/* HTTP Request handlers */
app.get('/', function(req, res) {
    console.log("Received request from user Agent: " + req.headers["user-agent"]);
    res.send("Received request from server!");
});

var clearDatabase = function() {
    MongoClient.connect(url, function(err, db) {
        assert.equal(null, err);
        console.log("Cleared out database!");
        Customer.removeAllCustomers(db);
        db.close();
    });
};

clearDatabase();
app.get('/event', function(req, res) {

    /* Sends Customer Data to the Client that is waiting */
    var sendDataToClient = function() {
        if(globalCustomer.balance > 0 && globalCustomer.balance <= 1000 ){
            globalCustomer.promotion = "brewery.gif";
        }else if(globalCustomer.balance > 1000 && globalCustomer.balance <= 1000){
            globalCustomer.promotion = "chasecard.png";
        }else{
            globalCustomer.promotion = "saphhirecard.png";
        }
        res.write("event: beacon\n");
        res.write("data: " + JSON.stringify(globalCustomer) + "\n\n");
        res.write("retry: 1000\n");
        res.write('\n');
    };

    eventEmitter.on('sendDataToClient', sendDataToClient);

    res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive"
    });
});

app.get('/addHozaifa', function(req, res) {
    eventEmitter.emit("alterQueue");
});

app.get('/moneyTest', function(req, res) {
    console.log("Received request");
    eventEmitter.emit("HozaifaApproach");
    res.send(null);
    res.end();
});

app.get('/queueClient', function(req, res) {
    var alterQueue = function() {
        var dbPrsArr = [];
        var customerCnt = 1;
        MongoClient.connect(url, function(err, db) {
            assert.equal(null, err);
            console.log("Connected correctly to server.");
            db.collection('customers').count(function(err, cnt) {
                assert.equal(null, err);
                Customer.findAllCustomers(db, function(customer) {
                    console.log(customer);
                    dbPrsArr.push(customer);
                    if (customerCnt == cnt) {
                        res.write("event: queue\n");
                        res.write("data: " + JSON.stringify(dbPrsArr) + "\n\n");
                        res.write("retry: 1000\n");
                        res.write('\n');
                    }
                    else {
                        customerCnt++;
                    }
                    db.close();
                });
            });
        });
    };

    eventEmitter.on('alterQueue', alterQueue);

    res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive"
    });
});

app.get('/atm', function(req, res) {
    fs.readFile('atm.html', 'utf8', function(err, data) {
        if (!err) res.send(data);
        else return console.log(err);
    });
});

app.get('/sendCustomer', function(req, res) {
    eventEmitter.emit('sendDataToClient');
    res.send(null);
    res.end();
});

app.get('/tvscreen', function(req, res) {
    fs.readFile('branch.html', 'utf8', function(err, data) {
        if (!err) res.send(data);
        else return console.log(err);
    });
});


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

app.post('/promotion', function(req, res) {
    var name = req.body.name;
    var balance = req.body.balance;
    var language = req.body.languages;
    console.log(req.body);
    globalCustomer.name = name;
    globalCustomer.balance = balance;
    globalCustomer.languages = language;
    eventEmitter.emit('sendDataToClient');
});

app.post('/transaction', function(req, res) {
    var name = req.body.name;
    var amount = req.body.amount;
    var language = req.body.languages;
    console.log(req.body);
    globalCustomer.name = name;
    globalCustomer.amount = amount;
    globalCustomer.languages = language;
    eventEmitter.emit('sendDataToClient');
});

app.get('/sendName', function(req, res) {
    globalCustomer.name = "Hozaifa Abdalla";
    globalCustomer.balance = 12000;
    globalCustomer.languages = "Spanish";
    eventEmitter.emit('sendDataToClient');
    res.send(null);
    res.end();
});
var server = app.listen(process.env.PORT || '8080', '0.0.0.0', function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log('running at http://' + host + ':' + port);
});
