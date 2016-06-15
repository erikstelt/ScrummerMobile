(function () {

    var timeouts = [5000, 30000, 300000], // 5, 30, 300 secs
        tries = 0,
        render = Template.render.bind(Template, 'trophies'),
        userEmail;

    /**
     * @returns {Promise}
     */
    Template.data.trophies = function () {
        // Get profile data
        return API.getProfile().then(function (profile) {
            // Reset the attempts to fetch data
            tries = 0;

            // Set the values which we'd like to return
            return profile;
        }).then(function(profile) {
            // Get badges and perk data
            return API.getBadges(profile.email).then(function (badges) {
                // Reset the attempts to fetch data
                tries = 0;
                // Power information with title and badge icon
                var powers = _.chain(badges)
                            .groupBy('power')
                            .toPairs()
                            .map(function (pair) {
                                return _.zipObject(['power', 'perks'], pair);
                            }).value();

                // To fill values for for example power 1, perk 1 (1 is index of array at 0):
                // Icon: powers[0].perks[0].icon
                // Name: powers[0].perks[0].name
                console.log(powers);
                console.log(powers[0].perks[1]);

                // Set the values which we'd like to return
                return {
                    power1: profile.power1,
                    power2: profile.power2,
                    power3: profile.power3,
                    power4: profile.power4,
                    power5: profile.power5,
                    powers: powers
                }
            });
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