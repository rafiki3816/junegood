var _appResizeTimer = null;
var _appResizeInterval = 100;
var _contentContainer = null;
var _initChk = false;

function mainCallbackFunc(index){
   console.log('>>> mainCallbackFunc idnex : ' + index);
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
    // console.log('::: 리사이즈 완료 :::');

    var windowRatio = Config.getInstance().appWindow.width() / Config.getInstance().appWindow.height();
    console.log('>>> width : ' + Config.getInstance().appWindow.width() + ', heights : ' + Config.getInstance().appWindow.height());     
    console.log('>>> windowRatio : ' + windowRatio);
    var gameRatio;

    if(windowRatio < 1.3){
        gameRatio = Config.getInstance().appWindow.height()/720;
        // console.log('::: 세로값 기준 :::');
    }else{
        gameRatio = Config.getInstance().appWindow.width()/1280;
        // console.log('::: 가로값 기준 :::');
    }
    
    // _contentContainer.css('overflow-x', 'auto');
    _contentContainer.css('transform-origin', '0 0');
    _contentContainer.css('transform', 'scale(' + gameRatio + ')');
    // _contentContainer.css('zoom', gameRatio*100 + '%');

    console.log('>>> gameRatio : ' + gameRatio);
    console.log('>>> after > width : ' + _contentContainer.width() + ', heights : ' + _contentContainer.height());       
}


$(document).ready(function(){ 
    _contentContainer = $('.container');
    Config.getInstance().appWindow = $(window);

    window.addEventListener( 'resize', appWindowResize, false );
    appWindowResizeDone();
});
