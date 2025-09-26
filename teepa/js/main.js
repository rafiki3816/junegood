$(document).ready(function(){
	// alert("1");

	$('.slideshow').each(function(){
		var $container = $(this),
	
		$slideGroup=$container.find('.slideshow-slides'),
		$slides=$slideGroup.find('.slide'),
		$nav=$container.find('.slideshow-nav'),
		$indicator=$container.find('.slideshow-indicator'),

		slidesCount=$slides.length, //슬라이드 갯수
		indicatorHTML='',     //인디게이터 콘텐츠
		currentIndex=0,        // 현재 슬라이드 인덱스
		duration=1506,          // animation duration 움직이는 시간
		easing='swing',
		interval=4506,          // 자동으로 다음 슬라이드 
		timer;                // 타이머 


		//인디게이터 

		$slides.each(function(i){
			$(this).css({left:100*i+'%'});
			indicatorHTML+='<a href="#">'+(i+1)+'</a>';
		});


		//인디케이터에 콘텐트를 삽입.
		$indicator.html(indicatorHTML);

		//함수의 정의

		//모든 슬라이드를 표시하는 함수
		function goToSlide(index){
			//슬라이드 그룹을 대상 위치에 맞게 이동
			$slideGroup.animate({left:-100*index+'%'},duration,easing);

			// 현재 슬라이드의 인덱스를 덮어쓰기
			currentIndex = index;
			// 탐색 및 표시 상태를 업데이트 
			updateNav();
		}

		// 슬라이드의 상태에 따라 탐색 및 표시를 업데이트하는 함수.
		function updateNav(){
			var $navPrev=$nav.find('.prev'), //prev 뒤로 
				$navNext=$nav.find('.next'); // next 앞으로 

				if(currentIndex === 0){
					$navPrev.addClass('disabled');
				}else{
					$navPrev.removeClass('disabled');
				}

				if(currentIndex === slidesCount-1){
					$navNext.addClass('disabled');
				}else{
					$navNext.removeClass('disabled');
				}

				// 현재 슬라이드의 표시를 해제 
				$indicator.find('a').removeClass('active')
				.eq(currentIndex).addClass('active');
		}

		//타이머를 시작하는 함수
		function startTimer(){
			timer = setInterval(function(){
				var nextIndex=(currentIndex+1)%slidesCount;
				goToSlide(nextIndex);
			}, interval);
		}

		// 타이머를 중지하는 함수
		function stopTimer(){
			clearInterval(timer);
		}

		//인벤토리 등록 

		$nav.on('click','a',function(event){
			event.preventDefault();
			if($(this).hasClass('prev')){
				//1,2,3
				goToSlide(currentIndex-1);
			}else{
				//0.1.2
				goToSlide(currentIndex+1);
			}
		});

		// 인디케이터의 링크를 클릭하면 해당 슬라이드를 표시
		$indicator.on('click','a',function(event){
			event.preventDefault();

        // !는 $(this).hasClass('active')를 부정함, 즉 this가 active를 가지고 있지 않다면 
			if(!$(this).hasClass('active')){
				goToSlide($(this).index());
			}
		});

		//마우스 오버를 하면 타이머 정지
		$container.on({ 
			mouseenter:stopTimer, 
			mouseleave:startTimer
		});

	//슬라이드 쇼 시작 
		// 첫번째 슬라이드를 표시
		goToSlide(currentIndex);
		// 타이머를 시작
		startTimer();
	});


// *****************************************************
	initScene3();
	// Scene : 마스크 애니메이션
	function initScene3(){
		var $container = $('#scene-3'),
		    $masks = $container.find(".mask"),
		    $lines = $masks.find(".line"),
		    maskLength = $masks.length,
		    // []는 배열을 사용한다는 말.
		    maskData = [];

		    $masks.each(function(i){
		    	maskData[i] = {left:0};

		    	console.log(i);
		    });

            // 마우스리브와 마우스오버 작업수행 
		 
	 
		    $container.on({
		    	mouseenter: function(){
		    		resizeMask($(this).index());
		    	},
		    	mouseleave: function(){
		    		resizeMask(-1);
		    	}
		    }, '.mask');


		    // 각 마스크의 초기 자르기 영역과 경계의 위치를 지정.
		    resizeMask(-1);

		    
		    function resizeMask(active){

		    	var w = $container.width();
		    	    h = $container.height();

		    	    console.log(w);
		    	    console.log(h);


		    	$masks.each(function(i){
		    		var $this = $(this), //이 마스크
		                l;       // 자르기 영역의 왼쪽 좌표.

		    			if(active === -1){
		    				l = w/maskLength*i;
		    		
		    			}
		    			        //  1 < 2
		    			        //  1 < 3
		    			else if(active < i){
		    				// 마우스오버된 마스크보다 오른쪽 마스크는 
		    				// 자르기 영역의 왼쪽이
		    				l = w*(1 - 0.05*(maskLength - i));

		    		    // 1<0
		    		    // 1<1
		    			}else{
		    				l = w*0.05*i ;
		    			}

		    			$(maskData[i]).stop(true).animate({left:l},{
		    				duration:1000,
		    				progress:function(){
		    					var now = this.left;
		    					// console.log(now);

		    					$this.css({
		    					  //clip: rect(x좌표 x좌표 y좌표 x좌표)
		    					  // 왼쪽상단에서 시계방향 꾝지점 좌표임 
		    					  // 클립이 되는 영역 (즉 보이는 영역)
		    						clip:'rect(0px '+w+'px '+h+'px '+now+'px)'
		    					});

		    					$this.find($lines).css({
		    						left: now
		    					});
		    				}
		    			});

		    	});
		    }
	}

// homebutton 

	$("header>h1").on("mouseover",function(){
		$("header>h1>a>img").attr("src","images/logo1.png");
	});

	$("header>h1").on("mouseleave",function(){
		$("header>h1>a>img").attr("src","images/logo.png");
	});
	
});