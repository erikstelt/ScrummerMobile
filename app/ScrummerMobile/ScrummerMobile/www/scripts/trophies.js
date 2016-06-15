(function () {
    /**
     * @returns {Promise}
     */
    Template.data.trophies = function () {
        return API.getProfile().then(function (data) {
            // Set the values which we'd like to return
            return {
                power1: data.power1,
                power2: data.power2,
                power3: data.power3,
                power4: data.power4,
                power5: data.power5
            }
        });
    };

    Template.render('trophies');
})();