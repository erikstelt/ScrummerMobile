(function () {
    'use strict';

    var API = {
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
         * @type {Object<string, string>}
         */
        urls: {
            base: 'http://scrummer.space/api/',
            login: 'oauth2/authorize/',
            callback: 'oauth2/callback/',
            profile: 'account/me/',
            account: 'account/{email}/',
            badges: 'account/{email}/badges/',
            projects: 'account/{email}/projects/',
            cards: 'account/{email}/cards/',
            perks: {
                list: 'account/{email}/perks/',
                buy: 'perks/{perk}/buy/'
            }
        },
        /**
         * Open a login window of the api
         *
         * @returns {Promise}
         */
        login: function () {
            return new Promise(function (resolve, reject) {
                var options = 'hardwareback=no,navigation=no',
                    loginUrl = this.buildURL(this.urls.login),
                    callbackUrl = this.buildURL(this.urls.callback),
                    state = window.crypto.getRandomValues(new Uint8Array(10)).join(''), // random string to prevent tampering
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
                            data = API.parseQueryString(query);

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
                    reject("There was a network error");

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
            return this.get(this.buildURL(this.urls.profile));
        },
        /**
         * Get the perks info
         *
         * @param {string} email
         * @returns {Promise}
         */
        getBadges: function (email) {
            var url = this.buildURL(this.urls.badges, {
                email: email
            });

            return this.get(url);
        },
        /**
         * Get the perks
         *
         * @param {string} email
         * @returns {Promise}
         */
        getPerks: function (email) {
            var url = this.buildURL(this.urls.perks.list, {
                email: email
            });

            return this.get(url);
        },
        /**
         * Buy a single perk
         *
         * @param {number} perk
         */
        buyPerk: function (perk) {
            var url = this.buildURL(this.urls.perks.buy, {
                'perk': perk
            });

            return this.get(url, 'PUT');
        },
        getTeams: function (email) {
            var url = this.buildURL(this.urls.projects, {
                email: email
            });

            return this.get(url);
        },
        /**
         * Get the cards of the given type
         *
         * @param {string} email
         * @param {string} [type] Defaults to verify
         * @returns {Promise}
         */
        getCards: function (email, type) {
            var url = this.buildURL(this.urls.cards, {
                    email: email
                }),
                data = {
                    type: type || 'verify'
                };

            return this.get(url, 'GET', data);
        },
        /**
         * Change the status of a card
         *
         * @param {string} cardId
         * @param {status} boolean
         *
         **/
        changeCardStatus: function (cardId, status) {
            var req = new XMLHttpRequest();
            req.open('PUT', '/api/cards/' + toString(cardId) + '/verify/?verified=' + toString(status), true);
            req.send();

            req.onreadystatechange = processRequest;

            function processRequest(e) {
                if (xhr.readyState == 4 && xhr.status == 200) {

                }
            }
        },
        /**
         *
         * @param {string} url
         * @param {string} [method] Method of the request. Defaults to GET
         * @param {Object<string, *>} [data] Data of the request.
         * @returns {Promise}
         */
        get: function (url, method, data) {

            method = method && method.toUpperCase() || 'GET';

            var request = {
                method: method,
                headers: {
                    'Authorization': 'Bearer ' + this.token
                }
            };

            if (data) {
                if (method === 'GET') {
                    url += this.buildQueryString(data);
                } else {
                    request.data = data;
                }
            }

            return fetch(url, request).then(function (response) {
                if (response.ok) {
                    return response.json();
                }
                else {
                    return Promise.reject('There was a network error.');
                }
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
        },
        /**
         * Construct an url from and endpoint and data
         *
         * @param endpoint The endpoint
         * @param {object} [data]
         * @returns {string} The fully qualified url
         */
        buildURL: function (endpoint, data) {
            for (var key in data) {
                if (!data.hasOwnProperty(key)) continue;

                endpoint = endpoint.replace('{' + key + '}', data[key]);
            }

            return this.urls.base + endpoint;
        }
    };

    window.API = API;
})();