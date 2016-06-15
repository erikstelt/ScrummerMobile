(function () {
    /**
     * @returns {Promise}
     */
    Template.data.profile = function () {
        return API.getProfile().then(function (data) {
            // Set the values which we'd like to return
            return {
                experience: data.exp,
                // Skills
                mastery: data.mastery,
                masterypercentage: Math.round(5000 / data.mastery),
                teamwork: data.teamwork,
                teamworkpercentage: Math.round(10 / data.teamwork),
                responsibility: data.responsibility,
                responsibilitypercentage: Math.round(100 / data.responsibility),
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
        });
    };

    Template.render('profile');
})();