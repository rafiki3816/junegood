var _appResizeTimer = null;
var _appResizeInterval = 100;
var _contentContainer = null;
var _wrapper = null;
var _videoSoruce = null;
var _initChk = false;

function mainCallbackFunc(index){
   // console.log('>>> mainCallbackFunc idnex : ' + index);
   switch(index){
        case 0:
            // console.log(':: 게임방법 ::');   
            Info.initMotion();         
            break;

        case 1:
            // console.log(':: 게임시작 ::');
            Main.endMotion();
            Game.initMotion();
            break;

        case 2:
            // console.log(':: 영상보기 ::');
            Video.initMotion();
            break;

        case 3:
            // console.log(':: 처음르로 돌아가기 ::');
            Main.initMotion();
            Game.endMotion();
            break;
            
         case 10:
            console.log(':: 4 단계 모두 완료 ::');
            break;
   }
}

/**
* 윈도우 리사이즈 이벤트 핸들러
* @param  {[type]} event [description]
* @return {[type]}       [description]
*/     
function appWindowResize(event){        

    clearTimeout( _appResizeTimer );
    _appResizeTimer = setTimeout( appWindowResizeDone, _appResizeInterval );
    // console.log('>>> width : ' + Config.getInstance().appWindow.width() + ', heights : ' + Config.getInstance().appWindow.height());     
};

/**
 * 리사이즈 완료후 호출함수
 * @return {[type]} [description]
 */
function appWindowResizeDone(){
    if(Config.getInstance().isMobile()){
        mobileResize();
    }else{
        desktopResize();
    }
}

function desktopResize(){
    if(Config.getInstance().appWindow.width() > 1280){
        _wrapper.css('left', (Config.getInstance().appWindow.width() - 1280)/2);
    }else{
        _wrapper.css('left', 0);
    }

    if(Config.getInstance().appWindow.height() > 720){
        _wrapper.css('top', (Config.getInstance().appWindow.height() - 720)/2);
    }else{
        _wrapper.css('top', 0);   
    }
}

function mobileResize(){
    var windowRatio = Config.getInstance().appWindow.width() / Config.getInstance().appWindow.height();
    // console.log('>>> width : ' + Config.getInstance().appWindow.width() + ', height : ' + Config.getInstance().appWindow.height());     
    // console.log('>>> windowRatio : ' + windowRatio);
    var gameRatio;

    if(windowRatio < 1){        
        gameRatio = Config.getInstance().appWindow.height()/720;
        // console.log('::: 세로값 기준 :::');

        _wrapper.css('width', 1280 * gameRatio);
        _wrapper.css('height', Config.getInstance().appWindow.height());
    }else{
        gameRatio = Config.getInstance().appWindow.width()/1280;  
        
        // console.log('::: 가로값 기준 :::');
        _wrapper.css('width', Config.getInstance().appWindow.width());
        _wrapper.css('height', 720 * gameRatio);
    }

    //  if(windowRatio >= 1.3 && windowRatio <2.1){
    //     console.log('>>> 리사이즈 비율 <<<');
    //     _wrapper.css('height', Config.getInstance().appWindow.height());
    //     _contentContainer.css('height', Config.getInstance().appWindow.height() * windowRatio);
    // }else{
    //     _wrapper.css('height', 720 * gameRatio);
    //     _contentContainer.css('height', 720 * gameRatio);
    // }
    
    _contentContainer.css('transform-origin', '0 0'); 
    TweenMax.to(_contentContainer, 0, {scale:gameRatio});   
}

$(document).ready(function(){     
    _contentContainer = $('.container');
    _wrapper = $('.wrapper');
    _videoSoruce = $('#gameVideo-player-container');
    Config.getInstance().appWindow = $(window);

    Main.initInstance();
    Main.callBack(mainCallbackFunc);
    Video.initInstance();
    Game.initInstance();
    Game.callBack(mainCallbackFunc);
    Info.initInstance();
    SoundManager.initInstance();    

     // <source src="http://vod.kidkids.net/fy4691vol00/_definst_/teepahapa_classic/teepahapa_classic_fairydance.mp4/playlist.m3u8" type="application/x-mpegURL" />
     //                <source src="rtmp://vod.kidkids.net/fy4691vol00/_definst_/&mp4:teepahapa_classic/teepahapa_classic_fairydance.mp4" type="rtmp/mp4" />

    

    if(Config.getInstance().isMobile()){
        $('#videoPlayer').remove();
        _videoSoruce.append("<video id=\"videoPlayer\" class=\"video-js vjs-default-skin\" controls width=\"950\" height=\"570\" poster=\"./images/videoTumbnail.jpg\" data-setup='{}'><source src=\"http://vod.kidkids.net/fy4691vol00/_definst_/teepahapa_classic/teepahapa_classic_humoresque.mp4/playlist.m3u8\" type=\"application/x-mpegURL\" /></video>");
        if(window.orientation == 0) alert(' 클래식 코딩놀이는 가로보기에에 최적화되어 있습니다. 모바일을 가로보기 모드로 변경하세요.');
    }

    if(window.addEventListener){
        window.addEventListener( 'resize', appWindowResize, false );
    } else if(window.attachEvent){
        window.attachEvent('resize', appWindowResize, false);
    }


    
    appWindowResizeDone();
});