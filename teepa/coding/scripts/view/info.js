var Info = function(){

	var _info;
	var _content;
	var _cover;
	var _ul;
	var _currentIndex = 0;
	var _totalIndex = 4;
	var _leftBtn;
	var _rightBtn;

	function addEvent(){
		var closeButton = $('#gameInfo-content-closeBtn');

        closeButton.click(function(event){
        	endMotion();

        	SoundManager.playSound(SND_CLICK);
        });

        closeButton.mouseover(function(event){
            SoundManager.playSound(SND_OVER);
        });

        _leftBtn.click(function(event){
        	changePrevIndex();
        	
        	SoundManager.playSound(SND_CLICK);
        });

        _leftBtn.mouseover(function(event){
            SoundManager.playSound(SND_OVER);
        });         

        _rightBtn.click(function(event){
        	changeNextIndex();
        	
        	SoundManager.playSound(SND_CLICK);
        });

        _rightBtn.mouseover(function(event){
            SoundManager.playSound(SND_OVER);
        });  
	}

	function addMobileEvent(){
		var closeButton = $('#gameInfo-content-closeBtn');

        closeButton.bind('touchend', function(event) {
        	endMotion();

        	SoundManager.playSound(SND_CLICK);
        });

        _leftBtn.bind('touchend', function(event) {
        	changePrevIndex();
        	
        	SoundManager.playSound(SND_CLICK);
        });   

        _rightBtn.bind('touchend', function(event) {
        	changeNextIndex();
        	
        	SoundManager.playSound(SND_CLICK);
        });
	}

	function changeNextIndex(){
		var index = _currentIndex;
		index ++;

		if(_totalIndex - 1 <= index){
			index = 3;

			TweenMax.to(_leftBtn, 0, {autoAlpha:1});
			TweenMax.to(_rightBtn, 0, {autoAlpha:0});
		}else{
			TweenMax.to(_leftBtn, 0, {autoAlpha:1});
			TweenMax.to(_rightBtn, 0, {autoAlpha:1});
		}

		TweenMax.to(_ul, 0.7, {left:-(818*index), ease:Cubic.easeOut});

		_currentIndex = index;
	}

	function changePrevIndex(){
		var index = _currentIndex;
		index --;

		if(index <= 0){
			index = 0;

			TweenMax.to(_leftBtn, 0, {autoAlpha:0});
			TweenMax.to(_rightBtn, 0, {autoAlpha:1});
		}else{
			TweenMax.to(_leftBtn, 0, {autoAlpha:1});
			TweenMax.to(_rightBtn, 0, {autoAlpha:1});
		}

		TweenMax.to(_ul, 0.7, {left:-(818*index), ease:Cubic.easeOut});

		_currentIndex = index;
	}

	function initInstance(){
		_info = $('#gameInfo');
		_content = $('#gameInfo-content');
		_cover = $('#gameInfo-cover');
		_ul = $('#gameInfo-content-container-ul');
		_leftBtn = $('#gameInfo-content-leftBtn');
		_rightBtn = $('#gameInfo-content-rightBtn');

		TweenMax.to(_content, 0, {top:1070});
		TweenMax.to(_cover, 0, {autoAlpha:0});

		if(Config.getInstance().isMobile()){
            addMobileEvent();
        }else{
            addEvent();
        }
	}

	function initMotion(){
		_currentIndex = 0;
		TweenMax.to(_leftBtn, 0, {autoAlpha:0});
		TweenMax.to(_rightBtn, 0, {autoAlpha:1});
		TweenMax.to(_info, 0, {autoAlpha:1});
		TweenMax.to(_ul, 0, {left:0});
		TweenMax.to(_content, 0.6, {top:350, ease:Cubic.easeOut});
		TweenMax.to(_cover, 0.5, {autoAlpha:1, ease:Cubic.easeOut});
	}

	function endMotion(){
		TweenMax.to(_info, 0, {delay:0.6, autoAlpha:0});
		TweenMax.to(_content, 0.6, {top:1070, ease:Cubic.easeOut});
		TweenMax.to(_cover, 0.5, {autoAlpha:0, ease:Cubic.easeOut});
	}

	return {
        initInstance:initInstance,
        initMotion:initMotion,
        endMotion:endMotion
    };
}();