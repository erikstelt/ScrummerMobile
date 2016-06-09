(function () {
    'use strict';

    var Cache = {
        /**
         * @type {{}} Storage of the data
         * @private
         */
        storage: {},
        /**
         * Set a value
         * @param {*} key
         * @param {*} value
         */
        set: function (key, value) {
            this.storage[key] = value;
        },
        /**
         * Get a value
         * @param {*} key
         * @returns {*}
         */
        get: function (key) {
            return this.storage[key];
        },
        /**
         * Clear the entire cache
         */
        clear: function () {
            this.storage = {};
        }
    };

    window.Cache = Cache;

    // Populate cache
    Cache.storage = JSON.parse(localStorage.getItem('cache') || '{}');
    
    document.addEventListener('deviceready', function () {
        document.addEventListener('pause', function (e) {
            // Persist cache to disk
            localStorage.setItem('cache', JSON.stringify(Cache.storage));
        });

        document.addEventListener('resume', function (e) {
            if (Object.keys(Cache.storage).length === 0) {
                Cache.storage = JSON.parse(localStorage.getItem('cache') || '{}');
            }
        });
    });
})();