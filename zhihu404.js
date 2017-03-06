// ==UserScript==
// @name        知乎404跳转
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.zhihu.com/question/http*
// @grant        none
// ==/UserScript==

(function() {
    var link = location.href;
    var sub_target = "https://www.zhihu.com/question/";
    var real_url = link.replace(sub_target,"");
    console.log(real_url);
    window.location.href = real_url;
})();