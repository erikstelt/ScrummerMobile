(function() {
    'use strict';

    // check token age -> check profile  -> navigate to index
    //                                  |
    //                                  |-> go to login

    var token = localStorage.getItem('token'),
        expires = localStorage.getItem('token_expires');

    api.token = token;

    if (Date.now < expires) {
        api.getProfile().then(function (data) {

            window.location.replace('index.html');
        }).catch(function () {
            login();
        });
    }

    // TODO: attach to actual login button
    document.addEventListener('touchend', function (e) {
        login();
    });

    function login() {
        // Login and fetch the token
        api.login().then(function (data) {
            // Store the token and expiry date
            localStorage.setItem('token', data.token);
            localStorage.setItem('token_expires', new Date(Date.now + data['expires_in'] * 1000).getTime());

            // Navigate to the main page
            window.location.replace('index.html');
        })
        .catch(notify);
    }
})();