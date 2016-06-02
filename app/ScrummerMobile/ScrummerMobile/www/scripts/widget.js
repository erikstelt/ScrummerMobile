(function () {

    /**
     * @param {Object} data
     * @returns {*}
     */
    templates.data.widget = function (data) {
        var level = Math.floor(Math.pow(data.exp / 2, 1 / 3));

        return {
            name: data.first_name + ' ' + data.last_name,
            class: data.class,
            power1: data.power1,
            power2: data.power2,
            power3: data.power3,
            power4: data.power4,
            power5: data.power5,
            level: level
        }
    };

    // Fill the profile widget
    api.getProfile().then(function (data) {
        templates.render('widget', data);
    });
})();