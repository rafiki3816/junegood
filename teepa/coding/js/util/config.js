var Config = function(){
   var instance;
   var _appWindow;

    function init() {

        return {
            appWindow : _appWindow
        };

    };

    return { 

        getInstance: function () {
          if ( !instance ) {
            instance = init();
          }
          return instance;
        }

    };
}();