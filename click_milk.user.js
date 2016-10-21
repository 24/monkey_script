// ==UserScript==
// @name         click酸奶
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  自动点击下一步
// @author       far
// @require  https://gist.github.com/raw/2625891/waitForKeyElements.js
// @grant        unsafeWindow
// @grant       GM_xmlhttpRequest
// @match       http://radius.ejoy.com/huodong/?qa=*
// ==/UserScript==
(function() {

    function get_header_value(key,lineString) {
        var  arrayOfLines = lineString.match(/[^\r\n]+/g);
        for(var i=0;i<arrayOfLines.length;i++){
            var lines  = arrayOfLines[i];
            var first = lines.indexOf(":");
            var line_key = lines.substring(0,first);
            if (line_key == key){
                var line_value = lines.substring(first+1,lines.length);
                return line_value;
            }

        }
    }

    function getDoc(url, callback) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            headers: {
                'User-agent': window.navigator.userAgent,
                'Content-type': null
            },
            onload: function (responseDetail) {
                var doc = '';
                if (responseDetail.status == 200) {
                    // For Firefox, Chrome 30+ Supported
                    doc = new DOMParser().parseFromString(responseDetail.responseText, 'text/html');
                    if (doc === undefined) {
                        doc = document.implementation.createHTMLDocument("");
                        doc.querySelector('html').innerHTML = responseText;
                    }
                }
                callback(doc, responseDetail);
            }
        });
    }

    var end_hour = 12;
    var page_url = "http://radius.ejoy.com/huodong/qa-theme/SnowFlat/js/snow-core.js?"+Math.random();
    getDoc(page_url,function(doc,responseDetail){
        var time = get_header_value("Date",responseDetail.responseHeaders);
        var curDate = new Date(time);
        if (curDate.getHours() == end_hour && curDate.getMinutes() ==0){

        }
        console.log("服务器时间是："+curDate.getFullYear()+"-"+(curDate.getMonth()+1)+"-"+curDate.getDate()+" "+curDate.getHours()+":"+curDate.getMinutes()+":"+curDate.getSeconds());
    });

    return;

    var answer ="111111";


    var myString = window.location.href;
    var myRegexp = /.*qa=(\d*).*/g;
    var match = myRegexp.exec(myString);
    if(match[1]){
        var qa = match[1];
        waitForKeyElements ("#q_doanswer", function(){
            var qdoanswer  = $("#q_doanswer");
            if(qdoanswer){
                //console.log(qdoanswer);
                qdoanswer.click();
                var post_inpt = $("#a_content_ckeditor_data");

                if(post_inpt){
                    post_inpt.value =answer;
                }
                if (qa_ckeditor_a_content){
                    qa_ckeditor_a_content.setData( post_inpt.value);
                }
                //$(".qa-form-tall-button-answer").click();

            }
        });


    }

})();