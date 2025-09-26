var Game = function(){

    var HOONY_WALK = 0;
    var HOONY_JUMP = 1;
    var HOONY_DOH = 2;
    var HOONY_CATCH = 3;
    var HOONY_CATCH_FAIL = 4;
    var HOONY_WALK_INIT = 5;
    var HOONY_CATCH_AFTER = 6;

    var TIME_WALK = 1.5;
    var TIME_JUMP = 0.7;
    var TIME_DOH = 0.5;
    var TIME_CATCH = 1;
    var TIME_CATCH_FAIL = 0.5;
    var TIME_CATCH_AFTER = 1.5;
    var TIME_RESULT_W = 3;
    var TIME_RESULT_S = 1.5;

    var _callbackFunc;
    var _game;
    var _mapContainer;
    var _popupFail;    
    var _uiAction;
    var _uiChoose;
    var _cover;
    var _gamePlay;
    var _gameObj;
    var _popupMap;
    var _popupMapCloseBtn;
    var _popupRetry;
    var _popupStart;

    var _hoony;
    var _hoonyWalkInit;
    var _hoonyWalk;
    var _hoonyJump;
    var _hoonyDoh;
    var _hoonyCatch;
    var _hoonyCatchAfter;
    var _hoonyCatchFail;
    var _butterfly;
    var _hoonyResult;
    var _hoonyResultW;
    var _hoonyResultS;

    var _currentStep = 0;
    var _currentAnswerCount = 0;
    var _totalStep = 4;
    var _totalChoose = 8;
    var _currentChooseIndex = 0;
    var _isResult = false;
    var _jumpLevelIndex = 0;
    var _isFullView = false;
    var _isSuccess = false;
    var _isMapClick = false;

    var _chooseMaxNumReffer = [5, 6, 7, 8];
    var _chooseIndexReffer = [-1, -1, -1, -1, -1, -1, -1, -1];
    var _answerReffer = [
        [0, 1, 2, 0, 4],
        [0, 3, 0, 1, 2, 4],
        [0, 1, 0, 2, 0, 3, 4],
        [3, 0, 3, 0, 1, 1, 2, 4]
    ];    
    var _jumpTapReffer = [
        [0, -70, 0],
        [0, -70, 0],
        [0, -70, 0],
        [0, -70, -110]
    ];
    var _stepStartPos = [120, -40, 55, 0];
    var _stepMoveTab = [180, 180, 136, 136];
    var _isStepResult = [0, 0, 0, 0];
    var _isResultCall = false;
    var _actionImageReffer = ["./images/game-ui-select-icon-go.png","./images/game-ui-select-icon-up.png","./images/game-ui-select-icon-down.png","./images/game-ui-select-icon-jump.png","./images/game-ui-select-icon-catha.png"];

    var _animationWalkInit;
    var _animationWalk;
    var _animationJump;
    var _animationDoh;
    var _animationCatch;
    var _animationCatchFail;
    var _animationCatchAfter;
    var _animationResultW;
    var _animationResultS;

    function initInstance(){
        _game = $('#game');
        _hoony = $('#hoony');
        _hoonyResult = $('#hoonyResult');
        _mapContainer  = $('#map-container');
        _gamePlay = $('#game-play');
        _gameObj = $('#game-object');
        _uiAction = $('#game-ui-action');
        _uiChoose = $('#game-ui-choose');
        _cover = $('#game-cover');
        _popupMap = $('#game-map');
        _popupMapCloseBtn = $('#game-map-closeBtn');
        _popupRetry = $('#game-popupFailed');
        _popupStart = $('#game-popupDoNotStart');

        _hoonyWalk = $('#hoony-walk');
        _hoonyWalkInit = $('#hoony-walk-init');
        _hoonyJump = $('#hoony-jump');
        _hoonyDoh = $('#hoony-doh');
        _hoonyCatch = $('#hoony-catch');
        _hoonyCatchFail = $('#hoony-catchFail');
        _hoonyCatchAfter = $('#hoony-catch-after');
        _hoonyResultW = $('#hoony-result-walk');
        _hoonyResultS = $('#hoony-result-succes');

        _animationWalk = TweenMax.to(_hoonyWalk, TIME_WALK,{repeat:-1,backgroundPosition: "-1750px",ease:SteppedEase.config(7)});
        _animationWalk.pause();

        _animationJump = TweenMax.to(_hoonyJump, TIME_JUMP,{repeat:0, backgroundPosition: "-1000px",ease:SteppedEase.config(4)});
        _animationJump.pause();

        _animationDoh = TweenMax.to(_hoonyDoh, TIME_DOH,{repeat:0, backgroundPosition: "-750px",ease:SteppedEase.config(3)});
        _animationDoh.pause();

        _animationCatch = TweenMax.to(_hoonyCatch, TIME_CATCH,{repeat:0,backgroundPosition: "-250px",ease:SteppedEase.config(1)});
        _animationCatch.pause();

        _animationCatchFail = TweenMax.to(_hoonyCatchFail, TIME_CATCH_FAIL,{repeat:0, backgroundPosition: "-250px",ease:SteppedEase.config(1)});
        _animationCatchFail.pause();

        _animationWalkInit = TweenMax.to(_hoonyWalkInit, TIME_WALK,{repeat:-1,backgroundPosition: "-3500px",ease:SteppedEase.config(14)});
        _animationWalkInit.pause();

        _animationCatchAfter = TweenMax.to(_hoonyCatchAfter, TIME_CATCH_AFTER,{repeat:0,backgroundPosition: "-3500px",ease:SteppedEase.config(14)});
        _animationCatchAfter.pause();

        _butterfly = TweenMax.to($('#game-butterfly-move-vertical'), 0.2,{repeat:-1, backgroundPosition: "-50px",ease:SteppedEase.config(1)});

        _animationResultW = TweenMax.to(_hoonyResultW, TIME_RESULT_W,{repeat:0,backgroundPosition: "0px",ease:SteppedEase.config(0)});
        _animationResultW.pause();

        _animationResultS = TweenMax.to(_hoonyResultS, TIME_RESULT_S,{repeat:0,backgroundPosition: "0px",ease:SteppedEase.config(0)});
        _animationResultS.pause();

        TweenMax.to(_hoonyResult, 0, {y:-1000,  ease:Cubic.easeOut});   
        TweenMax.to(_game, 0, {y:720, autoAlpha:0, ease:Cubic.easeOut});   
        TweenMax.to(_popupMapCloseBtn, 0, {autoAlpha:0, ease:Cubic.easeOut});  

        if(Config.getInstance().isMobile()){
            addMobileEvent();
            TweenMax.to( $('.allviewButton') , 0, {autoAlpha:0});
        }else{
            addEvent();
        }
        
    }

    function currentStepReset(){
        _currentAnswerCount = 0;    
        _currentChooseIndex = 0;
        _chooseIndexReffer = [-1, -1, -1, -1, -1, -1, -1, -1];

        TweenMax.to(_hoony, 0.5, {autoAlpha:0});

        setChooseUI();
        setActiveMap();        
        checkChooseDeleteButton();
        setHoonyState(HOONY_WALK_INIT);
        _isResult = false;
        _jumpLevelIndex = 0;        

        _animationWalkInit.play();
        if(_isSuccess){
            TweenMax.to(_hoony, 0.5, {autoAlpha:0});
            // TweenMax.to(_hoony, 2, {x:1340});
            // TweenMax.to(_hoonyResult, 0.5, {autoAlpha:0});
        }else{
            TweenMax.to(_hoony, 0.5, {autoAlpha:0});
        }
       
        resetChooseIcon();

        TweenMax.to($('.gameObjectStarEffect'), 0, {autoAlpha:0}); 
        TweenMax.to($('.gameObjectStagStar'), 0, {autoAlpha:1}); 

        // setTimeout(
            // gameStart, 2000
        // );
    }

    function setStarEffect(){
        var starName = '#game-object-stage' + (_currentStep + 1) + '-star-icon' + (_currentAnswerCount - 1);
        var effectName = '#game-object-stage' + (_currentStep + 1) + '-starEffect-icon' + (_currentAnswerCount - 1);

        var effect = TweenMax.to($(effectName), 0.5,{autoAlpha: 1, repeat:-1,backgroundPosition: "-1000px", ease:SteppedEase.config(5),            
            onComplete:function(){
                // console.log('>>>> effectName : ' + effectName);
                // TweenMax.to($(effectName), 0,{x:0, autoAlpha: 0});
            }
        });        
        effect.play();
        setTimeout(function(){TweenMax.to($(effectName), 0,{backgroundPosition:"0px", autoAlpha: 0});}, 500);
        SoundManager.playSound(SND_STAR);
        TweenMax.to($(starName), 0, {autoAlpha: 0});
    }

    function resetChooseIcon(){
        var chooseItem;
        var numIcon;
        var actionIcon;

        for(var i=0; i<_totalChoose; i++){
            chooseItem = $('#gameChooseIconItem' + i);  
            numIcon = chooseItem.find('.gameChooseIcon-num');
            actionIcon = chooseItem.find('.gameChooseIcon-icon');

            actionIcon.attr('src', _actionImageReffer[i]);

            TweenMax.to(numIcon, 0, {y:0, autoAlpha:1, ease:Cubic.easeOut});   
            TweenMax.to(actionIcon, 0, {y:73, autoAlpha:1, ease:Cubic.easeOut}); 
        }
    }

    function setChooseUI(){
        
        var chooseUi = $('#game-ui-choose'); 
        var chooseUl = $('#game-ui-choose-ul'); 
        var list = $('#game-ui-choose-ul li'); 
        var bg = $('#game-ui-choose-container-bg');
        // console.log('setChooseUI');
        // console.log('_currentStep : ' + _currentStep);

        switch(_currentStep){
            case 0: 
                    chooseUi.css('left', '168px');
                    bg.css('left', '-200px');
                    list.css('margin', 'auto 112px 40px 0px');
                    chooseUl.css('left', '135px');
                    chooseUl.css('width', '1000px');
                break;

            case 1:
                    chooseUi.css('left', '58px');
                    bg.css('left', '-60px');
                    list.css('margin', 'auto 112px 40px 0px');
                    chooseUl.css('left', '85px');
                    chooseUl.css('width', '1100px');
                break;

            case 2:
                    chooseUi.css('left', '138px');
                    bg.css('left', '-150px');
                    list.css('margin', 'auto 66px 40px 0px');
                    chooseUl.css('left', '72px');
                    chooseUl.css('width', '1000px');
                break;

            case 3:
                    chooseUi.css('left', '78px');
                    bg.css('left', '-60px');
                    list.css('margin', 'auto 66px 40px 0px');
                    chooseUl.css('left', '72px');
                    chooseUl.css('width', '1100px');
                break;
        }
    }

    function gameStart(){
        _isMapClick = false;

        TweenMax.to(_hoony, 0, {x:-250, y:0, autoAlpha:1});

        TweenMax.to(_hoonyResultW, 0, {autoAlpha:0});
        TweenMax.to(_hoonyResultS, 0, {autoAlpha:0});

        TweenMax.to(_hoonyResult, 0, {y:-1000, autoAlpha:1});

        TweenMax.to(_cover, 0.7, {delay:1, autoAlpha:0, ease:Cubic.easeOut});
        TweenMax.to(_popupMap, 1, {y:720, autoAlpha:1, ease:Cubic.easeOut});
        TweenMax.to(_popupMapCloseBtn, 0, {autoAlpha:0, ease:Cubic.easeOut}); 

        TweenMax.to(_uiChoose, 1, {delay:1.5, y:0, ease:Back.easeOut});
        TweenMax.to(_uiAction, 1, {delay:2, x:0, ease:Back.easeOut, onComplete:function(){
            flyButterFly();
            _animationWalkInit.play();
            showAcitonTextGuide();

            if(_currentStep == 0){
                showButtonTextGuide();
            }

            TweenMax.to(_hoony, TIME_WALK * 2, {x:_stepStartPos[_currentStep], ease:Linear.EaseNone, onComplete:function(){
                _animationWalkInit.pause(0);                
            }});
        }});       
    }

    function flyButterFly(){
        var flyPosInfo = [1120 - 100, 1120 - 78, 1120 - 78, 1120];
        var movePos = _stepStartPos[_currentStep] + ((_chooseMaxNumReffer[_currentStep] - 1) * _stepMoveTab[_currentStep]);              

        TweenMax.to(_hoonyResultW, 0, {autoAlpha:1});
        TweenMax.to(_hoonyResultS, 0, {autoAlpha:0});

        if(_currentStep < 2){
            TweenMax.to(_hoonyResult, 0, {x:movePos - 50, y:-1000, autoAlpha:1, ease:Cubic.easeOut});
                TweenMax.to(_hoonyResult, TIME_RESULT_W, {y:-100, onComplete:function(){
                _animationResultW.pause(0);
            }});
        }else{
            TweenMax.to(_hoonyResult, 0, {x:movePos - 80, y:-1000, autoAlpha:1, ease:Cubic.easeOut});
                TweenMax.to(_hoonyResult, TIME_RESULT_W, {y:-100, onComplete:function(){
                _animationResultW.pause(0);
            }});
        }        

        /*
        var flyPosInfo = [1120 - 100, 1120 - 78, 1120 - 78, 1120];

        TweenMax.to($('#game-butterfly-move'), 0, {x:-100, y:0, autoAlpha:1, ease:Cubic.easeOut});
        TweenMax.to($('#game-butterfly-move-vertical'), 0, {y:0});

        TweenMax.to($('#game-butterfly-move'), 10, {x:flyPosInfo[_currentStep]});
        TweenMax.to($('#game-butterfly-move-vertical'), 0.3, {y:20, yoyo:true, repeat:-1});
        */
    }

    function runButterFly(){    
        /*    
        var movePos = _stepStartPos[_currentStep] + ((_currentAnswerCount-1) * _stepMoveTab[_currentStep]);   

        TweenMax.to($('#game-butterfly-move'), 3, {x:3000, y:-800, ease:Quad.easeOut});
        */
    }

    function catchButterFly(){
        TweenMax.to(_hoonyResultW, 0, {delay:3, autoAlpha:1, onComplete:function(){            
            TweenMax.to(_hoonyResult, TIME_RESULT_W, {delay:0.5, y:-1000, autoAlpha:1, ease:Cubic.easeOut});
        }});

        /*
        TweenMax.to($('#game-butterfly-move'), 0.15, {delay:0.6, y:180, autoAlpha:1, ease:Cubic.easeOut, onComplete:function(){
            TweenMax.to($('#game-butterfly-move'), 3, {delay:4, bezier:{values:[{x:800, y:-400 }, {x:600, y:-800 }]}, ease:Quad.easeOut, onComplete:function(){
                TweenMax.to($('#game-butterfly-move'), 0, {x:-100, y:0, autoAlpha:1, ease:Cubic.easeOut});
                TweenMax.to($('#game-butterfly-move-vertical'), 0, {y:0});
            }});
        }});
        TweenMax.to($('#game-butterfly-move-vertical'), 0.1, {y:0});
        */
    }

    function setActiveMap(){
        var activeMapItem;

        for(var i=0; i<_totalStep; i++){
            activeMapItem = $('#gameMapListIem' + i).find('.game-map-listItem-active');
            TweenMax.to(activeMapItem, 0, {autoAlpha:0, ease:Cubic.easeOut});

            if(i == _currentStep){
                TweenMax.to(activeMapItem, 0.3, {delay:0.1, yoyo:true, repeat:-1, autoAlpha:1, ease:Cubic.easeOut});
            }
        }
    }

    function setHoonyState(index){

        TweenMax.to(_hoonyWalk, 0, {autoAlpha:0});
        TweenMax.to(_hoonyJump, 0, {autoAlpha:0});
        TweenMax.to(_hoonyDoh, 0, {autoAlpha:0});
        TweenMax.to(_hoonyCatch, 0, {autoAlpha:0});
        TweenMax.to(_hoonyCatchFail, 0, {autoAlpha:0});
        TweenMax.to(_hoonyWalkInit, 0, {autoAlpha:0});
        TweenMax.to(_hoonyCatchAfter, 0, {autoAlpha:0});

        switch(index){
            case HOONY_WALK:
                TweenMax.to(_hoonyWalk, 0, {autoAlpha:1});
                break;

            case HOONY_JUMP:
                TweenMax.to(_hoonyJump, 0, {autoAlpha:1});
                break;

            case HOONY_DOH:
                TweenMax.to(_hoonyDoh, 0, {autoAlpha:1});
                break;

            case HOONY_CATCH:
                TweenMax.to(_hoonyCatch, 0, {autoAlpha:1});
                break;

            case HOONY_CATCH_FAIL:
                TweenMax.to(_hoonyCatchFail, 0, {autoAlpha:1});
                break;

            case HOONY_WALK_INIT:
                TweenMax.to(_hoonyWalkInit, 0, {autoAlpha:1});
                break;

            case HOONY_CATCH_AFTER:
                TweenMax.to(_hoonyCatchAfter, 0, {autoAlpha:1});
                break;
        }
    }

    function hideDeleteButton(){
        TweenMax.to($('.chooseIconDelButton'), 0, {autoAlpha:0});
    }

    function gameResultHoony(){
        _isResult = true;
        hideDeleteButton();
        checkChooseAnswer();

        _animationWalk.pause(0);
        _animationDoh.pause(0);
        _animationJump.pause(0);
        _animationCatch.pause(0);
        _animationCatchFail.pause(0);
        _animationWalkInit.pause(0);

        var actionIndex = _chooseIndexReffer[_currentAnswerCount];
        var moveIndex = _answerReffer[_currentStep][_currentAnswerCount];

        // console.log(">>> actionIndex : " + actionIndex + " , moveIndex : " + moveIndex);

        if(_currentAnswerCount <= _chooseMaxNumReffer[_currentStep] - 1){
            if(actionIndex == moveIndex){
                // console.log(":: 성공 ::");                       
                // 잠자리 
                // if(_currentStep != 3){
                //     if(_currentAnswerCount == _chooseMaxNumReffer[_currentStep] - 1) runButterFly();
                // }

                moveSuccessHoonyAction();
                _isSuccess = true;
            }else{
                // console.log(":: 실패 ::");
                moveFailHoonyAction();
                _isSuccess = false;
            }
        }else{
            // console.log(">>>>> 스테이지 클리어 <<<<<"); 
            _isStepResult[_currentStep] = 1;
            var totalResultStep = _isStepResult[0] + _isStepResult[1] + _isStepResult[2] + _isStepResult[3] ;
            if(totalResultStep == 4 && !_isResultCall){
                _isResultCall = true;
                _callbackFunc(10);
            }
            
            changeNextStage();
            // setTimeout(function(){_callbackFunc(3)}, 1000);
        }       

        _currentAnswerCount ++;
    }

    function moveSuccessHoonyAction(){
        var actionIndex = _chooseIndexReffer[_currentAnswerCount];
        var nextIndex = _currentAnswerCount + 1;
        var currentPos = _stepStartPos[_currentStep] + (_currentAnswerCount * _stepMoveTab[_currentStep]);  
        var movePos = _stepStartPos[_currentStep] + (nextIndex * _stepMoveTab[_currentStep]);         
        var jumpIndex;

        if(_currentStep == 2 && _currentAnswerCount == 2){            
            movePos = movePos - 70;
        }

        setHoonyState(actionIndex);

        switch(actionIndex){

           case 0:                                     
                setHoonyState(HOONY_WALK);                
                _animationWalk.play();

                setTimeout(setStarEffect, 200);

                TweenMax.to(_hoony, TIME_WALK, {x:movePos, ease:Linear.EaseNone, onComplete:function(){                      
                    _animationWalk.pause();
                    
                    setTimeout(gameResultHoony, 500);             
                }});
                break;

            case 1:
                setHoonyState(HOONY_JUMP);
                _jumpLevelIndex ++;                
                _animationJump.play();

                setTimeout(setStarEffect, 500);

                TweenMax.to(_hoony, TIME_JUMP, {bezier:{values:[{x:movePos - _stepMoveTab[_currentStep]/3 * 2, y:_jumpTapReffer[_currentStep][_jumpLevelIndex] - 50 }, {x:movePos - _stepMoveTab[_currentStep]/3, y:_jumpTapReffer[_currentStep][_jumpLevelIndex] }]}, ease:Quad.easeOut, onComplete:function(){                    
                    
                    setTimeout(gameResultHoony, 500); 
                }});
                break;

            case 2:
                setHoonyState(HOONY_JUMP);                
                jumpIndex = 0;
                _animationJump.play();

                setTimeout(setStarEffect, 700);

                TweenMax.to(_hoony, TIME_JUMP, {bezier:{values:[{x:movePos - _stepMoveTab[_currentStep] - _stepMoveTab[_currentStep]/3, y:_jumpTapReffer[_currentStep][_jumpLevelIndex] - 50 }, {x:movePos - _stepMoveTab[_currentStep] + _stepMoveTab[_currentStep]/3, y:_jumpTapReffer[_currentStep][jumpIndex] }]}, ease:Quad.easeOut, onComplete:function(){                    
                    setHoonyState(HOONY_WALK);                
                    _animationWalk.play();

                    TweenMax.to(_hoony, TIME_WALK * 2, {x:movePos, ease:Linear.EaseNone, onComplete:function(){                      
                        _animationWalk.pause();                        
                        setTimeout(gameResultHoony, 500);             
                    }});
                    _jumpLevelIndex = jumpIndex;
                }});
                break;

            case 3:
                setHoonyState(HOONY_JUMP);
                _animationJump.play();
                setTimeout(setStarEffect, 300);
                TweenMax.to(_hoony, TIME_JUMP, {bezier:{values:[{x:movePos - _stepMoveTab[_currentStep]/2, y:-110}, {x:movePos, y:0}]}, ease:Quad.easeOut, onComplete:function(){                                        
                    setTimeout(gameResultHoony, 500); 
                }});
                break;

            case 4:

                catchButterFly();
                setHoonyState(HOONY_CATCH_AFTER);
                _animationCatchAfter.pause(0);
                _animationCatchAfter.play();

                TweenMax.to(_hoony, TIME_WALK, {x:movePos, ease:Linear.EaseNone, onComplete:function(){
                    TweenMax.to(_hoonyResultW, 0, {autoAlpha:0});
                    TweenMax.to(_hoonyResultS, 0, {autoAlpha:1});
                    TweenMax.to(_hoonyCatchAfter, 0, {autoAlpha:0});
                }});

                setTimeout(function(){
                    gameResultHoony();
                }, 4500);

                /*
                setHoonyState(HOONY_CATCH);
                _animationCatch.play();
                catchButterFly();
                // setTimeout(setStarEffect, 300);

                setTimeout(function(){

                    setHoonyState(HOONY_CATCH_AFTER);
                    _animationCatchAfter.pause(0);

                    setTimeout(function(){
                        _animationCatchAfter.play();
                        setTimeout(gameResultHoony, 3000); 
                    }, 2000);

                }, TIME_CATCH * 1000);              
                */
                break;
        }
    }

    function moveFailHoonyAction(){
        var actionIndex = _chooseIndexReffer[_currentAnswerCount];
        var nextIndex = _currentAnswerCount + 1;
        var currentPos = _stepStartPos[_currentStep] + (_currentAnswerCount * _stepMoveTab[_currentStep]);  
        var movePos = _stepStartPos[_currentStep] + (nextIndex * _stepMoveTab[_currentStep]);      

        // console.log('>>> actionIndex , index: ' + index);
        // console.log('>>> _currentStep : ' + _currentStep);
        // console.log('>>> currentPos : ' + currentPos);
        // console.log('>>> movePos : ' + movePos);

        
        if(_jumpLevelIndex > 0){
            if(actionIndex != 4){

                setHoonyState(HOONY_DOH);
                 _animationDoh.play();

                TweenMax.to(_hoony, TIME_DOH, {onComplete:function(){
                    setTimeout(function(){showGameRetryPopup(true)}, 1500);
                }});
            }else{
                setHoonyState(HOONY_CATCH_FAIL);
                _animationCatchFail.play();

                setTimeout(function(){showGameRetryPopup(true)}, 1500);
            }

            return;
        }

        switch(actionIndex){
            case 0: 
                setHoonyState(HOONY_WALK);                
                _animationWalk.play();

                TweenMax.to(_hoony, TIME_WALK, {x:movePos - (_stepMoveTab[_currentStep]/3 * 2), y:0, ease:Linear.EaseNone, onComplete:function(){                    
                    setHoonyState(HOONY_DOH);                    
                    _animationDoh.play();

                    setTimeout(function(){showGameRetryPopup(true)}, 1500);
                }});
                break;

            case 1:
                setHoonyState(HOONY_JUMP);

                _animationJump.play();
                TweenMax.to(_hoony, TIME_JUMP, {bezier:{values:[{x:movePos - _stepMoveTab[_currentStep], y:_jumpTapReffer[_currentStep][_jumpLevelIndex] - 130}, {x:movePos - _stepMoveTab[_currentStep]/3 * 2, y:_jumpTapReffer[_currentStep][_jumpLevelIndex]}]}, ease:Quad.easeOut, onComplete:function(){
                    _animationWalk.pause();
                    setHoonyState(HOONY_DOH);
                    _animationDoh.play();

                    setTimeout(function(){showGameRetryPopup(true)}, 1500);
                }});
                break;

            case 2:
                setHoonyState(HOONY_DOH);
                _animationDoh.play();

                TweenMax.to(_hoony, TIME_DOH, {onComplete:function(){
                    setTimeout(function(){showGameRetryPopup(true)}, 1500);
                }});
                
                break;

            case 3:
                setHoonyState(HOONY_JUMP);

                _animationJump.play();
                TweenMax.to(_hoony, TIME_JUMP, {bezier:{values:[{x:movePos - _stepMoveTab[_currentStep]/2, y:_jumpTapReffer[_currentStep][_jumpLevelIndex]-90}, {x:movePos, y:_jumpTapReffer[_currentStep][_jumpLevelIndex]}]}, ease:Quad.easeOut, onComplete:function(){
                    _animationWalk.pause();
                    setHoonyState(HOONY_DOH);
                    _animationDoh.play();

                    setTimeout(function(){showGameRetryPopup(true)}, 1500);
                }});
                break;

            case 4:
                setHoonyState(HOONY_WALK);
                _animationWalk.play();
                
                TweenMax.to(_hoony, TIME_WALK, {x:movePos - _stepMoveTab[_currentStep]/2, y:0, ease:Linear.EaseNone, onComplete:function(){
                    _animationWalk.pause();
                    setHoonyState(HOONY_CATCH_FAIL);
                    _animationCatchFail.play();

                    setTimeout(function(){showGameRetryPopup(true)}, 1500);
                }});
                break;
        }
    }

    function checkChooseAnswer(){        
        var deleteActiveButton;
        // console.log(">> _chooseIndexReffer : " + _chooseIndexReffer);

        for(var i=0; i<_chooseIndexReffer.length; i++){            

            deleteActiveButton = $('#gameChooseIconItem' + i).find('.gameChooseIcon-active');  

            if(i == _currentAnswerCount){
                TweenMax.to(deleteActiveButton, 0.3, {autoAlpha:0, ease:Cubic.easeOut});
                TweenMax.to(deleteActiveButton, 0.2, {delay:0.1, yoyo:true, repeat:-1, autoAlpha:1, ease:Cubic.easeOut});
            }else{
                TweenMax.to(deleteActiveButton, 0.2, {autoAlpha:0, ease:Cubic.easeOut});
            }
        }    
    }

    function checkChooseDeleteButton(){ 
        var deleteButton;
        var deleteActiveButton;

        // console.log(">> _chooseIndexReffer : " + _chooseIndexReffer);

        for(var i=0; i<_chooseIndexReffer.length; i++){
            deleteButton = $('#chooseIconDelButtonItem' + i);                        

            if(_chooseIndexReffer[i] > -1){
                // console.log(">> 선택된 정답 인덱스 : " + i);
                TweenMax.to(deleteButton, 0.4, {autoAlpha:1, ease:Cubic.easeOut});
            }else{
                TweenMax.to(deleteButton, 0.2, {autoAlpha:0, ease:Cubic.easeOut});
            }

            deleteActiveButton = $('#gameChooseIconItem' + i).find('.gameChooseIcon-active'); 
            // console.log(">>>>> 현재 활성화 번호 : " + _currentChooseIndex);        

            if(i == _currentChooseIndex){
                TweenMax.to(deleteActiveButton, 0.3, {autoAlpha:1, ease:Cubic.easeOut});
                // TweenMax.to(deleteActiveButton, 0.15, {delay:0.05, yoyo:true, repeat:-1, autoAlpha:1, ease:Cubic.easeOut});
            }else{
                if(_chooseIndexReffer[i] > -1){                    
                    TweenMax.to(deleteActiveButton, 0.4, {autoAlpha:1, ease:Cubic.easeOut});
                }else{
                    TweenMax.to(deleteActiveButton, 0.2, {autoAlpha:0, ease:Cubic.easeOut});
                }
            }
        }    
    }

    function setMapContainer(){
        var map;
        var objGuide;

        for(var i=0; i<_totalStep; i++){
            map = $('#map-container-stage' + i);
            objGuide = $('#game-object-stage' + (i + 1));

            if(i == _currentStep){
                TweenMax.to(map, 1, {autoAlpha:1});
                TweenMax.to(objGuide, 1, {autoAlpha:1});
            }else{
                TweenMax.to(map, 0.5, {autoAlpha:0});
                TweenMax.to(objGuide, 0.5, {autoAlpha:0});
            }
        }
    }

    function changeNextStage(){
        _currentStep ++;

        if(_currentStep < _totalStep){            
            setMapContainer();
            setActiveMap();

            TweenMax.to(_cover, 0.7, {autoAlpha:1, ease:Cubic.easeOut});
            TweenMax.to(_popupMap, 1, {delay:1.5, y:0, autoAlpha:1, ease:Cubic.easeOut}); 

            setTimeout(currentStepReset, 1000);
        }else{
            setTimeout(function(){_callbackFunc(3)}, 2000);
        }
    }

    function checkCurrentChooseIndex(){
        for(var i=0; i<_chooseIndexReffer.length; i++){
            if(_chooseIndexReffer[i] < 0) {
                _currentChooseIndex = i;                
                return;
            }            
        }

        _currentChooseIndex = -1;        
    }

    function checkCurrentChooseTotalNum(){
        var count = 0;

        for(var i=0; i<_chooseIndexReffer.length; i++){
            if(_chooseIndexReffer[i] > -1) count ++;
        }

        if(count >= _chooseMaxNumReffer[_currentStep]){
            return true;
        }else{
            return false;
        }
    }

    function showStartCheckPopup(bool){
        if(bool){
            TweenMax.to(_cover, 1, {autoAlpha:1, ease:Cubic.easeOut});
            TweenMax.to(_popupStart, 1, {y:0, autoAlpha:1, ease:Back.easeOut});
        }else{
            TweenMax.to(_cover, 0.6, {delay:0.2, autoAlpha:0, ease:Cubic.easeOut});
            TweenMax.to(_popupStart, 0.6, {y:720, autoAlpha:1, ease:Back.easeIn});
        }
    }

    function showAcitonTextGuide(){
        TweenMax.to($('#game-ui-guideText'), 1, {autoAlpha:1, ease:Cubic.easeOut, onComplete:function(){
            TweenMax.to($('#game-ui-guideText'), 0.5, {delay:3, autoAlpha:0, ease:Cubic.easeOut});
        }});
    }

    function showButtonTextGuide(){
        TweenMax.to($('#game-ui-guideButton'), 1, {delay:4.5, autoAlpha:1, ease:Cubic.easeOut, onComplete:function(){
            TweenMax.to($('#game-ui-guideButton'), 0.5, {delay:3, autoAlpha:0, ease:Cubic.easeOut});
        }});
    }

    function showGameRetryPopup(bool){
        if(bool){
            TweenMax.to(_cover, 1, {autoAlpha:0.2, ease:Cubic.easeOut});
            TweenMax.to(_popupRetry, 1, {y:0, autoAlpha:1, ease:Back.easeOut});
        }else{
            TweenMax.to(_cover, 0.6, {delay:0.2, autoAlpha:0, ease:Cubic.easeOut});
            TweenMax.to(_popupRetry, 0.6, {y:720, autoAlpha:1, ease:Back.easeIn});
        }
    }

    function toggleFullScreen() {

        var doc = window.document;
        var docEl = doc.documentElement;

        var requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
        var cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

        if(!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
            requestFullScreen.call(docEl);
            TweenMax.to( $('.allviewButton-active') , 0, {autoAlpha:1});
            TweenMax.to( $('.allviewButton-default') , 0, {autoAlpha:0});

            setTimeout(fullscreenResize, 200)
            _isFullView = true;
        } else {
            cancelFullScreen.call(doc);
            originalResize();
        }
    }

    function fullscreenResize(){
        var w1 = screen.availWidth;
        var h1 = screen.availHeight;

        var w2 = window.innerWidth || document.documentElement.clientWidth  || document.body.clientWidth;
        var h2 = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

        var width = Math.max(w1, w2);
        var height = Math.max(h1, h2);

        var windowRatio = width / height;
        var gameRatio;
        var wrapper = $('.wrapper');

        if(windowRatio < 1.77){        
            // gameRatio = Config.getInstance().appWindow.width()/1280; 
            gameRatio = height/720;
        }else{
            gameRatio = width/1280; 
            // gameRatio = Config.getInstance().appWindow.height()/720; 
        }

        wrapper.css('left', 0);
        wrapper.css('top', 0); 
        wrapper.css('transform-origin', '0 0');   
        TweenMax.to(wrapper, 0, {scale:gameRatio});

        // alert('gameRatio : ' + gameRatio);
    }

    function originalResize(){
        var gameRatio = 1;
        var wrapper = $('.wrapper');

        wrapper.css('transform-origin', '0 0');   
        TweenMax.to(wrapper, 0, {scale:gameRatio});

        if(Config.getInstance().appWindow.width() > 1280){
            wrapper.css('left', (Config.getInstance().appWindow.width() - 1280)/2);
        }else{
            wrapper.css('left', 0);
        }

        if(Config.getInstance().appWindow.height() > 720){
            wrapper.css('top', (Config.getInstance().appWindow.height() - 720)/2);
        }else{
            wrapper.css('top', 0);   
        } 

        TweenMax.to( $('.allviewButton-active') , 0, {autoAlpha:0});
        TweenMax.to( $('.allviewButton-default') , 0, {autoAlpha:1});

        _isFullView = false;
    }   

    function addEvent(){
        $(window.document).bind('webkitfullscreenchange mozfullscreenchange fullscreenchange', function(e) {
            var state = document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen;
            var event = state ? 'FullscreenOn' : 'FullscreenOff';

            // Now do something interesting
            if(event == 'FullscreenOff'){
                originalResize();
            }
        });        

        var uiGuideButton = $('#game-ui-action-button');

        uiGuideButton.click(function(event){
            // console.log('>>>>> 가이드 버튼 클릭 <<<<<<');

            showAcitonTextGuide();
            showButtonTextGuide();

            SoundManager.playSound(SND_CLICK);
        });

        uiGuideButton.mouseover(function(event){
            SoundManager.playSound(SND_OVER);
        });        

        var allviewButton = $('.allviewButton');

        allviewButton.click(function(event){

            // console.log('>>> click idnex : ' + index);
            // console.log('>>> allviewButton <<< ');
            SoundManager.playSound(SND_CLICK);

            toggleFullScreen();
        });

        allviewButton.mouseover(function(event){
            //console.log(':: button.mouseover ::');
            
            SoundManager.playSound(SND_OVER);
        });

        var popupButton = $('.button-game-popup');

        popupButton.click(function(event){
            var index = $(event.currentTarget).parent().index();    
            // console.log('>>> click idnex : ' + index);
            showGameRetryPopup(false);

            if(index == 0){                
                currentStepReset();
                setTimeout(
                    gameStart, 300
                );
            }else if(index == 1){
                _callbackFunc(3);
            }

            SoundManager.playSound(SND_CLICK);
        });

        popupButton.mouseover(function(event){
            //console.log(':: button.mouseover ::');
            var over = $(event.currentTarget).parent().find('.popupButton-active');
            
            TweenMax.to( over , 0, {autoAlpha:1});
            SoundManager.playSound(SND_OVER);
        });

        popupButton.mouseout(function(event){
            var over = $(event.currentTarget).parent().find('.popupButton-active');
            
            TweenMax.to( over , 0.3, {autoAlpha:0});
        });

        var popupCloseButton = $('.button-game-popupClose');

        popupCloseButton.click(function(event){
            var index = $(event.currentTarget).parent().index();    
            showStartCheckPopup(false);

            SoundManager.playSound(SND_CLICK);
        });

        popupCloseButton.mouseover(function(event){
            //console.log(':: button.mouseover ::');
            var over = $(event.currentTarget).parent().find('.popupButton-active');
            
            TweenMax.to( over , 0, {autoAlpha:1});
            SoundManager.playSound(SND_OVER);
        });

        popupCloseButton.mouseout(function(event){
            var over = $(event.currentTarget).parent().find('.popupButton-active');
            
            TweenMax.to( over , 0.3, {autoAlpha:0});
        });

        var uiActionButton = $('.button-game-action');

        uiActionButton.click(function(event){
            var index = $(event.currentTarget).parent().index();    
            // console.log('>>> action click  : ' + index); 
            if(!_isResult){
                uiActionButtonClick(index);
            }            

            SoundManager.playSound(SND_CLICK);
        });

        uiActionButton.mouseover(function(event){
            //console.log(':: button.mouseover ::');
            var defaultBg = $(event.currentTarget).parent().find('.gameActionButton-default');
            var over = $(event.currentTarget).parent().find('.gameActionButton-active');

            TweenMax.to( defaultBg , 0, {autoAlpha:0});
            TweenMax.to( over , 0, {autoAlpha:1});
            SoundManager.playSound(SND_OVER);
        });

        uiActionButton.mouseout(function(event){
            var defaultBg = $(event.currentTarget).parent().find('.gameActionButton-default');
            var over = $(event.currentTarget).parent().find('.gameActionButton-active');

            TweenMax.to( defaultBg , 0, {autoAlpha:1});
            TweenMax.to( over , 0, {autoAlpha:0});
        });
        
        var uiDeleteButton = $('.button-game-delete');

        uiDeleteButton.click(function(event){
            var index = $(event.currentTarget).parent().index();    
            // console.log('>>> delete click  : ' + index);   
            if(!_isResult){
                uiDeleteButtonClick(index);
            }            

            SoundManager.playSound(SND_CLICK);
        });

        uiDeleteButton.mouseover(function(event){
            //console.log(':: button.mouseover ::');
            var defaultBg = $(event.currentTarget).parent().find('.gameDeleteButton-default');
            var over = $(event.currentTarget).parent().find('.gameDeleteButton-active');

            TweenMax.to( defaultBg , 0, {autoAlpha:0});
            TweenMax.to( over , 0, {autoAlpha:1});
            SoundManager.playSound(SND_OVER);
        });

        uiDeleteButton.mouseout(function(event){
            var defaultBg = $(event.currentTarget).parent().find('.gameDeleteButton-default');
            var over = $(event.currentTarget).parent().find('.gameDeleteButton-active');

            TweenMax.to( defaultBg , 0, {autoAlpha:1});
            TweenMax.to( over , 0, {autoAlpha:0});
        });           

        var uiStartButton = $('.button-game-start');

        uiStartButton.click(function(event){
            if(checkCurrentChooseTotalNum()){
                // console.log(">>> 게임을 시작할 수 있습니다 <<<");
                if(!_isResult){
                    gameResultHoony();
                    TweenMax.to(_uiAction, 0.7, {x:100, ease:Back.easeIn});
                }                   
            }else{
                // console.log(">>> 아직 게임을 시작할 수 없습니다 <<<");
                showStartCheckPopup(true);
            }  

            SoundManager.playSound(SND_CLICK);
        });

        uiStartButton.mouseover(function(event){
            //console.log(':: button.mouseover ::');
            var defaultBg = $(event.currentTarget).parent().find('.gameStartButton-default');
            var over = $(event.currentTarget).parent().find('.gameStartButton-active');

            TweenMax.to( defaultBg , 0, {autoAlpha:0});
            TweenMax.to( over , 0, {autoAlpha:1});
            SoundManager.playSound(SND_OVER);
        });

        uiStartButton.mouseout(function(event){
            var defaultBg = $(event.currentTarget).parent().find('.gameStartButton-default');
            var over = $(event.currentTarget).parent().find('.gameStartButton-active');

            TweenMax.to( defaultBg , 0, {autoAlpha:1});
            TweenMax.to( over , 0, {autoAlpha:0});
        });      

        var logoButton = $('#gameLogo');

        logoButton.click(function(event){
            _callbackFunc(3);

            SoundManager.playSound(SND_CLICK);
        });

        logoButton.mouseover(function(event){            
            SoundManager.playSound(SND_OVER);
        });

        var mapButton = $('#game-ui-map-button');

        mapButton.click(function(event){            
            _isMapClick = true;

            TweenMax.to(_cover, 0.7, {autoAlpha:1, ease:Cubic.easeOut});
            TweenMax.to(_popupMap, 1, {delay:0.2, y:0, autoAlpha:1, ease:Cubic.easeOut}); 
            TweenMax.to(_popupMapCloseBtn, 0, {autoAlpha:1, ease:Cubic.easeOut});           

            SoundManager.playSound(SND_CLICK);
        });

        mapButton.mouseover(function(event){
            //console.log(':: button.mouseover ::');
            var defaultBg = $(event.currentTarget).parent().find('#game-ui-map-button-default');
            var over = $(event.currentTarget).parent().find('#game-ui-map-button-active');

            TweenMax.to( defaultBg , 0, {autoAlpha:0});
            TweenMax.to( over , 0, {autoAlpha:1});

            SoundManager.playSound(SND_OVER);
        });

        mapButton.mouseout(function(event){
            var defaultBg = $(event.currentTarget).parent().find('#game-ui-map-button-default');
            var over = $(event.currentTarget).parent().find('#game-ui-map-button-active');

            TweenMax.to( defaultBg , 0, {autoAlpha:1});
            TweenMax.to( over , 0, {autoAlpha:0});
        });   

        var mapStepButton = $('.game-map-listItem');

        mapStepButton.click(function(event){    
            var index = $(event.currentTarget).parent().index();                      
            // console.log('>>> mapStepButton click  : ' + index);   

            // if(_isMapClick){
                // if(index != _currentStep){
                    TweenMax.to(_cover, 0.5, {autoAlpha:0, ease:Cubic.easeOut});
                    TweenMax.to(_popupMap, 0.5, {delay:0.2, y:720, autoAlpha:1, ease:Cubic.easeOut});

                    _isSuccess = false;
                    _currentStep = index;     
                    // runButterFly();
                    setMapContainer();               
                    SoundManager.playSound(SND_CLICK);
                    currentStepReset();

                    setTimeout(
                        gameStart, 300
                    );
                // }                
            // }   
            
        });

        mapStepButton.mouseover(function(event){           
            SoundManager.playSound(SND_OVER);
        });

        _popupMapCloseBtn.click(function(event){    
            _isMapClick = false;

            TweenMax.to(_cover, 0.5, {autoAlpha:0, ease:Cubic.easeOut});
            TweenMax.to(_popupMap, 0.5, {delay:0.2, y:720, autoAlpha:1, ease:Cubic.easeOut});

            SoundManager.playSound(SND_CLICK);
        });

        _popupMapCloseBtn.mouseover(function(event){           
            SoundManager.playSound(SND_OVER);
        });

    }    

    function addMobileEvent(){
         var uiGuideButton = $('#game-ui-action-button');

        uiGuideButton.bind('touchend', function(event) {
            // console.log('>>>>> 가이드 버튼 클릭 <<<<<<');

            showAcitonTextGuide();
            showButtonTextGuide();

            SoundManager.playSound(SND_CLICK);
        });

        var popupButton = $('.button-game-popup');

        popupButton.bind('touchend', function(event) {
            var index = $(event.currentTarget).parent().index();    
            // console.log('>>> click idnex : ' + index);
            showGameRetryPopup(false);

            if(index == 0){                
                currentStepReset();

                setTimeout(
                    gameStart, 300
                );
            }else if(index == 1){
                _callbackFunc(3);
            }

            SoundManager.playSound(SND_CLICK);
        });
        
        var popupCloseButton = $('.button-game-popupClose');

        popupCloseButton.bind('touchend', function(event) {
            var index = $(event.currentTarget).parent().index();    
            showStartCheckPopup(false);

            SoundManager.playSound(SND_CLICK);
        });
       
        var uiActionButton = $('.button-game-action');

        uiActionButton.bind('touchend', function(event) {
            var index = $(event.currentTarget).parent().index();    
            // console.log('>>> action click  : ' + index); 
            if(!_isResult){
                uiActionButtonClick(index);
            }            

            SoundManager.playSound(SND_CLICK);
        });

        var uiDeleteButton = $('.button-game-delete');

        uiDeleteButton.bind('touchend', function(event) {
            var index = $(event.currentTarget).parent().index();    
            // console.log('>>> delete click  : ' + index);   
            if(!_isResult){
                uiDeleteButtonClick(index);
            }            

            SoundManager.playSound(SND_CLICK);
        });
      
        var uiStartButton = $('.button-game-start');

        uiStartButton.bind('touchend', function(event) {
            if(checkCurrentChooseTotalNum()){
                // console.log(">>> 게임을 시작할 수 있습니다 <<<");
                if(!_isResult){
                    gameResultHoony();
                }                   
            }else{
                // console.log(">>> 아직 게임을 시작할 수 없습니다 <<<");
                showStartCheckPopup(true);
            }  

            SoundManager.playSound(SND_CLICK);
        });
       
        var logoButton = $('#gameLogo');

        logoButton.bind('touchend', function(event) {
            _callbackFunc(3);

            SoundManager.playSound(SND_CLICK);
        });

        var mapButton = $('#game-ui-map-button');

        mapButton.bind('touchend', function(event) {          
            _isMapClick = true;

            TweenMax.to(_cover, 0.7, {autoAlpha:1, ease:Cubic.easeOut});
            TweenMax.to(_popupMap, 1, {delay:0.2, y:0, autoAlpha:1, ease:Cubic.easeOut}); 
            TweenMax.to(_popupMapCloseBtn, 0, {autoAlpha:1, ease:Cubic.easeOut});           

            SoundManager.playSound(SND_CLICK);
        });

        var mapStepButton = $('.game-map-listItem');

        mapStepButton.bind('touchend', function(event) {  
            var index = $(event.currentTarget).parent().index();                      
            // console.log('>>> mapStepButton click  : ' + index);   

            // if(_isMapClick){
                // if(index != _currentStep){
                    TweenMax.to(_cover, 0.5, {autoAlpha:0, ease:Cubic.easeOut});
                    TweenMax.to(_popupMap, 0.5, {delay:0.2, y:720, autoAlpha:1, ease:Cubic.easeOut});
                    _isSuccess = false;
                    _currentStep = index;    

                    // runButterFly();
                    setMapContainer();               
                    SoundManager.playSound(SND_CLICK);
                    currentStepReset();

                    setTimeout(
                        gameStart, 300
                    );
                // }                
            // } 
        });
        
        _popupMapCloseBtn.bind('touchend', function(event) { 
            _isMapClick = false;

            TweenMax.to(_cover, 0.5, {autoAlpha:0, ease:Cubic.easeOut});
            TweenMax.to(_popupMap, 0.5, {delay:0.2, y:720, autoAlpha:1, ease:Cubic.easeOut});

            SoundManager.playSound(SND_CLICK);
        });

    } 

    function uiActionButtonClick(index){
        if(_currentChooseIndex <= _chooseMaxNumReffer[_currentStep] - 1) {
            _chooseIndexReffer[_currentChooseIndex] = index;

            var chooseItem = $('#gameChooseIconItem' + _currentChooseIndex);
            var numIcon = chooseItem.find('.gameChooseIcon-num');
            var actionIcon = chooseItem.find('.gameChooseIcon-icon');

            actionIcon.attr('src', _actionImageReffer[index]);
            TweenMax.to(actionIcon, 0, {x:-7, y:73, autoAlpha:1, ease:Cubic.easeOut});   

            TweenMax.to(numIcon, 0.5, {y:-73, autoAlpha:1, ease:Cubic.easeOut});   
            TweenMax.to(actionIcon, 0.5, {y:-10, autoAlpha:1, ease:Cubic.easeOut});   

            checkCurrentChooseIndex();
            // console.log("_currentChooseIndex : " + _currentChooseIndex);
            checkChooseDeleteButton();
        }else{
            // console.log(">>>>> 정답갯수를 초과 하였습니다. <<<<<");
        }
    }

    function uiDeleteButtonClick(index){
        var chooseItem = $('#gameChooseIconItem' + index);
        var numIcon = chooseItem.find('.gameChooseIcon-num');
        var actionIcon = chooseItem.find('.gameChooseIcon-icon');

        actionIcon.attr('src', _actionImageReffer[index]);

        TweenMax.to(numIcon, 0.5, {y:0, autoAlpha:1, ease:Cubic.easeOut});   
        TweenMax.to(actionIcon, 0.5, {y:73, autoAlpha:1, ease:Cubic.easeOut}); 

        _chooseIndexReffer[index] = -1;

        checkCurrentChooseIndex();
        checkChooseDeleteButton();   
    }

    function initMotion(){
        TweenMax.to(_game, 0, {y:720, autoAlpha:1, ease:Cubic.easeOut});        
        TweenMax.to(_cover, 0, {autoAlpha:0, ease:Cubic.easeOut});
        TweenMax.to(_popupMap, 0, {autoAlpha:0, ease:Cubic.easeOut});        
        TweenMax.to(_uiChoose, 0, {y:100, ease:Cubic.easeOut});
        TweenMax.to(_uiAction, 0, {x:100, ease:Cubic.easeOut});
        TweenMax.to(_popupMap, 0, {y:720, autoAlpha:1, ease:Cubic.easeOut});
        TweenMax.to(_popupStart, 0, {y:720, autoAlpha:1, ease:Back.easeOut});

        TweenMax.to(_mapContainer, 1, {top:-720, ease:Cubic.easeOut});
        TweenMax.to(_game, 1, {y:0, autoAlpha:1, ease:Cubic.easeOut});
        TweenMax.to(_cover, 0.7, {delay:1, autoAlpha:1, ease:Cubic.easeOut});
        TweenMax.to(_popupMap, 1, {delay:1.5, y:0, autoAlpha:1, ease:Back.easeOut});         

        _currentAnswerCount = 0;
        _currentStep = 0;
        _currentChooseIndex = 0;
        _chooseIndexReffer = [-1, -1, -1, -1, -1, -1, -1, -1];
        _isResult = false;
        _jumpLevelIndex = 0;   

        setActiveMap();
        setChooseUI();
        checkChooseDeleteButton();
        setHoonyState(HOONY_WALK_INIT);
        resetChooseIcon();
        
        TweenMax.to(_cover, 0, {delay:0.2, autoAlpha:0, ease:Cubic.easeOut});
        TweenMax.to(_popupRetry, 0, {y:720, autoAlpha:1, ease:Back.easeIn});

        TweenMax.to(_hoony, 0, {x:-250});

        // setTimeout(
            // gameStart, 4500
        // );

        SoundManager.playBGM();


        TweenMax.to($('.gameObjectStarEffect'), 0, {autoAlpha:0});   
        TweenMax.to($('.gameObjectStagStar'), 0, {autoAlpha:1}); 
        TweenMax.to(_hoonyResultW, 0, {autoAlpha:0});
        TweenMax.to(_hoonyResultS, 0, {autoAlpha:0});

        setMapContainer();
    }

    function endMotion(){
        TweenMax.to(_hoonyResultW, 0, {autoAlpha:0});
        TweenMax.to(_hoonyResultS, 0, {autoAlpha:0});

        TweenMax.to(_mapContainer, 1, {top:0, ease:Cubic.easeOut});
        TweenMax.to(_game, 1, {y:720, autoAlpha:1, ease:Cubic.easeOut});

        SoundManager.stopBGM();
    }
    /**
     * 메인 view 이벤트
     * @param  {Function} callback [main 이벤트 콜백함수]
     * @return {[type]}            [none]
     */
    function callBack(callbackFunc){
        _callbackFunc = callbackFunc;
    }

    function changeFullview(){
        if(_isFullView){
            TweenMax.to( $('.allviewButton-active') , 0, {autoAlpha:1});
            TweenMax.to( $('.allviewButton-default') , 0, {autoAlpha:0});
        }else{
            TweenMax.to( $('.allviewButton-active') , 0, {autoAlpha:0});
            TweenMax.to( $('.allviewButton-default') , 0, {autoAlpha:1});
        }
    }

    return {
        initInstance:initInstance,
        initMotion:initMotion,
        endMotion:endMotion,
        callBack:callBack,
        changeFullview:changeFullview
    };
}();