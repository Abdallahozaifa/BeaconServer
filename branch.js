/* global $ */
$(document).ready(function() {
    var yPosTop = 30;
    var container = $(".ATM-Pic")[0];
    var options = {};
    var reqArr = [];
    var personArr = [];

    $("body").css("background", "white");
    $(".header").hide();
    setTimeout(function() {
        $(".header").show();
        $(".header").textillate({
            in: {
                effect: 'rotateIn',
                delayScale: 1,
                delay: 150,
                shuffle: true
            }
        });
    }, 1100);
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
        yPosTop = 30;

        var nameCnt = 1;
        personArr.forEach(function(name) {
            createComp(nameCnt + ". " + name);
            nameCnt++;
        });
    };

    var removePerson = function(name) {
        var indx, cnt = 0;
        personArr.forEach(function(nm) {
            if (name == nm) {
                indx = cnt;
            }
            cnt++;
        });
        personArr.splice(indx, 1);
        genList();
    };

    var addPerson = function(name) {
        personArr.push(name);
        genList();
    };
    // addPerson("Hozaifa Abdalla");
    // addPerson("Sean Kirkland");
    // addPerson("Brendon James");
    
    var flashAndRemoveNameAnimate = function(name){
        var indx=0, indxSelected;
        personArr.forEach(function(nm){
            if(nm == name){
                indxSelected = indx;
            }
            indx++;
        });
        console.log($(".comp"));
        $($(".comp")[indxSelected]).addClass('animated infinite flash');
        // setTimeout(function(){
        //     $(".comp")[indxSelected].remove();
        //     removePerson("Hozaifa Abdalla");
        //     genList();
        // }, 5000);
    };
    // flashAndRemoveNameAnimate("Hozaifa Abdalla");
    

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
            var data = e.data;
            console.log(data);
            var prsArr = JSON.parse(data);
            console.log(prsArr);
            personArr = [];
            console.log(personArr);
            prsArr.forEach(function(person) {
                addPerson(person.name);
                flashAndRemoveNameAnimate(prsArr[0].name);
            });
        },
        usrSelected: function(e){
            var data = e.data;
            flashAndRemoveNameAnimate(data);
        }
    };

    var sse = $.SSE('http://beaconapp-abdallahozaifa.c9users.io:8080/queueClient', options);
    reqArr.push(sse);
    sse.start();
});
