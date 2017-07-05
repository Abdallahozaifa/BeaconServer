var appImg = $("#appImg");
console.log(appImg);
var options = {};
var reqArr = [];

options.onOpen = function(e) {
    //console.log("Connection Open");
    //console.log(e);
};

options.onEnd = function(e) {
    //console.log("Connection Closed");
    //console.log(e);
    reqArr[0] = $.SSE('http://beaconapp-abdallahozaifa.c9users.io:8080/event', options);
    reqArr[0].start();
    //console.log(reqArr[0]);
    //reqArr[0].start();
    //sse.start();
};

options.events = {
    beacon: function(e) {
        //console.log('Custom Event');
        console.log("Received Data from Center")
        //console.log(e);
        appImg.attr("src", e.data);
        reqArr[0].stop();
        
    }
};

var sse = $.SSE('http://beaconapp-abdallahozaifa.c9users.io:8080/event', options);
reqArr.push(sse);
sse.start();

