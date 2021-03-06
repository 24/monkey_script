// ==UserScript==
// @name         豆瓣电影搜索
// @namespace    far
// @version      0.1_2016-10-19
// @description  在 movie.douban.com 网站下直接显示下载链接
// @author       farwmarth
// @match        https://movie.douban.com/subject/*
// @require      https://cdn.bootcss.com/jquery/2.2.3/jquery.min.js
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// ==/UserScript==
function getJSON(url, callback) {
    var request = new XMLHttpRequest();
    request.open('GET', url);

    request.onload = function () {
        if (this.status >= 200 && this.status < 400)
            callback(JSON.parse(this.responseText));
        else
            console.log('Error getting ' + url + ': ' + this.statusText);
    };

    request.send();
}

function isEmpty(s) {
    return !s || s === 'N/A';
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

function part_div(div_name) {
    var str = "";
    str += "." + div_name + " {";
    str += "    margin-bottom:30px;";
    str += "    background: #F4F4EC;";
    str += "}";
    str += "." + div_name + "-body {";
    str += "    line-height:24px;";
    str += "    letter-spacing:-0.31em;";
    str += "    *letter-spacing:normal;";
    str += "}";
    str += "." + div_name + "-body a {";
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
    str += "." + div_name + "-body a:link,";
    str += "." + div_name + "-body a:visited {";
    str += "    background-color:#f5f5f5;";
    str += "    color: #37A;";
    str += "}";
    str += "";
    str += "." + div_name + "-body a:hover,";
    str += "." + div_name + "-body a:active {";
    str += "    background-color: #e8e8e8;";
    str += "    color: #37A;";
    str += "}";
    document.head.appendChild(document.createElement("style")).textContent = str;
    str = "";
    str += "<div class=\"" + div_name + "\">     ";
    str += "    <h2>";
    str += "        <i class=\"\">-----------------------"+div_name+"------------------------</i>";
    str += "             ";
    str += "    </h2>";
    str += "        <div class=\"" + div_name + "-body\">";
    str += "        </div>";
    str += "    </div>";
    var netdiskLinks = $(str);
    $("#content div.tags").before(netdiskLinks);

}

function add_div_link(movie_site_div, link, text) {
    link = $("<a href=\" " + link + " \" class=\"\" target=\"_blank\" rel=\"nofollow\" title=\"" + text + "\">" + text + "</a>");
    $("#content div." + movie_site_div + "-body").append(link);
}

(function () {
    //  评分-----------------------------------------------------------------
    var id = document.querySelector('#info a[href^="http://www.imdb.com/"]');
    if (!id)
        return;
    id = id.textContent;
    getJSON('https://www.omdbapi.com/?tomatoes=true&i=' + id, function (data) {
        if (isEmpty(data.imdbRating) && isEmpty(data.Metascore) && isEmpty(data.tomatoMeter) && isEmpty(data.tomatoUserMeter))
            return;
        var ratings = document.createElement('div');
        ratings.style.padding = '15px 0';
        ratings.style.borderTop = '1px solid #eaeaea';
        var sectl = document.getElementById('interest_sectl');
        var rating_wrap = document.querySelector('.friends_rating_wrap');
        if (!rating_wrap)
            rating_wrap = document.querySelector('.rating_wrap');
        sectl.insertBefore(ratings, rating_wrap.nextSibling);
        // IMDb
        if (!isEmpty(data.imdbRating)) {
            ratings.insertAdjacentHTML('beforeend',
                '<div class="rating_logo">IMDb评分</div>' +
                '<div class="rating_self clearfix">' +
                    '<strong class="ll rating_num">' + data.imdbRating + '</strong>' +
                    '<div class="rating_right">' +
                        '<div class="ll bigstar' + 5 * Math.round(data.imdbRating) + '"></div>' +
                        '<div style="clear: both" class="rating_sum"><a href=http://www.imdb.com/title/' + id + '/ratings target=_blank>' + data.imdbVotes.replace(/,/g, '') + '人评价</a></div>' +
                    '</div>' +
                '</div>'
            );
            // Check for IMDb Top 250
            if (data.imdbRating >= 8) {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: 'https://app.imdb.com/chart/top',
                    onload: function (top) {
                        var list = JSON.parse(top.responseText).data.list.list;
                        var number = function () {
                            for (var i = 0; i < list.length; i++)
                                if (list[i].tconst === id)
                                    return i + 1;
                            return null;
                        } ();
                        if (!number)
                            return;
                        // inject css if needed
                        if (document.getElementsByClassName('top250').length === 0) {
                            var style = document.createElement('style');
                            style.innerHTML = '.top250{background:url(https://s.doubanio.com/f/movie/f8a7b5e23d00edee6b42c6424989ce6683aa2fff/pics/movie/top250_bg.png) no-repeat;width:150px;font:12px Helvetica,Arial,sans-serif;margin:5px 0;color:#744900}.top250 span{display:inline-block;text-align:center;height:18px;line-height:18px}.top250 a,.top250 a:link,.top250 a:hover,.top250 a:active,.top250 a:visited{color:#744900;text-decoration:none;background:none}.top250-no{width:34%}.top250-link{width:66%}';
                            document.head.appendChild(style);
                        }
                        document.querySelector('h1').insertAdjacentHTML('beforebegin', '<div class="top250"><span class="top250-no">No.' + number + '</span><span class="top250-link"><a href="http://www.imdb.com/chart/top">IMDb Top 250</a></span></div>');
                        [].forEach.call(document.getElementsByClassName('top250'), function (e) {
                            e.style.display = 'inline-block';
                        });
                    }
                });
            }
        }

        // Metascore
        if (!isEmpty(data.Metascore)) {
            var metascore = parseInt(data.Metascore);
            var metacolor;
            if (metascore >= 60)
                metacolor = '#6c3';
            else if (metascore >= 40)
                metacolor = '#fc3';
            else
                metacolor = '#f00';
            ratings.insertAdjacentHTML('beforeend',
                'Metascore: ' +
                '<span style="background-color: ' + metacolor + '; color: #fff; height: 24px; width: 24px; line-height: 24px; vertical-align: middle; display: inline-block; text-align: center; font-weight: bold">' +
                    data.Metascore +
                '</span>'
            );
        }

        // Rotten Tomatoes
        if (isEmpty(data.tomatoMeter) && isEmpty(data.tomatoUserMeter))
            return;
        if (!isEmpty(data.Metascore))
            ratings.insertAdjacentHTML('beforeend', '<br>');
        var tomatoimg = {
            "certified": "iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAEyElEQVR4AdWTY4DkSABGXyXpTqYxRk+PT2sLZ9u2bdu2bdvmeG27b8dWWkhSZxO/7sWo7xX53yP4C/yGGtx7M/f+20xWtivNE5mOBAGicp4zZ+4C53Pg3X8l0DVh3H+695GjDuLwxqjklsd8lBbaDN/Y+vZaP89FcaHDqDyn9dQbkxcBz/xtwaAC19CZz3jm1a4X+gfVOhcfH+G9SjejBqeonaMzYpDFgy96OHi3GMUBG78Oi2fw3lG3mwcAsT8VDP4m/FV97pd9GB/WGDS1KRQVSE4+IMxDs3OZEjTJVGwkMHJQikPPz+SW80z6TMGSma7lwNA/FBiaMFY+m9V307uanpUuOfmgKO9U6l+HR4lZKue9HKQs6HDqZm3oikN/WLAipHHZPX5KAjbnHh7htefFPcCZfI/Gzzh3d//NxaNj+hYtBg++4qG8THLkPjGqm7O5e3ohfQv6aGkQxNI34ooxK8nwwdANbIZtlGLUJjajh1sEjzHOGHXowE1A629a0Pt2Vuym9zRji/EpSgocKsocLvyigh7Nz4LVCTxzenAhMXYsYJdglHHlvWwV6MaMCl76OI0PanROODDCp2/LH1vxo2Byhb5Z9XPu2qNu9JHhl1xwdJgQmTxYE6AkIVmUpaFKgcsFAUUwfrrJ/CIXnjGCC8vX8dS7GmZEECxwGO6jFQj+QnDqlhlX335H8goFAaqksdbLxx/ks9faGHqGxsW7ZeCNSbRei/WjvJz2Qi+jVsWYm6XSMtTNTic30tCnMHyjFMl13h+zNX5cUEjHUnCkgHZB5u1+DvYluW+cQXxsBkWmxa5zTQY1WNwmFELFGsPXCEYOOIysj6MZfoacY2IlVaTb4TeDLEAIW0UCqToDxxaIPJWzvQauiAuJRqo4RSoe46DP+5kxwYcEpABUSHyShn52GGwBUe23gvqQtU5J6EgNFFNF1UDRBcKrIoJ+SElEdwzFLSiwYKMVMRQBErAERBQHY5WOXurQFib+G8H8hvgnyoCXL9bGsRokVliiNMdRZBy1O4qqqCTaTGhPIWLg9Fnca6cYprkwHQdHKuQuTRKIChbPEp/8RhBOOD33vas0dRZdUrzDhdvyxGMPc8TRx4G0KdtgI6ZOHE9HcwPX3HgTjz76KG9VVhOq+ozLH36IpfPn49EVojc4HHPErjQ3zO35jaB4WP7F9WPLi70rY8xpNJm9cAVjmsMYHi+azCXc20V1kyTUESPl7uHFV98jsMlwTDNBTTPsd9Il335vcATqpOBRwNE/CrICaUcUb2js3dJuo/TbrP3oCzq7ljKz3WL9nDcZ1OlQvtmevL8uwsKuJPH+TGa0xhk+qBB/YQXvrYvy8hM3EdjvEtpMSVZMEl7acefCytZLRGbAc9wxD41+tDeUojIkiX/cCgKMybnEpnei+DUc00IIkFIihIIQgmQq+e2zy+OGpETNMbC/mQRZBsVjM9huTx+rq8IIAN3jOmT/28c//1FlBDuRAkBLOM1OOBni7yBxlOy0LSxVQqZOsSLJlomFdU+v3kkD8Aa8g1r7QF3aRv/KvhoBQ4Bi/gG2Y5+lKNrx/lxPhdgukJbwGkMmHD+iDQD/oLxPfGWZ1wA6/Hc86d7di7fccJbb5R7N/56vAEDvDGwghbBBAAAAAElFTkSuQmCC",
            "fresh": "iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAFBElEQVR4Aa2VA7TszBpEd6c7yfiY13q2bdu2bdu2bdu2bdtHGGei7u9l8Ju4tVaNsKtaieJsyA917djNjrzk9z/a/hzwKc6BDGdDpbo/e3i1es3NYPtrrX+1K0B0XAI8rUJtvKA6E+6J/9XV57/I9PX/mGX/A77D2ZQ6xRuFBzgAE+r6ngvO3ODoFVfuV58LyvZPvSs1zt+wP/3W/56YRPnuf3698xGgc45GIChvam/1KqsXnLnYwQvN3nTPhWeulXStIXO0kjb/+vh/zEVue/AZUvPi1f8kgx+ttT8GJGd7BABTvlm5/NX3vlEuM3/TxaUSTdH8+7d9yv/oUGsY6pecJlguMb8z2M7/3Pvd5k+3Pv/DP+y8D/jXWQYESgXXPDh7p/lbHnhcfqh6QV02DFKo4fhnU6hVNIcWNO4fEUEno1sExg2fcGvw73984l8v/M5vN98CJKcbMOXpmdtecvWljasu3fNif4459p+UPx30+f6NF9ChR9bLiaqG0PeY++uA+759g1rHsjal+d2hkJ9dosLar7ff88Wv/euRwPYpAspKlZ+8uvzWix1o3PFyu5YlrSAsrODpt1vk9/tC7vyONbpW+MpN5hkcrnCjLzS5ywe2yX2FlwstDd89EvCTne6HX/aX/90DiE4MeHh95glPm5t7fqWqyBYNa4s+67OGv84FfPlgmUN/6/O4r7ao/zvn+0XjN99/menA48kv/C9hIuRG4TswuaPvK17YbT4NeDaAdwE/uPADGtMPV3VNuuwTzfv8YUbzw1mffxrFdX/X5cH/TPCXA9pHQq7Ycdzxg9sMrBCXNZ5jpMyDQRHqKcV9a1MP/fygf/HCmJuUardaDM2yqiqkoalO+1y3EXD9IMTzFH7FJ1tIiHQKqdCZN1z5rwl/+GWfqKKY3RUEheIkzXt64abl6q2BX5orh+Wr4wMlUKGCqoaZMt5CHVUyJO2EfLODF+dQUtgSeL7H5X4VQS6Id0o4gAOuGJavCWD2G3MIBSiFGAWeQrRGygGqXoIhWHuFx9+pwkkAB9YzlIJMn4SXCTxFmNFmH4ApKVXCAVYgH1uSDNcejJ/7KZLZwoLkbvw9inIuoECGhglCSIFYhIE4H8A0rdtdzlklFlQkSD9HBTHWOZTWSJpDO0H1LcQCiYCVERg1AU9aJwgRMED4n827AOZ3efLrC2bBRaQn2HaGNuDsMCxHlMLlDgq4a2fQdhAJOBA1BmeT1hHD1kJfHD3n+FUa/xbAfDmOPnvrSv2O0negwUqOShwq9MBTkDskLty20BRcIghCJpw0HQzBhZ2li9DKUr4fDz4zCeh/7odp/N3LB6Ur03GQgnQtEqoTA4hB+oIkQgYjeMKkNePWXWfp2Jx2nvHrOPrRr7Pk0wAK4CrFlnrX3MrHpjxvGgAP0JOvRRAL1o3hyaR1xLCxG8HbtoC7bNR8LYk7n8iy2wJfOsXF7o7Vxj1eOr3w+lCpEsJIMrKQAhlCDEQiI/ecK2xpuXHrVhKzlSXZ16x9MPDm071c36Rcu9XTp+ZecNj4xxyQTxYxnrTuU1gsPetonwDOEpppwj/z/G8/FnkS8MEzveEcMv7R+9amH3bdcuWWs57ZOxA32R1CT9x4ngu38rQAx/w3zf73B3Gf+BO8Cvjj6d9wTkdHjH+BS4Wla1zQhFde0PqCGuaK9n4zy9LNLGn+O0//8A/rvrsG3wB+xxno/+N5rMoDguFXAAAAAElFTkSuQmCC",
            "rotten": "iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAFZ0lEQVR4Ac1UA5Qj7RYMhwjGtk10upOsbTtr28YoM6uxbRtr29Zv22a9O3q265w6za+uwPtr0Jfo+npGWmuDBzsUmDmYTOYL+GLevwsSCwNmbVzQq02XGbRcZZBWF/VDgMoumc/ni/51dT5PMGK2e8uJ+yR+TYHGSyw6bjI4Uhn9i8zGaNi/rC/SEZqu14a+X3eRRWEnsYNFEV2zmxVwCTRf+fv/CsVCqaFcP5zS6ScQ8vX+qrCugdhW31jHpfvHiUt8LpWdYJHZqEBmgwLZTQoklSpg5Sqd1v+/qZ3xcM3G0GuZdWO+0BYM/yh0iFO+SFdo9mfFnfzMVmw7EvLGnszwDwKUtomWzpJpuzKivslq4nC4gkV6HYcFO0Le0zEQ2/MIBjK9wPXaqPcbLo6hGo3H2YfTUXFyAryibVP+RNzS0WRIZn3El513GFSeY5Fcx/5q7iSZbOYombJOG/nN0SolDpVzCB7kkNt/xj3Mam9KtZLqokRqjRpZTYNRc3Ykxi8JfC4QCoz/wECI0mpj01UFyk+zyGjhkNKoQuQo57Ie426yhTvSGRJRImK4U1FPjcRCySiN14XDFRwSilloiXRFer0KU9YEfUx1sfnD9PjI55SdYlByksORWhZJ5PHymIiPKYopcnuTieuTon44WsVhV2b096M1nicmL/O9ElvA/qIt5ZBUxuJgGaWxkkgRRY/1eEbz8ocRiPVEVpOW+1zKP9brfWwJBy0d2put+GVnGvNrQhGLeGJiCQvyGgeJ9B1JNSpoy5WIp/9jCllM3xAKmbXxvj8/tdQ9oUMcMpfFhn+SSIdIDIml5F05RwIs4sjb35LEY4hT14ciYqTHNz6MwzOXQOsrEkvDWPJewvtroC6xDVDbpx8oYn89VMshsYolT8nbavK8pptKpDQpsSE5Guau8nahjtCFz+cJe8bzr4EicLawN2KlFgbBFtSiW1Ijv87q4JDazCGtpY/NbM81o40MVzJQTHA7ae4snSqxMlLrmeh6UfcY/NnF4BxovnZ5TMhre3Iiv9qaFvHpgaLo7zNau0XZPnJIb+0mS+IsyDByqV5ZnQrElDDYmBL5w+xtQW+rpnlesPSQL/+DiZbbGY/clhb+Sd7xnoPE3mtmO4ucrl5vM0k0u5Mj0to4zaH8ghJVl1WouqRG3dXBaLk1DJ33RuH4gwlIrh4OP7VDqUDUF03wEMei5AYFCfaIEVnkHe8VyyCPS86qUHpWjfLzA9F4YyjiC5U/RI5wur5iT8T7px9NxenHM3DmyWycfzYXF15ocOe1xcisHQtbP/NtNO2hPEtX6ZyY4sivKy5wKD6jQs1lNfI6VVBO9bjoq7TPT6sf/N3Jx5Nw/P5UXH5pDtbsY94X6QlDdQzF0Zu0qvdvv7oYF19aiEsvLcD55wt6ruceaDBoms81O1/z/bzu/R400P5o0fEhaL89FmUnR4MZ59ZG3SEX6Yls1sYwL918ZSF5Nx/XX1mEmhNTYOko2csjWHuaripun4irLy9A15056LgxG81XZhCnY8zCwFfdI2xo8gnd+bJykU4KG+gQa+9lqhGKBEa9q1hgsmBz+PUbJHz2iQZnHmsoCg0mzA19nb65dDvHjHPvKOmaiOKuSUij1CRXjcburEHwYR0vmzlIdvH+FlQTPKpPPZiD1qszUHd+CkU5HbNWRf1I0z+gp72pPQfO8Lm3PFaBRfsZTN8agbCRbu/pGekMobY1/5sGTCwN1Uv2Mh/HFQ3r8WzO+mjYeZi108TKfn84bbzNdjr4W5abOUgTxboiP94/AjIyyD3KrtMl2OaWsZnBnh7P/p0QUcGltiarjC0MD4j1hNG8/yf8BrCAoJdN16WUAAAAAElFTkSuQmCC",
            "full": "iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAFK0lEQVR4AZTNQ4DsWAAF0JsXFJIygm/btm3btoXN2LZt27bRtm2nKprGdlr3mYegndA0ocMhV5gQilzdO+CmJ25c9uonL576dtwIaSLQEo/b4aUag/9Ju8CC2SMXvvP8kQ/uuW7Vfdu3bdkxdfLkWZNHKdPO7Z5288wJvRY8eOuORy4cmn4ZgNUpQJF8XWZM6DH7zMEFF7o52bFrZvQ53G/kVNnrZ4WqyiJj0crVM568afkbC4bZ9nf30SMH9vYM7TDg8/C+2y/NffiFOzZ8On6oNM0VFk04esLUSmCodfaKzDRaL/sFvoCd93Xvj5lzV8zZu2XCoQ4BTo7hH7pp3RMrlk9f6g0rdF3BP+AYjYS72VGUGgPG0hES/SgvZlBTrsGqL4TXU0sU0d6dt3N8m4AblOeOwd0fmT1JWuUMjQYIi/rKepSn/IyKrBgwQg9wPAOV6Ql/r/7wSjx0tQJ15dWYMm7IotsPL76Xp2mhVWC34D2y4uj0LXzXYdCqs2GoVRBHzIKnx1BUF1fBrImBFjUg9ekFWktDpLYCFiuDYRlYhKLnDnLt3m8XTrYKjAczla7gYA/2hIpy1FQVorqkGLSgINyrJyJVpYCpw2YzQTu6gqK8cCsKNLMIzpAXLkcAM3jHvFaBCEEDc9fnqNx9A7TPEsDWmjDqMgEOYCUFoVETUakZSE7JBngB4AREc9Nh/ZgG9sbPYLv6PqKa2dAqkMLR8XB5YL70O6wz74E++gmc1/6GyOnXoF33HYw7f4brmVgID/4I9fRLIOc+gLbrbXDXJUB7NgYmKyCGpf9qFUiHlSo8fDfI0H6wiAVU69C/y4P2bgzURz5Bwy3vgn74ezje/hvW+3HQv4gBVanDpCyQwb3geuRupFpmYqtAXl1NTtTnjRBZApFEuF9+GsL9N4MKCiDdJNj3bodt72ZYXYKAT2g8u63xzjMgsghalhAN+CK5tTU5rQIFqppXEBtbClEEGlQwo0bAcWAvYLM3IgEI99zW2O4AFQoBNq7prPHOyP8qK4cEWK4Aip42Y3tFyR5CDJNRsImY09j2t+2wzVJbVY+prmnQSfHp3vMEbBhiY4175dexE4bDfwRMYdKv1R3uvhOzXKA8H2MtqVwOKxUYk7wIBfl8EtZ+gFkssbGmX/vDmcL4HwELa+f9334fmttvwypJNJsjUylMoZjErbFYazBSYotFVDqNms0wSmBjTffX3wdbj3/bKsJWo97W112HtaCnUyRgSwWMUmhrURa01glAA2I6QxnLVtOp1zrA5t8A1Pv9miqXkPkCejzBAKZcTEz11sgatJLoUikB6MkUlSsgqxVqg/4fOze77mTSWksp1DVXI12PxKRYRmuJwiSQBBZDJSA8DxOXDYUQncm4uRMwULI38YOZufEGhOsiAV0uoZRBaoNKAApVKiKAyHFRcdlpMFoMpRzsBDgi6nmDgW/vuQfpeFjAlEoordFSIqVAJi0ooxOAA/fchT8ceI4QvZ2AhWXS/O67YD0eI6OQDKCvvZZIa1Q6g8pkENpgr7mWJC/cEE4m1L75NphZO9oJAKKfzp/73Dt5kmWrzeqzL5GLBWo7XZ0hdjjEpMAs5qzjvFWzjXfyFHvOn/sCiP4LgO/Wq9ffN+L5oF4T/UceZ/X9D6TSsHzgYRYPPJQA5j/8RPfRx/HjMh8Z+eK369Wr/+fQX705Dp58ehrc+7YMXz6wWR88G4U/n2+1m6earT+OhZuzezerve+J8JVnp8F9b4z9J4DV3xn9CYgbvHRBBzqoAAAAAElFTkSuQmCC",
            "spilled": "iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAEXklEQVR4Ae2UQ6MjWRiG33NOpVJIUhX7KpdtjW3btpfzG2Y9mxE2Y9tm27Z9jSRlTKaGbaz7LfP5jBM6kgiOQ5SCyxTFCeOnpa9L5sOtS2b2vw7gexxE3GHpFEwQOSUS4zOpjFpKZ5XmbE5tbatUWjip2gZhRw+ciBKLRcd/8/76YQALD+sBH2aR7smpyxvfd2Tz6VJzU1ux0trekkwlE+lkTpEkWTbtKtGMUSxa/wH29m3Gip+SsHSKbPeueW89t/JyAEMHBSTSQuW6+5tePfusc87oKJ0Lx7VQ1QYwPLYLo7VeaMYQdHMMrufAhw9BYujfImPl7zI8l6BtiubPn7PkTgBvHQAgBPS2J7o/PPW8wrXETsL3AI6FIAoKZFFBTM4iKmcgNc55TsacFW9i9+AibFqQwe6NPBgF5LgNHWtfBPDoPjkIiyxWaIpMa+4MnT2t63JMb38UPjzwnADWgOyvmjaE35a8ANsGasMMjPoglMDQGMS00PnF2xsUAKP/Alo6Yme19agXqaqY6O3rxXztUxjWGCy7Bt2swrQ12LYRbI5nw3bq0N29IE4EpkZAGAAgCBPxWJLjiLQPIF2QxmcL0kT4PFatmwutPhOUAoRQUMYQHAkJzhnh4MMGEz24dgi+R0EI4CPYAT4VKSP7uM01SjArRbhUrabjunOfQnvTGbBtG5RSMEIARkB8EkD4sIB122bhk9+ehO+GIIoyQHzADwBgjOcIAdsHYFtu3bY93bE89A/ugcRvhuvaoIwDoyzYaLBRCEIMtfoIPN8DYRxURQGhPnxQ+B6BSTkfjWUfQHXE2l0btXdnCyK+/vVpGIYZWEUaG0BAKQEJQkRBwMCFGGQlFHgkRRX4YKAE4BqgvjqxPM939gEM9hoblYTWUqpwmDHpBkysXIKRai8MqwbTqsO2dZh2HYb5Z+J1GNYoeodXgcLGxHYeYeZAtxXsHCLQBrQR1/GNfQDbN47NMgyn2j4+fJ9ujGQkMYGonIYgRMCHJHCcEPQECEGIA6q1Pjz79r0Yre3E2VNGkRHqsHgev65T4Lqt2rd0g3XQTr705uaXuyZGH5T4JCgNwXHNv5stCllqQKUkVKUQHOev+BBbdy3Hw1fciS41jj2bF4AQAeFkS+/Fd794NoD1+Fv/ZnzXlvpsQUa+p3ty1xnTb2PlwkSSTVQg8BEYZg39Q9uweccCrNn4E+raACyXQIaBKc05REsTURvYiWg8JYyf0Fnp7xvEgqVbN45VdYfsO4YJpyb5rkxO6Sw3FdtLTbm2YqnU1N7W1dwYd4lYLK6KgiQ2QomvZ74Es7oV906ahpbWqUDYgM8SQSn7zgC+XUA++fHXxT+Qo5n9gsipUYXPp9JqUyIdbS2VcxXGG20O65vQU0hHWtTSxrOnTu+CuUsaHBrarVaupG99OPPNWXOXzyI4ToVFFm/rjF1BeGRH99o/P3DLRVcrvB6fu3DtPCtU1mbNXTFzeGRsGCd0JP0BLHO0MJZ4Kw0AAAAASUVORK5CYII="
        };
        if (!isEmpty(data.tomatoMeter)) {
            ratings.insertAdjacentHTML('beforeend',
                "<a href=" + data.tomatoURL + " target=_blank style='background:none'><span style='background: url(data:image/png;base64," + tomatoimg[data.tomatoImage] + ") no-repeat; background-size: cover; width: 18px; height: 18px; margin: 0 2px; vertical-align: middle; display: inline-block'></span></a>" +
                "<span style='vertical-align: middle; display: inline-block; line-height: 18px'>" + data.tomatoMeter + "%</span>"
            );
        }
        if (!isEmpty(data.tomatoUserMeter)) {
            var userimage;
            if (parseFloat(data.tomatoUserRating) >= 3.5)
                userimage = "full";
            else
                userimage = "spilled";

            ratings.insertAdjacentHTML('beforeend',
                "<a href=" + data.tomatoURL + " target=_blank style='background:none'><span style='background: url(data:image/png;base64," + tomatoimg[userimage] + ") no-repeat; background-size: cover; width: 18px; height: 18px; margin: 0 2px; vertical-align: middle; display: inline-block'></span></a>" +
                "<span style='vertical-align: middle; display: inline-block; line-height: 18px'>" + data.tomatoUserMeter + "%</span>"
            );
        }
    });

    //搜索----------------------------------------------------------------------------------
    // var movieTitle = $('h1 span:eq(0)').text();
    // var title = $('html head title').text();
    // var keyword1 = title.replace( '(豆瓣)', '' ).trim();
    // var keyword2 = encodeURIComponent( keyword1 );
    // var movieSimpleTitle = movieTitle.replace(/第\S+季.*/, "");
    var titles = $("#content > h1 > span")[0].textContent.split(" ");
    var movieTitle = titles[0];

    var movie_links =
        {
            sites:[
                { html: "讯影", href: "http://www.saaee.com/search?q=" + movieTitle},
                { html: "97电影网", href: "http://www.id97.com/search?q=" + movieTitle},
                { html: "BT之家", href: "http://www.btbtt.la/search-index-keyword-" + movieTitle + ".htm" },
                { html: "片源网", href: "http://pianyuan.net/search?q=" + movieTitle },
                { html: "电影FM", href: "http://dianying.fm/search/?text=" + movieTitle },
                { html: "影粉搜搜", href: "http://s.yfsoso.com/s.php?q=" + movieTitle },
                { html: "RARBT", href: "http://www.rarbt.com/index.php/search/index.html?search=" + movieTitle },
                { html: "720P.im", href: "http://720p.im/search.php?q=" + movieTitle },
                { html: "豆瓣皮", href: "http://movie.doubanpi.com/?key=" + movieTitle },
                { html: "ED2000", href: "http://www.ed2000.com/FileList.asp?SearchWord=" + movieTitle },
                { html: "小兵播放", href: "http://www.xbplay.com/query/" + movieTitle },
                { html: "电影天堂", href: "http://zhannei.baidu.com/cse/search?&s=4523418779164925033&q=" + movieTitle },
                { html: "嘎嘎影视", href: "http://www.gagays.com/movie/search?req%5Bkw%5D=" + movieTitle },
                { html: "EDMag", href: "http://edmag.net/search-" + movieTitle + ".html" },
                { html: "CILI001", href: "http://cili03.com/?topic_title3=" + movieTitle},
                { html: "胖次", href: "http://panc.cc/s/"+movieTitle+"/de_0"},
                { html: "网盘搜搜", href: "http://www.wangpansou.cn/s.php?op=baipan&q=" + movieTitle },
                { html: "百度搜索", href: "https://www.baidu.com/s?wd=" + movieTitle + " rip BD" },
            ],
            captions:[
                { html: "字幕库", href: "http://www.zimuku.net/search?q=" + movieTitle  },
                { html: "字幕组", href: "http://www.zimuzu.tv/search/index?keyword=" + movieTitle },
                { html: "Sub HD字幕站", href:  "http://subhd.com/search/" + movieTitle },
                { html: "第三楼字幕网", href:  "http://zhannei.baidu.com/cse/search?click=1&s=8073048380622477318&nsid=&q=" + movieTitle },
                { html: "163字幕网", href: "http://www.163sub.com/Search?id=" + movieTitle },
            ]
        };

    ad();

    for (var part in movie_links) {
        part_div(part);
        movie_links[part].forEach(
            function(item, i) {
                add_div_link(part, item.href, item.html);
            }
        );
    }

})();