/*
* @Author: wujiyu
* @Date:   2016-11-16 15:47:53
* @Last Modified by:   wujiyu
* @Last Modified time: 2016-11-16 16:20:15
*/
var GmUtils = (function () {
    function GmUtils(environment) {
        this.env = environment;
    }
    GmUtils.prototype.setEnv = function (environment) {
        this.env = environment;
    };
    GmUtils.prototype.getAll = function () {
        var rtnVal = GM_listValues();
        this.log('getAll:' + rtnVal);
        return rtnVal;
    };
    GmUtils.prototype.getVal = function (key, defaultVal) {
        var rtnVal = GM_getValue(key, defaultVal);
        this.log('getVal:' + rtnVal);
        return rtnVal;
    };
    GmUtils.prototype.setVal = function (key, val) {
        GM_setValue(key, val);
    };
    GmUtils.prototype.delVal = function (key) {
        GM_deleteValue(key);
    };
    GmUtils.prototype.log = function (message) {
        //level 是可选的，默认值是0。其有效的值有：0 - 信息、1 - 警告、2 - 错误。
        if (this.env.toLowerCase() === 'debug') {
            GM_log('调试信息: ' + message);
        }
        else {
            //GM_log(message);
        }
    };
    GmUtils.prototype.addStyle = function(css){
        GM_addStyle(css);
    };
    GmUtils.prototype.DOMAttrModified = function(obj, fn){
        obj.addEventListener("DOMAttrModified", fn, false);
    };
    return GmUtils;
})();

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
            callback(doc, responseDetail.finalUrl);
        }
    });
}


function postDoc(url, callback, data) {
    GM_xmlhttpRequest({
        anonymous: true,
        method: 'POST',
        url: url,
        headers: {
            'User-agent': window.navigator.userAgent,
            'Content-type': 'application/x-www-form-urlencoded'
        },
        data: data,
        onload: function (responseDetail) {
            callback(responseDetail.responseText, responseDetail.finalUrl);
        }
    });
}