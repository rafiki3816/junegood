var Config = function(){
   var instance;
   var _appWindow;

    function init() {

        return {
            appWindow : _appWindow,
            isMobile : isMobile
        };

    };

    function isMobile(){
      var UserAgent = navigator.userAgent;

      if (UserAgent.match(/iPhone|iPod|Android|Windows CE|BlackBerry|Symbian|Windows Phone|webOS|Opera Mini|Opera Mobi|POLARIS|IEMobile|lgtelecom|nokia|SonyEricsson/i) != null || UserAgent.match(/LG|SAMSUNG|Samsung/) != null)
      {
          return true;
      }else{
          return false;
      }
  }

    return { 

        getInstance: function () {
          if ( !instance ) {
            instance = init();
          }
          return instance;
        }

    };
}();