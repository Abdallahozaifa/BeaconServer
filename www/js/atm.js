/* global Image, $, swal */

/**
 * @fileOverview Javascript that runs on the atm html page.
 * @author Hozaifa Abdalla
 * @version 1.0.0
 * @module atm js
 */

$(document).ready(function() {
    /* Global Variables */
    var scrollTimeOut;
    var options = {}; // options object for the sse(server side event)
    var reqArr = []; // request array 
    var billYTop = 72; // dollar bill css property for top
    var time = 1000; // dollar bill time start

    /**
     * Creates the atm text on the atm.
     * @function
     * @param {string} greeting - The greeting for the customer.
     * @param {string} name - The name of the customer.
     * @module atm js
     */
    var createAtmText = function(greeting, name) {
        var windowWidth = $(window).width();
        var customerName = $(".customer-name");
        var customerWelcome = $(".customer-welcome");

        switch (greeting) {
            case 1:
                customerWelcome.text("Welcome");
                break;
            case 2:
                customerWelcome.text("Hola");
                customerWelcome.css("left", "735px");
                break;
            case 3:
                customerWelcome.text("Bonjour");
                customerWelcome.css("left", "700px");
                break;
        }

        customerName.text(name);
        var multiplier;
        var customerNameLen = customerName.text().length;
        if (name == "Hozaifa Abdalla") {
            multiplier = 0.327;
        }
        else if (name == "Brendon James") {
            multiplier = 0.325;
        }
        else if (name == "Sean Kirkland") {
            multiplier = 0.329;
        }
        else if (customerNameLen >= 17) {
            multiplier = 0.35;
        }
        else if (customerNameLen > 15 && customerNameLen < 17) {
            multiplier = 0.335;
        }
        else if (customerNameLen >= 13 && customerNameLen <= 15) {
            multiplier = 0.325;
        }
        else if (customerNameLen >= 10 && customerNameLen <= 12) {
            multiplier = 0.37;
        }
        else if (customerNameLen >= 7 && customerNameLen < 10) {
            multiplier = 0.36;
        }
        else if (customerNameLen >= 4 && customerNameLen <= 6) {
            multiplier = 0.37;
        }
        customerName.css("left", windowWidth * multiplier + "px");
    };
    /**
     * Creates the money bills on the atm.
     * @function
     * @param {string} bill - The amount of the bill.
     * @module atm js
     */
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

    /**
     * Calculates the change for the transaction.
     * @function
     * @param {string} amount - The money amount from the transaction.
     * @module atm js
     */
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

    /**
     * Displays the the bills based on the amounts given .
     * @function
     * @param {string} amount - The money amount from the transaction.
     * @module atm js
     */
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

    /**
     * Scrolls the page down.
     * @function
     * @module atm js
     */
    function pageScroll() {
        window.scrollBy(0, 1);
        scrollTimeOut = setTimeout(pageScroll, 10);
    }

    /**
     * Function that preloads the images into the cache when the page loads.
     * @function
     * @param {array} array - The array of images to be preloaded on the page.
     * @module atm js
     */
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

    var subscribe = function(callback) {
        var longPoll = function() {
            $.ajax({
                method: 'GET',
                url: '/event',
                success: function(data) {
                    callback(data)
                },
                complete: function() {
                    longPoll()
                },
                timeout: 30000
            });
        };
        longPoll();
    };

    /**
     * Function that preloads the images into the cache when the page loads.
     * @function
     * @param {string} n - .
     * @module atm js
     */
    var isNumeric = function(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    };
    
    var handleData = function(customer) {
        console.log(customer);
        var customer = JSON.parse(customer);
        console.log(customer);
        
        if (customer.languages == "English") {
            createAtmText(1, customer.name);
        }
        else if (customer.languages == "Spanish") {
            createAtmText(2, customer.name);
        }
        else if (customer.languages == "French") {
            createAtmText(3, customer.name);
        }

        /* Customers wants to complete a transaction */
        if (isNumeric(customer.amount) == true) {
            swal({
                title: "Transaction Receipt",
                type: 'success',
                text: "$" + customer.amount + ".00" + ' will be withdrawn!',
                timer: 5000
            });

            setTimeout(function() {
                displayChange(customer.amount);
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
            if (customer.promotion != undefined) {
                swal({
                    title: 'Promotion Available!',
                    imageUrl: "http://beaconapp-abdallahozaifa.c9users.io:8080/assets/images/Atm-promotions/" + customer.promotion,
                    imageWidth: 400,
                    imageHeight: 200,
                    animation: true,
                    showCloseButton: true,
                    html: $('<div>')
                        .addClass('animated wobble')
                        .text('A new promotion is available.'),
                    timer: 5000
                });
                setTimeout(function() {
                    window.location.reload();
                }, 8000);
            }
        }
    };
    
    /**
     * Main function.
     * @function
     * @module atm js
     */
    var main = function() {
        preloadImages([
            "http://beaconapp-abdallahozaifa.c9users.io:8080/assets/images/Atm-welcome/GeneralWelcomeATM.png",
            "http://beaconapp-abdallahozaifa.c9users.io:8080/assets/images/Atm-welcome/blankAtm.PNG",
            "http://beaconapp-abdallahozaifa.c9users.io:8080/assets/images/Atm-promotions/brewery.gif",
            "http://beaconapp-abdallahozaifa.c9users.io:8080/assets/images/Atm-promotions/chasecard.png",
            "http://beaconapp-abdallahozaifa.c9users.io:8080/assets/images/Atm-promotions/saphhirecard.png",
            "http://beaconapp-abdallahozaifa.c9users.io:8080/assets/images/money/10dollar.jpg",
            "http://beaconapp-abdallahozaifa.c9users.io:8080/assets/images/money/20dollar.jpg",
            "http://beaconapp-abdallahozaifa.c9users.io:8080/assets/images/money/50dollar.jpg",
            "http://beaconapp-abdallahozaifa.c9users.io:8080/assets/images/money/100dollar.jpg"
        ]);
        
        subscribe(function(customer){
            handleData(customer);
        });
    };

    /* Main function */
    main();

});
