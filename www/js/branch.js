/* global $ */

/**
 * @fileOverview Javascript that runs on the branch html page.
 * @author Hozaifa Abdalla
 * @version 1.0.0
 * @module branch js
 */

$(document).ready(function() {
    /* Global Variables */
    var container = $(".ATM-Pic")[0];
    var yPosTop = 30;
    var customerArr = [];

    /** page components that contain the tv, body, and header */
    var pageComponents = {
        tv: $(".tv"),
        body: $("body"),
        header: $(".header")
    };

    /* request object with array, options, and sse object */
    var request = {
        arr: [],
        options: {},
        sse: {}
    };

    /**
     * Intializes the page with certain css properties.
     * @function
     * @module branch js
     */
    function initializePage() {
        pageComponents.tv.css('margin-left', '8.4%');
        pageComponents.body.css('overflow', 'hidden');
        pageComponents.body.css("background", "white");
        pageComponents.header.hide();
    }

    /**
     * Creates a new customer item.
     * @function
     * @module branch js
     */
    function customerItem(number, name) {
        this.number = number;
        this.name = name;
        this.h2 = document.createElement("h2");
        this.span = document.createElement("span");
        this.$span = $(this.span);
        this.h2.className = "comp";
        this.$h2 = $(this.h2);
        this.$h2.css("top", yPosTop + "%");
        this.$h2.append(this.span);
        this.$span.html(number + ". " + name);
        this.$container = $(container);
        this.$container.append(this.h2);
        yPosTop += 10;
    }

    /**
     * Creates the customer list on the tv screen.
     * @function
     * @module branch js
     */
    function generateCustomerList() {
        $(".comp").remove();
        yPosTop = 30;
        var nameCnt = 1;
        customerArr.forEach(function(customer) {
            new customerItem(nameCnt, customer.name);
            nameCnt++;
        });
    }

    /**
     * Adds a customer to the tv screen.
     * @function
     * @module branch js
     */
    function addCustomer(customer) {
        customerArr.push(customer);
        generateCustomerList();
    }

    /**
     * Flashes and removes the animated name from the tv screen
     * @function
     * @module branch js
     */
    var flashAndRemoveNameAnimate = function(name) {
        var indx = 0,
            indxSelected;
        customerArr.forEach(function(nm) {
            if (nm == name) {
                indxSelected = indx;
            }
            indx++;
        });
        $($(".comp")[indxSelected]).addClass('animated infinite flash');
    };

    var subscribe = function(callback) {
        var longPoll = function() {
            $.ajax({
                method: 'GET',
                url: '/queueClient',
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
     * Adds items to the queue on the tv screen from the customer idea 
     * @param {object} e - The customer object from the server
     * @function
     * @module branch js
     */
    var handleData = function(personArray) {
        console.log();
        var prsArr = JSON.parse(personArray);
        customerArr = [];
        setTimeout(function() {
            if ($(".tv").attr('src') == "assets/images/Tv/Blacktv.png") {
                $(".tv").attr('src', "assets/images/Tv/tv.png");
                $(".header").show();

                setTimeout(function() {
                    prsArr.forEach(function(person) {
                        addCustomer(person);
                    });

                    var arrSize = $(".comp").length;
                    $($(".comp")[arrSize - 1]).addClass('animated infinite flash');

                    setTimeout(function() {
                        $($(".comp")[arrSize - 1]).removeClass('animated infinite flash');
                    }, 3000);
                }, 3500);
            }
            else {
                prsArr.forEach(function(person) {
                    addCustomer(person);
                });
                $($(".comp")[0]).addClass('animated infinite flash');
            }
        }, 1100);
        flashAndRemoveNameAnimate(personArray);
    };


    /**
     * Main function.
     * @function
     * @module branch js
     */
    var main = function() {
        initializePage();
        subscribe(function(personArray){
            handleData(personArray);
        });
    };

    /* Main function */
    main();
});
