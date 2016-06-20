(function () {
    'use strict';

    /**
     * Timeouts after which to try again.
     * 5, 10, 30, 60 seconds
     *
     * @type {number[]}
     */
    var timeouts = [5000, 10000, 30000, 60000];

    var Template = {
        /**
         * Cache of templates keyed by template id
         *
         * @type {Object<string, string>}
         */
        cache: {},
        /**
         * Cache the template and parse with Mustache
         *
         * @param {string} id
         */
        parse: function (id) {
            this.cache[id] = document.getElementById(id + '-template').innerHTML;

            Mustache.parse(this.cache[id]);
        },
        /**
         * Render the template with mustache. Takes data from data
         *
         * @param {string} id
         * @return {Promise}
         */
        render: function (id) {
            var scope = this,
                promise = this.data[id] || Promise.resolve;

            return promise().then(function (data) {
                // Reset the failed status
                delete scope.failed[id];

                var rendered = Mustache.render(scope.cache[id], data || {});

                [].forEach.call(document.querySelectorAll('[data-template="' + id + '"]'), function (element) {
                    element.classList.add('rendered');

                    element.innerHTML = rendered;
                });
            }).catch(function (error) {
                var tries = scope.failed[id] || 0,
                    timeout = timeouts[Math.min(tries, timeouts.length - 1)];

                scope.failed[id] = tries + 1;

                window.setTimeout(function () {
                    scope.render(id);
                }, timeout);
            });
        },
        /**
         * Return a data object for a Mustache template
         *
         * @type {Object<string, function>}
         */
        data: {},
        /**
         * Store of templates that failed. Key is id, value is amount of tries.
         *
         * @type {Object<string, number>}
         */
        failed: {}
    };

    window.Template = Template;
})();