var Video = function(){
    var _video;

    function initInstance(){
        _video = $('#gameVideo');

        var button = $('.button-ui-video');

        button.click(function(event){
            endMotion();
            SoundManager.playSound(SND_CLICK);
        });

        TweenMax.to(_video, 0, {autoAlpha:0});

        /*
        var swfVersionStr = "16.0.0";
        // To use express install, set to playerProductInstall.swf, otherwise the empty string. 
        var xiSwfUrlStr = "./images/playerProductInstall.swf";
        var flashvars = {};
        var params = {};
        params.quality = "high";
        params.wmode = "transparent";
        params.allowscriptaccess = "sameDomain";
        params.allowfullscreen = "true";
        var attributes = {};
        attributes.id = "videoPlayer";
        attributes.name = "videoPlayer";
        attributes.align = "middle";
        swfobject.embedSWF(
            "./images/VideoPlayer.swf", "gameVideo-player-container", 
            "950", "528", 
            swfVersionStr, xiSwfUrlStr, 
            flashvars, params, attributes); 
        */
    }

    function initMotion(){
        TweenMax.to(_video, 0.5, {autoAlpha:1, ease:Cubic.easeOut});
        
        // document.getElementById("videoPlayer").sendToActionScript();
    }

    function endMotion(){
        TweenMax.to(_video, 0.3, {autoAlpha:0, ease:Cubic.easeOut});
        var video = vjs.players["videoPlayer"];
        video.pause();
        video.currentTime(0);

        // document.getElementById("videoPlayer").sendToActionScript();
    }

    return {
        initInstance:initInstance,
        initMotion:initMotion,
        endMotion:endMotion
    };
}();