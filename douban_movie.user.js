// ==UserScript==
// @name         豆瓣电影搜索
// @namespace    far
// @version      0.1_2016-10-19
// @description  在 movie.douban.com 网站下直接显示下载链接，可通过多个站点获取。
// @author       farwmarth
// @match        https://movie.douban.com/subject/*
// @connect      mp4ba.com
// @connect      4567.tv
// @require      https://cdn.bootcss.com/jquery/2.2.3/jquery.min.js
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// ==/UserScript==


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

function ad() {
    var strCSS = "";
    strCSS += "#dale_movie_subject_top_right,";
    strCSS += "#dale_movie_subject_top_midle,";
    strCSS += "#content div.qrcode-app,";
    strCSS += "#content div.ticket";
    strCSS += "{display:none}";

    document.head.appendChild(document.createElement("style")).textContent = strCSS;
}
ad();

var titles = $("#content > h1 > span")[0].textContent.split(" ");
var movieTitle = titles[0];
var enMovieTitle = "";
//for(var i=1;i<titles.length;i++){
//    enMovieTitle = enMovieTitle+" "+titles[i];
//}

function imdb() {
    imdb = $("div#info a[href^='http://www.imdb.com/title/tt']");
    imdbS = imdb.text();
    if (imdbS && imdbS.startsWith('tt')) {
        imdbS = imdbS.slice(2);

        kickass();
    }
}
function kickass() {
    var noAdcancedSearch = true;
    var kickass = "https://kat.al/";

    if  (noAdcancedSearch){
        kickass = $("<a href=\"" + kickass +"\" target=\"_blank\" rel=\"nofollow\" style=\"margin-left: 6px;\">kickass</a>");
        imdb.after(kickass);
    }else{
        kickass = $("<a href=\"" + kickass + "usearch/imdb:" + imdbS + "/\" target=\"_blank\" rel=\"nofollow\" style=\"margin-left: 6px;\">kickass</a>");
        imdb.after(kickass);
    }

}
imdb();

function part_sites() {
    var str = "";
    str += ".sites {";
    str += "    margin-bottom:30px;";
    str += "    background: #F4F4EC;";
    str += "}";
    str += ".sites-body {";
    str += "    line-height:24px;";
    str += "    letter-spacing:-0.31em;";
    str += "    *letter-spacing:normal;";
    str += "}";
    str += ".sites-body a {";
    str += "    display:inline-block;";
    str += "    *display:inline;";
    str += "    letter-spacing:normal;";
    str += "    margin:0 8px 8px 0;";
    str += "    padding:0 8px;";
    str += "    background-color:#f5f5f5;";
    str += "    -webkit-border-radius:2px;";
    str += "       -moz-border-radius:2px;";
    str += "            border-radius:2px;";
    str += "}";
    str += "";
    str += ".sites-body a:link,";
    str += ".sites-body a:visited {";
    str += "    background-color:#f5f5f5;";
    str += "    color: #37A;";
    str += "}";
    str += "";
    str += ".sites-body a:hover,";
    str += ".sites-body a:active {";
    str += "    background-color: #e8e8e8;";
    str += "    color: #37A;";
    str += "}";
    str += ".sites-body a.sites_r0 {";
    str += "    text-decoration: line-through;";
    str += "}";

    document.head.appendChild(document.createElement("style")).textContent = str;


    // add the sites part
    str = "";
    str += "<div class=\"sites\">     ";
    str += "    <h2>";
    str += "        <i class=\"\">---------相关影视站点---------</i>";
    str += "              ";
    str += "    </h2>";
    str += "        <div class=\"sites-body\">";
    str += "        </div>";
    str += "    </div>";

    var sites = $(str);
    $("#content div.tags").before(sites);
}
part_sites();
var sites = [];
function add_sitelink(link, title, text) {
    if (!text){
        text = title;
    }
    if (title) {
        // title += " (*)";
    } else {
        return;
    }

    link = $("<a href=\"" + link + "\" class=\"\" target=\"_blank\" rel=\"nofollow\" title=\"" + title + "\">" + text + "</a>");
    link = $("#content div.sites-body").append(link);
    link = link.children();
    link = link[link.length -1];
    sites.push(link);

}
add_sitelink("http://edmag.net/search-" + movieTitle + ".html", "EDMag.net", "EDMAG.NET");
add_sitelink("http://cili03.com/?topic_title3=" + movieTitle, "cili03.com", "CILI001");
add_sitelink("http://www.zimuku.net/search?q=" + movieTitle, "zimuku.net", "字幕库");
add_sitelink("http://www.zimuzu.tv/search/index?keyword=" + movieTitle, "zimuzu.tv", "字幕组");


