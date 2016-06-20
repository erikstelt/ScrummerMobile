(function () {
    'use strict';

    var powerNames = ['research', 'design', 'interaction', 'production', 'documentation'];

    Template.data.trophies = function () {
        // Get profile
        return API.getProfile().then(function (profile) {
            // Get badges of profile
            return API.getBadges(profile.email).then(function (badges) {
                var powers = _.groupBy(badges, 'power'),
                    achievements = powers[6]; // achievements are special

                delete powers[6];

                for (var power in powers) {
                    if (!powers.hasOwnProperty(power)) continue;

                    // Add badges, points and name
                    powers[power] = {
                        badges: _.orderBy(powers[power], 'tier'),
                        points: profile['power' + power],
                        name: powerNames[power - 1] // correct array offset
                    };
                }

                return {
                    powers: _.toArray(powers),
                    achievements: achievements
                };
            });
        });
    };

    document.addEventListener('DOMContentLoaded', function () {
        Template.render('trophies').then(function () {
            new Flickity(document.querySelector('.trophies .achievements'), {
                contain: true,
                freeScroll: true,
                prevNextButtons: false,
                pageDots: false
            });
        });
    });
})();