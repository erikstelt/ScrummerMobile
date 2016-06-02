(function() {
    'use strict';

    var notification = {
        /**
         * @type {HTMLElement}
         */
        element: null,
        /**
         * @type {Number}
         */
        timeout: null,
        /**
         * Show a message to the user
         *
         * @param {string} message
         */
        show: function (message) {
            notification.hide();

            notification.element.textContent = message;

            notification.element.classList.add('show');

            notification.timeout = window.setTimeout(notification.hide, 5000);
        },
        /**
         * Hide the message
         */
        hide: function() {
            notification.element.classList.remove('show');

            window.clearTimeout(notification.timeout);
        }
    };

    notification.element = document.querySelector('.notification');
    notification.element.addEventListener('click', function () {
        notification.hide();
    });

    window.notification = notification;
})();