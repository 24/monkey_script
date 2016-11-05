// ==UserScript==
// @name         2ni
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  2ni
// @author       far
// @match        http://www.2ni.la/*
// require			http://code.jquery.com/jquery-2.1.4.min.js
// @grant			unsafeWindow
// @encoding		utf-8
// ==/UserScript==

(function() {
    var hm = $("#hm>a");
    //var hm = document.getElementsByClassName("hm");
    console.log(hm.length);
    for(var i=0;i<hm.length;i++){
        var old = hm[i].href;
        hm[i].href = "http://moon.moondown.net/2mm.php?url="+old;
        console.log(hm[i].href);
    }

})();