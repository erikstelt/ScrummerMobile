(function () {
    'use strict';

    var powerNames = ['research', 'design', 'interaction', 'production', 'documentation', 'achievement'];

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

    Template.render('trophies').then(function (element) {
        // Construct a new Flickity slider for the achievements
        new Flickity(element.querySelector('.achievements'), {
            contain: true,
            freeScroll: true,
            prevNextButtons: false,
            pageDots: false
        });
        
        // Prefetch the perks data
        var perks = API.getProfile().then(function (profile) {
            return API.getPerks(profile.email);
        }).then(function (data) {
            return _.keyBy(data, 'id');
        });

        delegate(element, '.badge', 'click', function (event) {
            var badge = this;

            perks.then(function (perks) {
                var perkId = badge.dataset.perkId,
                    perk = perks[perkId];

                perk.power = powerNames[perk.power_id - 1];

                Template.render('modal', perk).then(function (modal) {
                    modal.classList.add('visible');


                });
            });
        });

        var modal = element.querySelector('#modal-template');

        delegate(modal, '.modal, .cancel', 'click', function () {
            modal.classList.remove('visible');
        });

        delegate(modal, '.buy', 'click', function () {
            // todo: implement buy code
        });
    });

    /**
     * Helper function to make event delegation easy
     *
     * @param {Node} element Container element to add delegation
     * @param {string} filter selector to filter by
     * @param {string} event Name of the event
     * @param {function} handler Handler of the event
     */
    function delegate(element, filter, event, handler) {
        element.addEventListener(event, function (e) {
            var target;

            for (var i = 0; i < e.path.length; i++) {
                var el = e.path[i];

                if (el.matches(filter)) {
                    target = el;

                    break;
                }

                if (el === element) break;
            }

            if (!target) return;

            handler.call(target, e);
        });
    }
})();