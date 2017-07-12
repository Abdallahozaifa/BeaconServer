/* LIBRARY IMPORTS */
var express = require('express');
var fs = require('fs');
var app = express();
var bodyParser = require("body-parser");
var events = require('events');
var eventEmitter = new events.EventEmitter();
var messageCount = 0;
var globalAmount = null;
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/beacon';
var ObjectId = require('mongodb').ObjectID;
var assert = require('assert');
var Customer = require('./server_modules/Customer');
var customers = [];
var action = "";
var glblName = "";
eventEmitter.setMaxListeners(0);

/**/
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

app.get('/event', function(req, res) {
    // var refreshPg = function(){
    //     res.write("data: refresh\n\n");
    // };

    var displayGeneralAtm = function displayGeneralAtm() {
        messageCount++;
        var img = "assets/images/ATMWelcome/ATMBlank.PNG";
        res.write("event: beacon\n");
        res.write('id: ' + messageCount + '\n');
        if (globalAmount != null) {
            console.log("Sending Events!");
            res.write("data: " + img + "\n");
            res.write("data: " + globalAmount + "\n\n");
        }
        else {
            res.write("data: " + img + "\n\n");
        }
        res.write("retry: 1000\n");
        res.write('\n');
        console.log("Sent:  " + img);
    };

    var displayWelcomeAtm = function displayWelcomeAtm() {
        messageCount++;
        var img = "assets/images/ATMWelcome/ATMGeneralWelcome.png";
        res.write("event: beacon\n");
        res.write('id: ' + messageCount + '\n');
        if (globalAmount != null) {
            console.log("Sending Events!");
            res.write("data: " + img + "\n");
            res.write("data: " + globalAmount + "\n\n");
        }
        else {
            res.write("data: " + img + "\n\n");
        }
        res.write("retry: 1000\n");
        res.write('\n');
        console.log("Sent:  " + img);
    };

    var displayHozaifaWelcome = function() {
        messageCount++;
        var img = "assets/images/ATMGreeting/ATMWelcomeHozaifa.png";
        res.write("event: beacon\n");
        res.write('id: ' + messageCount + '\n');
        if (globalAmount != null) {
            console.log("Sending Events!");
            res.write("data: " + img + "\n");
            res.write("data: " + globalAmount + "\n\n");
        }
        else {
            res.write("data: " + img + "\n");
            res.write("data: " + "assets/images/ATMPromotions/chasecard.png" + "\n\n");
        }
        res.write("retry: 1000\n");
        res.write('\n');
        console.log("Sent:  " + img);
    };

    var displayBrendonWelcome = function() {
        messageCount++;
        var img = "assets/images/ATMGreeting/ATMWelcomeBrendon.png";
        res.write("event: beacon\n");
        res.write('id: ' + messageCount + '\n');
        if (globalAmount != null) {
            console.log("Sending Events!");
            res.write("data: " + img + "\n");
            res.write("data: " + globalAmount + "\n\n");
        }
        else {
            res.write("data: " + img + "\n");
            res.write("data: " + "assets/images/ATMPromotions/brewery.gif" + "\n\n");
        }
        res.write("retry: 1000\n");
        res.write('\n');
        console.log("Sent:  " + img);
    };

    var displaySeanWelcome = function() {
        messageCount++;
        var img = "assets/images/ATMGreeting/ATMWelcomeSean.png";
        res.write('id: ' + messageCount + '\n');
        res.write("event: beacon\n");
        if (globalAmount != null) {
            console.log("Sending Events!");
            res.write("data: " + img + "\n");
            res.write("data: " + globalAmount + "\n\n");
        }
        else {
            res.write("data: " + img + "\n");
            res.write("data: " + "assets/images/ATMPromotions/saphhirecard.png" + "\n\n");
        }
        res.write("retry: 1000\n");
        res.write('\n');
        console.log("Sent:  " + img);
    };

    // eventEmitter.on('refreshPg', refreshPg);
    eventEmitter.on('farProximity', displayGeneralAtm);
    eventEmitter.on('closeProximity', displayWelcomeAtm);
    eventEmitter.on('BrendonApproach', displayBrendonWelcome);
    eventEmitter.on('HozaifaApproach', displayHozaifaWelcome);
    eventEmitter.on('SeanApproach', displaySeanWelcome);
    res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive"
    });
});

app.get('/addHozaifa', function(req, res) {
    eventEmitter.emit("alterQueue");
});

app.get('/moneyTest', function(req, res){
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
                    messageCount++;
                    if (customerCnt == cnt) {
                        res.write('id: ' + messageCount + '\n');
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
            })
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

app.get('/sendWelcome', function(req, res) {
    eventEmitter.emit('closeProximity');
    res.send(null);
    res.end();
});

app.get('/sendGeneral', function(req, res) {
    eventEmitter.emit('farProximity');
    res.send(null);
    res.end();
});

// app.get('/refresh', function(req, res) {
//     eventEmitter.emit('refreshPg');
//     res.send(null);
//     res.end();
// });
var clearDatabase = function() {
    MongoClient.connect(url, function(err, db) {
        assert.equal(null, err);
        console.log("Connected correctly to server.");
        Customer.removeAllCustomers(db);
        customers = [];
        db.close();
    });
};

var findAllCustomers = function() {
    MongoClient.connect(url, function(err, db) {
        assert.equal(null, err);
        console.log("Connected correctly to server.");
        Customer.findAllCustomers(db, function(customer) {
            console.log(customer);
            //customers.push(customer);
            db.close();
        });
    });
};

app.get('/tvscreen', function(req, res) {
    fs.readFile('branch.html', 'utf8', function(err, data) {
        if (!err) res.send(data);
        else return console.log(err);
    });
});
//clearDatabase();

var wtCount = 2;
var queueNm = 1;
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

app.post('/beaconInfo', function(req, res) {

    var name = req.body.name;
    var amount = req.body.amount;
    console.log(req.body);
    console.log("Received Sean request!");
    /* Sean Approach */
    if (name == "Sean Kirkland" && amount == undefined) {
        globalAmount = null;
        eventEmitter.emit('SeanApproach');
    }
    else if (name == "Sean Kirkland" && amount != null) {
        // display transaction amount and welcome sean
        globalAmount = amount;
        eventEmitter.emit('SeanApproach');
    }

    /* Brendon Approach */
    if (name == "Brendon James" && amount == undefined) {
        globalAmount = null;
        eventEmitter.emit('BrendonApproach');
    }
    else if (name == "Brendon James" && amount != null) {
        globalAmount = amount;
        eventEmitter.emit('BrendonApproach');
    }

    /* Hozaifa Approach */
    if (name == "Hozaifa Abdalla" && amount == undefined) {
        globalAmount = null;
        eventEmitter.emit('HozaifaApproach');
    }
    else if (name == "Hozaifa Abdalla" && amount != null) {
        // display transaction amount and welcome sean
        globalAmount = amount;
        eventEmitter.emit('HozaifaApproach');
    }
});

var server = app.listen(process.env.PORT || '8080', '0.0.0.0', function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log('running at http://' + host + ':' + port);
});
