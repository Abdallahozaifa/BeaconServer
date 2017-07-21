/* global $ */
$(document).ready(function() {
    var yPosTop = 30;
    var container = $(".ATM-Pic")[0];
    var customerArr = [];
    
    var pageComponents = {
        tv: $(".tv"),
        body: $("body"),
        header: $(".header")
    };
    
    var request = {
        arr: [],
        options: {},
        sse: {}
    };

    function initializePage() {
        pageComponents.tv.css('margin-left', '8.4%');
        pageComponents.body.css('overflow', 'hidden');
        pageComponents.body.css("background", "white");
        pageComponents.header.hide();
    }

    initializePage();

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

    function generateCustomerList() {
        $(".comp").remove();
        yPosTop = 30;
        var nameCnt = 1;
        customerArr.forEach(function(customer) {
            new customerItem(nameCnt, customer.name);
            nameCnt++;
        });
    }
    // var generateCustomerList = function() {
    //     $(".comp").remove();
    //     yPosTop = 30;
    //     var nameCnt = 1;
    //     customerArr.forEach(function(name) {
    //         // createComp(nameCnt + ". " + name);
    //         new customerItem(nameCnt, name);
    //         nameCnt++;
    //     });
    // };

    var removePerson = function(name) {
        var indx, cnt = 0;
        customerArr.forEach(function(nm) {
            if (name == nm) {
                indx = cnt;
            }
            cnt++;
        });
        customerArr.splice(indx, 1);
        generateCustomerList();
    };

    function addCustomer(customer){
        customerArr.push(customer);
        generateCustomerList();
    }
    
    // var addPerson = function(name) {
    //     customerArr.push(name);
    //     generateCustomerList();
    // };
    // addPerson("Hozaifa Abdalla");
    // addPerson("Sean Kirkland");
    // addPerson("Brendon James");

    var flashAndRemoveNameAnimate = function(name) {
        var indx = 0,
            indxSelected;
        customerArr.forEach(function(nm) {
            if (nm == name) {
                indxSelected = indx;
            }
            indx++;
        });
        console.log($(".comp"));
        $($(".comp")[indxSelected]).addClass('animated infinite flash');
        // setTimeout(function(){
        //     $(".comp")[indxSelected].remove();
        //     removePerson("Hozaifa Abdalla");
        //     generateCustomerList();
        // }, 5000);
    };

    request.options.onOpen = function(e) {
        console.log("Connection Open");
    };

    request.options.onEnd = function(e) {
        console.log("Connection Closed");
        request.arr[0] = $.SSE('http://beaconapp-abdallahozaifa.c9users.io:8080/queueClient', request.options);
        request.arr[0].start();
    };

    request.options.events = {
        queue: function(e) {
            console.log("Received Data from Server");
            var data = e.data;
            console.log(data);
            var prsArr = JSON.parse(data);
            console.log(prsArr);
            customerArr = [];
            setTimeout(function() {
                if ($(".tv").attr('src') == "assets/images/Blacktv.png") {
                    $(".tv").attr('src', "assets/images/tv.png");
                    $(".header").show();
                    // $(".header").textillate({ in: {
                    //         effect: 'rotateIn',
                    //         delayScale: 1,
                    //         delay: 150,
                    //         shuffle: true
                    //     }
                    // });
                    setTimeout(function() {
                        prsArr.forEach(function(person) {
                            addCustomer(person);
                            console.log(customerArr);
                        });
                        
                        var arrSize = $(".comp").length;
                        $($(".comp")[arrSize-1]).addClass('animated infinite flash');
                        
                        setTimeout(function(){
                          $($(".comp")[arrSize-1]).removeClass('animated infinite flash');  
                        }, 3000);
                    }, 3500);
                }
                else {
                    prsArr.forEach(function(person) {
                        addCustomer(person);
                        console.log(customerArr);
                    });
                    $($(".comp")[0]).addClass('animated infinite flash');
                }
            }, 1100);
        },
        usrSelected: function(e) {
            var data = e.data;
            flashAndRemoveNameAnimate(data);
        }
    };

    request.sse = $.SSE('http://beaconapp-abdallahozaifa.c9users.io:8080/queueClient', request.options);
    request.arr.push(request.sse);
    request.sse.start();
});
