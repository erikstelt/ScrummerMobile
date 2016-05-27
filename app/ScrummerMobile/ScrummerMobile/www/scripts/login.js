(function() {
    'use strict';

    // if token
    //      if check profile
    //          go to index
    //      else
    //          try get new token
    //  else
    //      show login screen

    document.addEventListener('deviceready', function() {
        var token = localStorage.getItem('token'),
            expires = localStorage.getItem('token_expires');

        if (token && expires) {
            // check age of token
            if (Date.now() < expires) {
                // Set the token in the api
                api.token = token;

                api.getProfile()
                    .then(function(data) {
                       window.location.replace('index.html');
                    })
                    .catch(function() {
                        login();
                    });
            } else {
                login();
            }
        }
    

        // TODO: attach to actual login button
        document.addEventListener('touchend', function (e) {
            login();
        });

        function login() {
            // Login and fetch the token
            api.login().then(function (data) {
                // Store the token and expiry date
                localStorage.setItem('token', data.access_token);
                localStorage.setItem('token_expires', new Date(Date.now() + parseInt(data['expires_in'], 10) * 1000).getTime());

                // Navigate to the main page
                window.location.replace('index.html');
            })
            .catch(notify.show);
        }
    }.bind(this), false);
})();