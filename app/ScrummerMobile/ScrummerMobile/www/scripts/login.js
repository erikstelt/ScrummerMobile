(function () {
    "use strict";


    document.addEventListener('deviceready', function () {
        console.log(this);

        var url = 'http://scrummer.space/api/oauth2/authorize/';

        var target = "_blank";

        var options = "location=yes,hidden=yes";

        inAppBrowserRef = cordova.InAppBrowser.open(url, target, options);

        inAppBrowserRef.addEventListener('loadstart', function (e) {
            console.log(e);
        });

        inAppBrowserRef.addEventListener('loadstop', function (e) {
            console.log(e);
        });

        inAppBrowserRef.addEventListener('loaderror', loadErrorCallBack);
    }.bind(this), false);
})()