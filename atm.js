var appImg = $("#appImg");
console.log(appImg);
var options = {};
var reqArr = [];

var welcomeAtmImg = new Image();
welcomeAtmImg.src = "http://beaconapp-abdallahozaifa.c9users.io:8080/assets/images/ATMWelcome/ATMGeneralWelcome.png";
var generalAtmImg = new Image();
generalAtmImg.src = "http://beaconapp-abdallahozaifa.c9users.io:8080/assets/images/ATMWelcome/ATMBlank.PNG";
var HozaifaWelcomeImg = new Image();
HozaifaWelcomeImg.src = "http://beaconapp-abdallahozaifa.c9users.io:8080/assets/images/ATMGreeting/ATMWelcomeHozaifa.png";
var BrendonWelcomeImg = new Image();
BrendonWelcomeImg.src = "http://beaconapp-abdallahozaifa.c9users.io:8080/assets/images/ATMGreeting/ATMWelcomeBrendon.png";
var SeanWelcomeImg = new Image();
BrendonWelcomeImg.src = "http://beaconapp-abdallahozaifa.c9users.io:8080/assets/images/ATMGreeting/ATMWelcomeSean.png";

console.log(welcomeAtmImg);

options.onOpen = function(e) {
    console.log("Connection Open");
};

options.onEnd = function(e) {
    console.log("Connection Closed");
    reqArr[0] = $.SSE('http://beaconapp-abdallahozaifa.c9users.io:8080/event', options);
    reqArr[0].start();
};

var IsJsonString = function(str) {
    try {
        JSON.parse(str);
    }
    catch (e) {
        return false;
    }
    return true;
};

options.events = {
    beacon: function(e) {
        console.log("Received Data from Center");
        var dataArr = e.data.split('\n');
        var img = dataArr[0];
        var amount = dataArr[1];
        appImg.attr("src", img);
        if(amount != undefined){
            swal(
                'Transaction Completed!',
                "$" + amount + ".00" + ' has been Withdrawn!',
                'success'
            );
        }
        reqArr[0].stop();
    }
};

var sse = $.SSE('http://beaconapp-abdallahozaifa.c9users.io:8080/event', options);
reqArr.push(sse);
sse.start();
