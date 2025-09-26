/**
	jQuery maskedSprite plugin

	Author: Martin Vézina 2012 http://la-grange.ca

	requires :
		imagesLoaded (http://github.com/desandro/imagesloaded)
		easel (http://www.createjs.com)
		
	Licensed under the MIT license

*/


;(function ( $, window, document, undefined ) {
	

	var pluginName = 'maskedSprite',
		defaults = {
			frames : null,
			autoStart : true
		};

	function Plugin( element, options ) {
		this.element = $(element);

		this.options = $.extend( {}, defaults, options) ;
		
		this._defaults = defaults;
		this._name = pluginName;
		
		this.init();
	}
	
	Plugin.prototype.init = function(){
		this.ready = $.Deferred();
		
		//hide all images when they are loading
		$('img', this.element).hide();
		var _self = this;
		
		//wait for images to be loaded before initializing the animation
		this.element.imagesLoaded(function(){
			_self.allLoaded();
		});

	};

	Plugin.prototype.allLoaded = function() {
		
		this.bmpAnim = null;		
		this.mask = null;
		this.canvas = document.createElement('canvas');
		this.stage = new createjs.Stage(this.canvas);
		
		var spriteSheet;
		//the images that will be used as spritesheets.
		var maskImg = $('img.alpha', this.element).show();
		var spriteImg = $('img.spritesheet', this.element).show();
		
		var w = this.element.data('width');
		var h = this.element.data('height');
		
		//spritesheet dimensions, may be used to calculate n of frames if unspecified
		var ssW = spriteImg.width();
		var ssH = spriteImg.height();
		
		//default spritesource is spritesheet image itself
		var spriteSource = spriteImg.get(0);
		
		//setup canvas
		this.canvas.width = w;
		this.canvas.height = h;
		this.element.append(this.canvas);
		
		//if animation is not specifically defined, make a loop
		if(!this.options.frames) {
			
			var nFrames = this.element.data('nframes') || Math.floor(ssW / w) * Math.floor(ssH / h);
			
			this.options.frames = {
				animIn:[0, nFrames-1]
			};
			
		}
		
		//finds a PNG that has the alpha channel
		if(maskImg) {
			//is the mask a sprite or a single frame?
			//mask img is same size as sprite, so it has an alpha for each frame
			if(maskImg.width() == ssW && maskImg.height() == ssH) {
				//spritesource becomes the canvas of image+alpha spritesheets
				spriteSource = createjs.SpriteSheetUtils.mergeAlpha(spriteSource, maskImg.get(0));
			} else {
				//mask is canvas size, so it is used to mask the canvas globally
				this.mask = new createjs.AlphaMaskFilter(maskImg.get(0));
			}
		}
		
		// create spritesheet and assign the associated data.
		spriteSheet  = new createjs.SpriteSheet({
			images: [spriteSource],
			frames: {width:w, height:h, regX:0, regY:0},
			animations: this.options.frames
		});

		// create a BitmapAnimation instance to display and play back the sprite sheet:
		this.bmpAnim = new createjs.BitmapAnimation(spriteSheet);
		
		if(this.element.data('flipped') == 'x') {
			this.bmpAnim.scaleX = -1;
			this.bmpAnim.regX = w;
		}
		
		this.stage.addChild(this.bmpAnim);

		//now remove images from container, no longer needed
		$('img', this.element).remove();
		this.ready.resolve();
		this.options.autoStart ? this.start() : this.reset();
	};
	
	Plugin.prototype.getReady = function() {
		return this.ready.promise();
	};
		
	Plugin.prototype.reset = function(){
		if(this.bmpAnim) this.bmpAnim.gotoAndStop(0);
		this.tick();
	};
		
	Plugin.prototype.start = function(){
		createjs.Ticker.addListener(this);
		if(this.bmpAnim) this.bmpAnim.gotoAndPlay('animIn');
	};
	
	Plugin.prototype.stop = function(){
		createjs.Ticker.removeListener(this);
		if(this.bmpAnim) this.bmpAnim.stop();
	};
	
	Plugin.prototype.tick = function(){
		this.stage.update();
		if(this.mask) this.mask.applyFilter(this.canvas.getContext("2d"), 0, 0, this.canvas.width, this.canvas.height);
	};

	$.fn[pluginName] = function ( options ) {
		return this.each(function () {
			if (!$.data(this, pluginName)) {
				$.data(this, pluginName, 
				new Plugin( this, options ));
			}
		});
	}

})( jQuery, window, document );