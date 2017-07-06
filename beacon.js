/* LIBRARY IMPORTS */
var express = require('express');
var fs = require('fs');
var app = express();
var bodyParser = require("body-parser");
var events = require('events');
var eventEmitter = new events.EventEmitter();

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use('/assets', express.static('assets'));
app.use('/bower_components', express.static('bower_components'));
app.use('/atm.js', express.static('atm.js'));

app.get('/', function(req, res) {
    console.log("Received request from user Agent: " + req.headers["user-agent"]);
    res.send("Received request from server!");
});
var count = 0;
eventEmitter.setMaxListeners(1);

var messageCount = 0;
var setEvent = false;
app.get('/event', function(req, res) {

        var displayGeneralAtm = function displayGeneralAtm() {
            messageCount++;
            var img = "assets/images/ATMWelcome/ATMBlank.PNG";
            res.write("event: beacon\n");
            res.write('id: ' + messageCount + '\n');
            res.write("data: " + img + "\n\n");
            res.write("retry: 1000\n");
            res.write('\n');
            console.log("Sent:  " + img);
        }

        var displayWelcomeAtm = function displayWelcomeAtm() {
            messageCount++;
            var img = "assets/images/ATMWelcome/ATMGeneralWelcome.png";
            res.write("event: beacon\n");
            res.write('id: ' + messageCount + '\n');
            res.write("data: " + img + "\n\n");
            res.write("retry: 1000\n");
            res.write('\n');
            console.log("Sent:  " + img);
        }

        var displayHozaifaWelcome = function() {
            messageCount++;
            var img = "assets/images/ATMGreeting/ATMWelcomeHozaifa.png";
            res.write("event: beacon\n");
            res.write('id: ' + messageCount + '\n');
            res.write("data: " + img + "\n\n");
            res.write("retry: 1000\n");
            res.write('\n');
            console.log("Sent:  " + img);
        }

        var displayBrendonWelcome = function() {
            messageCount++;
            var img = "assets/images/ATMGreeting/ATMWelcomeBrendon.png";
            res.write("event: beacon\n");
            res.write('id: ' + messageCount + '\n');
            res.write("data: " + img + "\n\n");
            res.write("retry: 1000\n");
            res.write('\n');
            console.log("Sent:  " + img);
        }

        var displaySeanWelcome = function() {
            messageCount++;
            var img = "assets/images/ATMGreeting/ATMWelcomeSean.png";
            res.write("event: beacon\n");
            res.write('id: ' + messageCount + '\n');
            res.write("data: " + img + "\n\n");
            res.write("retry: 1000\n")
            res.write('\n');
            console.log("Sent:  " + img);
        }


        eventEmitter.on('farProximity', displayGeneralAtm);
        eventEmitter.on('closeProximity', displayWelcomeAtm);
        eventEmitter.on('BrendonApproach', displayBrendonWelcome);
        eventEmitter.on('HozaifaApproach', displayHozaifaWelcome);
        eventEmitter.on('SeanApproach', displaySeanWelcome);
        //setEvent = true;
    
    var interval = 1000;
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

app.post('/beaconInfo', function(req, res) {

    // Brendon Approach
    //if(req.body.name == "")
    // eventEmitter.emit('BrendonApproach');

    // // Hozaifa Approach
    // //if()
    // eventEmitter.on('HozaifaApproach');
    console.log(req.body.name);
    //console.log(req.body.rank);
    var name = req.body.name;
    //var rank = req.body.rank;
    
    /* Sean Approach */
    if (name == "Sean") {
        console.log("Hitting Sean Approach!");
        eventEmitter.emit('SeanApproach');
    }
    else if (name == "Brendon") {
        eventEmitter.emit("BrendonApproach");
    }
    else {
        eventEmitter.emit("HozaifaApproach");
    }


    // eventEmitter.on('farProximity');

    // eventEmitter.on('closeProximity');

});

var server = app.listen(process.env.PORT || '8080', '0.0.0.0', function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log('running at http://' + host + ':' + port);
});
