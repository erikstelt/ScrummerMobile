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

    console.log('cache');

    document.addEventListener('deviceready', function () {
        document.addEventListener('pause', function (e) {
            console.log('pause');
        });

        document.addEventListener('resume', function (e) {
            console.log('resume');
        });
    });
})();