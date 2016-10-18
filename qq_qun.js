// ==UserScript==
// @name         qq群文件批量下载
// @description  批量下载群文件
// @author       farwmarth<wujiyu115@gmail.com>
// @require        http://code.jquery.com/jquery-2.1.1.min.js
// @include      http://qun.qzone.qq.com/group*
// @grant        GM_setClipboard
// @version      1.0
// @namespace https://greasyfork.org/users/1438
// ==/UserScript==


(function(){

    var groupid= 0;
    var uin = 0;
    var g_tk=0;

    var  downloadFileByIframe = function(a, d) {
        QZFL.cookie.set("FTN5K", a.cookie);
        var c = document.createElement("iframe");
        c.style.display = "none";
        document.body.appendChild(c);
        c.contentWindow.location = QZFL.userAgent.ie <= 8 && /(html|xhtml|htm|sgml|shtml|dhtml|shtm)$/.test(d.filename) ? a.url + "/" + d + ".txt" : a.url + "/" + d;
    };

    var downloadAll = function() {
        g_tk = QWT.getACSRFToken();
        uin=g_iUin;
        var restUrl="http://qun.qzone.qq.com/cgi-bin/group_share_list?uin="+uin+"&groupid="+groupid+"&bussinessid=0&charset=utf-8&g_tk="+g_tk+"&r=" + Math.random();
        $.get(restUrl, function(result) {
            if (result) {
                var item_list = result.substring(result.indexOf("(")+1,result.lastIndexOf(")"));
                var datas=JSON.parse(item_list);
                if(datas.code===0){
                    var items = datas.data.item;
                    for(var i in items){
                        var item_file_path=items[i].filepath;
                        var file_name =items[i].filename;
                        var item_url  ="http://qun.qzone.qq.com/cgi-bin/group_share_get_downurl?uin="+uin+"&groupid="+groupid+"&pa="+item_file_path+"&charset=utf-8&g_tk="+g_tk+"&r=" + Math.random();
                        $.get(item_url, (function(use_filename){ return function(item_result) {
                            if(item_result){
                                var item_result_json = item_result.substring(item_result.indexOf("(")+1,item_result.lastIndexOf(")"));
                                var item_result_json_obj=JSON.parse(item_result_json);
                                if (item_result_json_obj.code===0) {
                                    // var real_down_url = item_result_json_obj.data.url+"/"+use_filename;
                                    // console.log(real_down_url);
                                    // console.table(item_result_json_obj);
                                    //GM_setClipboard(real_down_url,'text');
                                    downloadFileByIframe(item_result_json_obj.data,use_filename);

                                } else {
                                    console.log("得到文件真实地址获取数据出错"+item_result_json_obj.code );
                                }
                            }
                        };
                                                               })(file_name));
                        //break;
                    }
                }else{
                    alert("得到文件列表出错");
                }
            }
        });
    };

    setTimeout(function(){
        var herf_info  = location.href;
        var myRe = /http:\/\/qun.qzone.qq.com\/group#\!\/(.*)\/share/g;
        var is_match = myRe.exec(herf_info);
        if (is_match) {
            groupid=RegExp.$1;
            var upload_select = document.getElementById('GroupShare_uploadSelect');
            $('<a class="btn" style="padding-left:10px"><span class="btn-val">批量下载</span></a>')
            .insertAfter(upload_select)
            .click(downloadAll);
        }
    }, 3000);

})();