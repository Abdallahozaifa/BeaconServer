/* global Image, $, swal */
var appImg = $("#appImg");
var options = {};
var reqArr = [];

/* Function that preloads the images into the cache when the page loads*/
var preloadImages = function(array) {
    if (!preloadImages.list) {
        preloadImages.list = [];
    }
    var list = preloadImages.list;
    for (var i = 0; i < array.length; i++) {
        var img = new Image();
        img.onload = function() {
            var index = list.indexOf(this);
            if (index !== -1) {
                // remove image from the array once it's loaded
                // for memory consumption reasons
                list.splice(index, 1);
            }
        };
        list.push(img);
        img.src = array[i];
    }
};

preloadImages([
    "http://beaconapp-abdallahozaifa.c9users.io:8080/assets/images/ATMWelcome/ATMGeneralWelcome.png",
    "http://beaconapp-abdallahozaifa.c9users.io:8080/assets/images/ATMWelcome/ATMBlank.PNG",
    "http://beaconapp-abdallahozaifa.c9users.io:8080/assets/images/ATMGreeting/ATMWelcomeHozaifa.png",
    "http://beaconapp-abdallahozaifa.c9users.io:8080/assets/images/ATMGreeting/ATMWelcomeBrendon.png",
    "http://beaconapp-abdallahozaifa.c9users.io:8080/assets/images/ATMGreeting/ATMWelcomeSean.png"
]);

options.onOpen = function(e) {
    console.log("Connection Open");
};

options.onEnd = function(e) {
    console.log("Connection Closed");
    reqArr[0] = $.SSE('http://beaconapp-abdallahozaifa.c9users.io:8080/event', options);
    reqArr[0].start();
};

var isNumeric = function(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
};

options.events = {
    beacon: function(e) {
        console.log("Received Data from Center");
        var dataArr = e.data.split('\n');
        var img = dataArr[0];
        var amount = dataArr[1];

        appImg.fadeOut(1000, function() {
            $(this).attr('src', img).bind('onreadystatechange load', function() {
                if (this.complete) $(this).fadeIn(300, function() {
                    if (isNumeric(amount) == true) {
                        swal(
                            'Transaction Completed!',
                            "$" + amount + ".00" + ' has been Withdrawn!',
                            'success'
                        );
                    }
                    else {
                        console.log("Received img!");
                        console.log(amount);
                        if (amount != undefined) {
                            swal({
                                title: 'Promotion Available!',
                                imageUrl: "http://beaconapp-abdallahozaifa.c9users.io:8080/" + amount,
                                imageWidth: 400,
                                imageHeight: 200,
                                animation: true,
                                showCloseButton: true,
                                html: $('<div>')
                                    .addClass('animated wobble')
                                    .text('A new promotion is available.'),
                            });
                        }
                    }
                });
            });
        });
        reqArr[0].stop();
    }
};

var sse = $.SSE('http://beaconapp-abdallahozaifa.c9users.io:8080/event', options);
reqArr.push(sse);
sse.start();
