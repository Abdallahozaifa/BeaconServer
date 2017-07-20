/* global Image, $, swal */
$(document).ready(function() {
    var appImg = $("#appImg"); // application image
    var options = {}; // 
    var reqArr = [];
    var billYTop = 79;
    var scrollTimeOut;
    var time = 1000;

    var createAtmText = function(greeting, name){
        var windowWidth = $(window).width();
        var customerName = $(".customer-name");
        var customerWelcome = $(".customer-welcome");
        
        switch(greeting){
            case 1:
                customerWelcome.text("Welcome!");
                break;
            case 2:
                customerWelcome.text("¡Hola!");
                customerWelcome.css("left", "735px");
                break;
            case 3: 
                customerWelcome.text("Bonjour!");
                customerWelcome.css("left", "700px");
                break;
        }
        
        customerName.text(name);
        var multiplier;
        var customerNameLen = customerName.text().length;
        if(customerNameLen >= 12 && customerNameLen <= 15){
            multiplier = 0.36;
        }else if(customerNameLen >= 10 && customerNameLen < 12){
            multiplier = 0.37;
        }else if(customerNameLen > 15 && customerNameLen < 17){
            multiplier = 0.335;
        }else if(customerNameLen >= 17){
            multiplier = 0.35;
        }else{
            multiplier = 0.38;
        }
        customerName.css("left", windowWidth * multiplier + "px");
    };
    
    var createBill = function(bill) {
        var img = document.createElement("img");
        if (bill == "100") {
            img.src = "assets/images/money/100dollar.jpg";
        }
        else if (bill == "50") {
            img.src = "assets/images/money/50dollar.jpg";
        }
        else if (bill == "20") {
            img.src = "assets/images/money/20dollar.jpg";
        }
        else if (bill == "10") {
            img.src = "assets/images/money/10dollar.jpg";
        }
        $(img).css("width", "300px");
        $(img).css("height", "126px");
        img.className = "money";
        $(img).css("top", billYTop + "%");
        $("body").append(img);
        billYTop += 4;
    };

    var calculateChange = function(amount) {
        var total, currentBill;
        var bills = [];

        currentBill = Math.floor(amount / 100);
        bills.push(currentBill);
        total = amount - (currentBill * 100);

        currentBill = Math.floor(total / 50);
        bills.push(currentBill);
        total = total - (currentBill * 50);


        currentBill = Math.floor(total / 20);
        bills.push(currentBill);
        total = total - (currentBill * 20);

        currentBill = Math.floor(total / 10);
        bills.push(currentBill);
        total = total - (currentBill * 10);
        return bills;
    };

    var displayChange = function(amount) {
        var bills = calculateChange(amount);
        var mnyCnt = 0;
        var crntBill;
        var billsArr = [];
        bills.forEach(function(bill) {
            if (bill > 0) {
                switch (mnyCnt) {
                    case 0:
                        crntBill = 100;
                        break;
                    case 1:
                        crntBill = 50;
                        break;
                    case 2:
                        crntBill = 20;
                        break;
                    case 3:
                        crntBill = 10;
                        break;
                }

                for (var i = 0; i < bill; i++) {
                    billsArr.push(crntBill);
                }
            }
            mnyCnt++;
        });

        billsArr.forEach(function(money) {
            setTimeout(function() {
                createBill(money);
            }, time);
            time += 1000;
        });
    };

    function pageScroll() {
        window.scrollBy(0, 1);
        scrollTimeOut = setTimeout(pageScroll, 10);
    }

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
                            swal({
                                title: "Transaction Receipt",
                                type: 'success',
                                text: "$" + amount + ".00" + ' will be withdrawn!',
                                timer: 5000
                            });

                            setTimeout(function() {
                                displayChange(amount);
                                pageScroll();
                                setTimeout(function() {
                                    clearTimeout(scrollTimeOut);
                                    $(".money").addClass("animated bounceOutDown");
                                    setTimeout(function() {
                                        // $('body').scrollTop(0);
                                        window.location.reload();
                                    }, 4000);
                                }, time + 2000);
                            }, 5400);
                        }
                        else {
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
                                    timer: 3000
                                });
                                setTimeout(function() {
                                    // window.location.reload();
                                }, 3000);
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
});
