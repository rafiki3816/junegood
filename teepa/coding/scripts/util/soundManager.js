var SND_OVER = "over";
var SND_CLICK = "click";
var SND_BGM = "bgm";
var SND_STAR = "star";

var SoundManager = function(){

	function initInstance(){
		createjs.Sound.registerSound("./images/over.mp3", SND_OVER);
		createjs.Sound.registerSound("./images/click.mp3", SND_CLICK);
		createjs.Sound.registerSound("./images/bgm.mp3", SND_BGM);
		createjs.Sound.registerSound("./images/star.mp3", SND_STAR);
	}

	function playSound(id){
		createjs.Sound.play(id);
	}

	function stopSound(id){
		createjs.Sound.stop(id);
	}

	function playBGM(){
		createjs.Sound.play(SND_BGM, {loop:-1});
	}

	function stopBGM(){
		createjs.Sound.stop(SND_BGM);
	}

	return {
        initInstance:initInstance,
        playSound:playSound,
        stopSound:stopSound,
        playBGM:playBGM,
        stopBGM:stopBGM
    };
}();