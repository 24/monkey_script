// ==UserScript==
// @name         v2ex_unfav
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  v2ex取消收藏按钮放到点击次数旁边
// @author       far
// @match        https://www.v2ex.com/t/*
// require          http://code.jquery.com/jquery-2.1.4.min.js
// @grant           unsafeWindow
// @encoding        utf-8
// ==/UserScript==

(function() {
    var hm = $(".topic_buttons>a");
    for(var i = 0; i< hm.length; i++){
        var url = hm[i].href;
        if (url.indexOf("unfavorite") !== -1){
            $(".header").append(hm[i]);
        }
    }
})();