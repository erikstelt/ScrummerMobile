﻿(function () {

    var timeouts = [5000, 30000, 300000], // 5, 30, 300 secs
        tries = 0,
        render = Template.render.bind(Template, 'profile');

    /**
     * @returns {Promise}
     */
    Template.data.profile = function () {
        return API.getProfile().then(function (data) {
            // Reset the attempts to fetch data
            tries = 0;

            // Set the values which we'd like to return
            return {
                experience: data.exp,
                // Skills
                mastery: data.mastery,
                teamwork: data.teamwork,
                responsibility: data.responsibility,
                // Powers
                power1: data.power1,
                power2: data.power2,
                power3: data.power3,
                power4: data.power4,
                power5: data.power5,
                // Contact
                email: data.email,
                phone: data.phone
            }
        }).catch(function () {
            // Try again in a while
            window.setTimeout(render, timeouts[tries]);

            if (tries < timeouts.length - 1) {
                tries++;
            }

            Notification.show("There was a network error");

            // End the chain here, otherwise the template will be rendered without data
            return Promise.reject();
        });
    };

    render();
})();