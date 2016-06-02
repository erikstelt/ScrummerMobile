(function () {

    var timeouts = [5000, 30000, 300000], // 5, 30, 300 secs
        tries = 0,
        render = templates.render.bind(templates, 'widget');

    /**
     * @returns {Promise}
     */
    templates.data.widget = function () {
        return api.getProfile().then(function (data) {
            // Reset the attempts to fetch data
            tries = 0;

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
        }).catch(function () {
            // Try again in a while
            window.setTimeout(render, timeouts[tries]);

            if (tries < timeouts.length - 1) {
                tries++;
            }

            notification.show("There was a network error");
        });
    };

    render();
})();