/* global $ */
$(document).ready(function() {
    var yPosTop = 25;
    var container = $(".ATM-Pic")[0];
    var options = {};
    var reqArr = [];
    var personArr = [];

    /* Creates a component on the page */
    var createComp = function(txt) {
        var h2 = document.createElement("h2");
        var span = document.createElement("span");
        h2.className = "comp";
        $(h2).css("top", yPosTop + "%");
        h2.append(span);
        $(span).html(txt);
        $(container).append(h2);
        yPosTop += 10;
    };

    var genList = function() {
        $(".comp").remove();
        yPosTop = 25;

        var nameCnt = 1;
        personArr.forEach(function(name) {
            createComp(nameCnt + ". " + name);
            nameCnt++;
        });
    };

    var removePerson = function(name) {
        var indx, cnt=0;
        personArr.forEach(function(nm) {
            if(name == nm){
                indx = cnt;
            }
            cnt++;
        });
        personArr.splice(indx, 1);
        genList();
    };
    
    var addPerson = function(name){
        personArr.push(name);
        genList();
    };

    options.onOpen = function(e) {
        console.log("Connection Open");
    };

    options.onEnd = function(e) {
        console.log("Connection Closed");
        reqArr[0] = $.SSE('http://beaconapp-abdallahozaifa.c9users.io:8080/queueClient', options);
        reqArr[0].start();
    };

    options.events = {
        queue: function(e) {
            console.log("Received Data from Server");
            var dataArr = e.data.split('\n');
            console.log(dataArr);
            var action = dataArr[0];
            var name = dataArr[1];
            if(action == "add"){
                addPerson(name);
            }else{
                removePerson(name);
            }
        }
    };

    var sse = $.SSE('http://beaconapp-abdallahozaifa.c9users.io:8080/queueClient', options);
    reqArr.push(sse);
    sse.start();
});
