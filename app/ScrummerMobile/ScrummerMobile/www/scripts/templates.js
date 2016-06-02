(function () {
    'use strict';

    var templates = {
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
         * @param {Object<string, *>} data
         */
        render: function (id, data) {
            var rendered = Mustache.render(this.cache[id], this.data[id](data));

            [].forEach.call(document.querySelectorAll('[data-template="' + id + '"]'), function (element) {
                element.innerHTML = rendered;
            });
        },
        /**
         * Return a data object for a Mustache template
         *
         * @type {Object<string, function>}
         */
        data: {}
    };

    window.templates = templates;
})();