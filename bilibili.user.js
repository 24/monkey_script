'use strict';// ==UserScript==
// @name         bilibili-关闭弹幕自动播放
// @namespace    https://www.farwmarth.com
// @version      0.8
// @description   bilibili-关闭弹幕自动播放
// @author       jeayu
// @match        *://www.bilibili.com/video/*
// @match        *://bangumi.bilibili.com/*
// @grant GM_setValue
// @grant GM_getValue
// ==/UserScript==
(function() {
    var old_end = loadProgress.end;
    loadProgress.end = function() {

        old_end();
        setTimeout(function(){
            $('div.bilibili-player-video-control div.bilibili-player-video-btn.bilibili-player-video-btn-start', this.currentDocument).click();
            $('div.bilibili-player-video-control div.bilibili-player-video-btn.bilibili-player-video-btn-danmaku', this.currentDocument).click();
            $('.bilibili-player-danmaku-setting-lite-panel', this.currentDocument).hide();
        },1000);
    };

})();