(function () {

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

            // Set the percentages for the masteries
            var mastery, teamwork, responsibility;
            
            // Set the values for mastery
            if (Math.round((data.mastery / 5000) * 100) == 100) {
                mastery = "MAX";
            } else if (Math.round((data.mastery / 5000) * 100) < 10) {
                // The \u00A0 is for adding whitespace. This makes it so we don't have to do this in CSS
                mastery = String(Math.round((data.mastery / 5000) * 100) + '%') + "\u00A0\u00A0";
            } else { mastery = String(Math.round((data.mastery / 5000) * 100) + '%'); }

            // Set the values for teamwork
            if (Math.round((data.teamwork / 10) * 100) == 100) {
                teamwork = "MAX";
            } else if (Math.round((data.teamwork / 10) * 100) < 10) {
                // The \u00A0 is for adding whitespace. This makes it so we don't have to do this in CSS
                teamwork = String(Math.round((data.teamwork / 10) * 100) + '%') + "\u00A0\u00A0";
            } else { teamwork = String(Math.round((data.teamwork / 10) * 100)) + '%'; }

            // Set the values for responsibility
            if (Math.round((data.responsibility / 100) * 100) == 100) {
                responsibility = "MAX";
            } else if (Math.round((data.responsibility / 100) * 100) < 10) {
                // The \u00A0 is for adding whitespace. This makes it so we don't have to do this in CSS
                responsibility = String(Math.round((data.responsibility / 100) * 100) + '%') + "\u00A0\u00A0";
            } else { responsibility = String(Math.round((data.responsibility / 100) * 100) + '%'); }

            // We set the current exp in this level and the maximum
            var level = Math.floor(Math.pow(data.exp / 2, 1 / 3));
            var curMaxExp = Math.pow(level + 1, 3) * 2;
            var prevMaxExp = Math.pow(level, 3) * 2;
            var maxExp = curMaxExp - prevMaxExp;
            var currExp = data.exp - prevMaxExp;

            // Set the values which we'd like to return
            return {
                experience: String(currExp + ' / ' + maxExp),
                // Skills
                mastery: data.mastery,
                masterypercentage: mastery,
                teamwork: data.teamwork,
                teamworkpercentage: teamwork,
                responsibility: data.responsibility,
                responsibilitypercentage: responsibility,
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