(function() {
    'use strict';

    var api = {
        /**
         * The token to authenticate with
         * 
         * @type {string}
         */
        token: null,
        /**
         * The app id within the api
         * 
         * @type {string}
         */
        clientId: 'app',
        /**
         * API endpoints
         * 
         * @type {Object<string, string>
         */
        urls: {
            base: 'http://scrummer.space/api',
            login: '/oauth2/authorize',
            callback: '/oauth2/callback',
            profile: '/account/me'
        },
        /**
         * Open a login window of the api
         * 
         * @returns {Promise} 
         */
        login: function () {
            return new Promise(function (resolve, reject) {
                var options = 'hardwareback=no,navigation=no',
                    loginUrl = this.urls.base + this.urls.login,
                    callbackUrl = this.urls.base + this.urls.callback,
                    state = window.crypto.getRandomValues(new Uint8Array(10)).join(''), // random string of 10 chars to prevent tampering
                    query = this.buildQueryString({
                        client_id: this.clientId,
                        response_type: 'token',
                        state: state
                    }),
                    login = cordova.InAppBrowser.open(loginUrl + query, '_blank', options);

                login.addEventListener('loadstart', function (event) {
                    var url = event.url;

                    // This is the callback url
                    if (url.indexOf(callbackUrl) === 0) {
                        var hash = url.indexOf('#') !== -1, // The 'querystring' can be in the hash or in the actual querystring
                            query = url.split(hash ? '#' : '?')[1],
                            data = api.parseQueryString(query);

                        // Something went wrong. Usually the user declined
                        if (data.error) {
                            reject(data.error);
                        }
                            // Check for CSRF attempts
                        else if (data.state !== state) {
                            reject("Something went wrong");
                        }
                            // Success
                        else {
                            resolve(data);
                        }

                        login.close();
                    }
                }, false);

                login.addEventListener('loaderror', function (event) {
                    reject("Could not load the login page");

                    login.close();
                }, false);
            }.bind(this));
        },
        /**
         * Get the user profile
         * 
         * @returns {Promise} 
         */
        getProfile: function () {
            return this.get(this.urls.base + this.urls.profile);
        },
        /**
         * 
         * @param {string} url 
         * @param {Object<string, *>} data 
         * @returns {Promise} 
         */
        get: function (url, data) {
            return fetch(url,
                    {
                        headers: {
                            'Authorization': 'Bearer ' + this.token
                        }
                    })
                .then(function (response) {
                    return response.json();
                });
        },
        /**
         * 
         * 
         * @param {string} query 
         * @returns {Object<string, string>} 
         */
        parseQueryString: function (query) {
            var data = {};

            query.split('&').forEach(function (pair) {
                pair = pair.split('=');

                data[pair[0]] = decodeURIComponent(pair[1]);
            });

            return data;
        },
        /**
         * 
         * @param {Object} data 
         * @returns {string} 
         */
        buildQueryString: function (data) {
            var query = [];

            for (var key in data) {
                if (!data.hasOwnProperty(key)) continue;

                query.push(key + '=' + encodeURIComponent(data[key]));
            }

            return '?' + query.join('&');
        }
    };

    window.api = api;
})();