// ==UserScript==
// @name         免vip视频播放
// @namespace    far
// @version      0.1
// @description  vip视频播放
// @author       farwmarth
// @include      http://www.mgtv.com/b/*
// @include      http://www.iqiyi.com/v_*
// @include      http://www.iqiyi.com/jilupian/*
// @include      http://www.letv.com/ptv/vplay/*
// @include      http://www.le.com/ptv/vplay/*
// @include      https://v.qq.com/x/*
// @include      http://tv.sohu.com/*
// @include      http://v.youku.com/v_show/id_*
// @include      http://v.youku.com/v_playlist/*
// @require      https://cdn.bootcss.com/jquery/2.2.3/jquery.min.js
// @run-at       document-end
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// ==/UserScript==

(function() {
    var link = location.href;
    var vip_links = {
        vip_common: [
            {name:"无名小站", href:"http://www.wmxz.wang/video.php?url="+link},
            {name:"爱看tv", href:"http://jx.aikantv.cc/index.php?url="+link},
            {name:"moondown", href:"http://moon.moondown.net/tong.php?url="+link},
            {name:"000o", href:"http://000o.cc/jx/ty.php?url="+link},
            {name:"yydy8", href:"http://www.yydy8.com/Common/?url="+link},
            {name:"ckparse", href:"http://www.ckparse.com/ckparse/?url="+link},
        ]
    };
    // top.location.href = " http://www.wmxz.wang/video.php?url=" + link;

    function create_float_div(div_name){
        var _highest = 0;

        $("div").each(function() {
            var _current = parseInt($(this).css("zIndex"), 10);
            if(_current > _highest) {
                _highest = _current + 1;
            }
        });
        $('body').append('<div id=\"' + div_name + '\" style="position:fixed;top:100px;z-index:'+_highest+';left:20px;background:#ecebeb;border:1px solid #333;border-radius:5px;height:100px;width:200px;">  </div>');
    }

    function add_div_link(div_name, link, text) {
        var link_e = $("<a href=\" " + link + " \" class=\"\" style=\"float:left;margin:10px\" target=\"_self\" rel=\"nofollow\" title=\"" + text + "\">" + text + "</a>");
        $("#"+div_name).append(link_e);
    }

    for (var part in vip_links) {
        create_float_div(part);
        vip_links[part].forEach(
            function(item, i) {
                add_div_link(part, item.href, item.name);
            }
        );
    }

})();