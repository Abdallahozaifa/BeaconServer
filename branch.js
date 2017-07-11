/* global $ */
$(document).ready(function() {
    var yPosTop = 25;
    var container = $(".ATM-Pic")[0];

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
    createComp("1. Hozaifa Abdalla");
    createComp("2. Brendon James");
    createComp("3. Sean Kirkland");
    createComp("4. Sean Kirkland");
    createComp("5. Sean Kirkland");
    createComp("6. Sean Kirkland");
});