function part_netdisk() {
    var str = "";
    str += ".netdiskLinks {";
    str += "    margin-bottom:30px;";
    str += "    background: #F4F4EC;";
    str += "}";
    str += ".netdiskLinks-body {";
    str += "    line-height:24px;";
    str += "    letter-spacing:-0.31em;";
    str += "    *letter-spacing:normal;";
    str += "}";
    str += ".netdiskLinks-body a {";
    str += "    display:inline-block;";
    str += "    *display:inline;";
    str += "    letter-spacing:normal;";
    str += "    margin:0 8px 8px 0;";
    str += "    padding:0 8px;";
    str += "    background-color:#f5f5f5;";
    str += "    -webkit-border-radius:2px;";
    str += "       -moz-border-radius:2px;";
    str += "            border-radius:2px;";
    str += "}";
    str += "";
    str += ".netdiskLinks-body a:link,";
    str += ".netdiskLinks-body a:visited {";
    str += "    background-color:#f5f5f5;";
    str += "    color: #37A;";
    str += "}";
    str += "";
    str += ".netdiskLinks-body a:hover,";
    str += ".netdiskLinks-body a:active {";
    str += "    background-color: #e8e8e8;";
    str += "    color: #37A;";
    str += "}";

    document.head.appendChild(document.createElement("style")).textContent = str;


    // add the netdiskLinks part
    str = "";
    str += "<div class=\"netdiskLinks\">     ";
    str += "    <h2>";
    str += "        <i class=\"\">---------网盘链接---------</i>";
    str += "             ";
    str += "    </h2>";
    str += "        <div class=\"netdiskLinks-body\">";
    str += "        </div>";
    str += "    </div>";

    var netdiskLinks = $(str);
    $("#content div.tags").before(netdiskLinks);

}
part_netdisk();
function add_netdisklink(link, title, text) {
    if (!title) {
        title = "百度网盘";
    }
    if (!text) {
        text = "加密分享";
    }
    link = $("<a href=\" " + link + " \" class=\"\" target=\"_blank\" rel=\"nofollow\" title=\"" + title + "\">"+ text +"</a>");
    $("#content div.netdiskLinks-body").append(link);
}
add_netdisklink("http://panc.cc/s/"+movieTitle+"/de_0", "panc.cc", "胖次");
add_netdisklink("http://www.wangpansou.cn/s.php?op=baipan&q=" + movieTitle, "wangpansou.cn", "网盘搜搜");


function parse_netdisklink(sdoc) {
    var re = /(pan.baidu.com\/s\/[a-zA-Z0-9]+)\s*.+\s*([0-9a-zA-Z]{4})/g;
    var m;
    while ((m = re.exec(sdoc)) !== null) {
        if (m.index === re.lastIndex) {
            re.lastIndex++;
        }
        var u = "http://" + m[1] + "#" + m[2];

        add_netdisklink(u, "");
    }
}

function site_mp4ba() {
    if (!movieTitle) {
        return;
    }
    var url = "http://www.mp4ba.com/search.php?keyword=" + movieTitle;
    getDoc(url, function (doc) {
        var urls = $("a[href^='show.php?hash=']", doc);
        sites[0].className = "sites_r" + urls.length;
        // mp4ba.count = urls.length;
        for (i = 0; i < urls.length; i++) {
            var url = "http://www.mp4ba.com/" + urls[i].getAttribute("href");
            getDoc(url, function (doc, url) {
                parse_netdisklink(doc.body.outerText);
            });
        }
    });
}
site_mp4ba();

function site_4567() {
    if (!movieTitle) {
        return;
    }
    var url = "http://www.4567.tv/search.asp";
    var data = "typeid=2&keyword=" + encodeURI(movieTitle);

    postDoc(url, function (doc) {
        var urls = $(".play-img",  doc);
        console.log("docl:"+urls.length);
        for (i = 0; i < urls.length; i++) {
            var au =  urls[i].getAttribute("href");
            var url = "http://www.4567.tv/" +au;
            console.log(au);
            getDoc(url, function (doc, url) {
                parse_netdisklink(doc.body.outerText);
            });
        }
    },data);
}
//site_4567();



function part_customizeSearch() {
    var str = "";
    str += ".customizeSearch {";
    str += "    margin-bottom:30px;";
    str += "    background: #F4F4EC;";
    str += "}";
    str += ".customizeSearch-body {";
    str += "    line-height:24px;";
    str += "    letter-spacing:-0.31em;";
    str += "    *letter-spacing:normal;";
    str += "}";
    str += ".customizeSearch-body a {";
    str += "    display:inline-block;";
    str += "    *display:inline;";
    str += "    letter-spacing:normal;";
    str += "    margin:0 8px 8px 0;";
    str += "    padding:0 8px;";
    str += "    background-color:#f5f5f5;";
    str += "    -webkit-border-radius:2px;";
    str += "       -moz-border-radius:2px;";
    str += "            border-radius:2px;";
    str += "}";
    str += "";
    str += ".customizeSearch-body a:link,";
    str += ".customizeSearch-body a:visited {";
    str += "    background-color:#f5f5f5;";
    str += "    color: #37A;";
    str += "}";
    str += "";
    str += ".customizeSearch-body a:hover,";
    str += ".customizeSearch-body a:active {";
    str += "    background-color: #e8e8e8;";
    str += "    color: #37A;";
    str += "}";

    document.head.appendChild(document.createElement("style")).textContent = str;


    // add the netdiskLinks part
    str = "";
    str += "<div class=\"customizeSearch\">     ";
    str += "    <h2>";
    str += "        <i class=\"\">---------自定义搜索---------</i>";
    str += "              ";
    str += "    </h2>";
    str += "        <div class=\"customizeSearch-body\">";
    str += "        </div>";
    str += "    </div>";

    var customizeSearch = $(str);
    $("#content div.tags").before(customizeSearch);

}
part_customizeSearch();
function add_customizeSearch(link, title, text) {
    if (!title) {
        title = "自定义搜索";
    }
    if (!text) {
        text = "自定义搜索";
    }
    link = $("<a href=\" " + link + " \" class=\"\" target=\"_blank\" rel=\"nofollow\" title=\"" + title + "\">"+ text +"</a>");
    $("#content div.customizeSearch-body").append(link);
}
add_customizeSearch("https://www.baidu.com/s?wd=" + movieTitle + " rip BD", "百度 rip BD", "baiKeyS");
add_customizeSearch("http://www.id97.com/search?q=" + movieTitle, "id97 http://www.id97.com/", "id97");
