var Main = function(){

    var _main;
    var _callbackFunc;    

     function initInstance(){
        _main = $('#main');

        var button = $('.button-ui-main');

        button.click(function(event){
            var index = $(event.currentTarget).parent().index();    
            // console.log('>>> click idnex : ' + index);
            _callbackFunc(index);
            SoundManager.playSound(SND_CLICK);
        });        

        button.mouseenter(function(event){
            //console.log(':: button.mouseenter ::');            
            var over = $(event.currentTarget).parent().find('.basicButton-active');           
            TweenMax.to( over , 0.3, {autoAlpha:1, ease:Cubic.easeOut});
            SoundManager.playSound(SND_OVER);
        });

        button.mouseleave(function(event){            
            var over = $(event.currentTarget).parent().find('.basicButton-active');            
            TweenMax.to( over , 0.2, {autoAlpha:0, ease:Cubic.easeOut});
        });
    }

    function initMotion(){
        TweenMax.to(_main, 1, {y:0, ease:Cubic.easeOut});
    }

    function endMotion(){
        TweenMax.to(_main, 1, {y:-720, ease:Cubic.easeOut});
    }

    /**
     * 메인 view 이벤트
     * @param  {Function} callback [main 이벤트 콜백함수]
     * @return {[type]}            [none]
     */
    function callBack(callbackFunc){
        _callbackFunc = callbackFunc;
    }

    return {
        initInstance:initInstance,
        initMotion:initMotion,
        endMotion:endMotion,
        callBack:callBack
    };
}();