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

    Template.render('trophies').then(function (element) {
        // Construct a new Flickity slider for the achievements
        new Flickity(element.querySelector('.achievements'), {
            contain: true,
            freeScroll: true,
            prevNextButtons: false,
            pageDots: false
        });

        // Get the profile and the perks
        var profile = API.getProfile(),
            perks = profile.then(function (profile) {
                return API.getPerks(profile.email);
            }).then(function (data) {
                return _.keyBy(data, 'id');
            }),
            teams = profile.then(function (profile) {
                return API.getTeams(profile.email);
            }).then(function (teams) {
                return teams.map(function (team) {
                    return _.pick(team, ['id', 'name'])
                });
            });

        delegate(element, '.achievements .badge', function () {
            var badge = this;

            Promise.all([perks, teams]).then(function (values) {
                var perks = values[0],
                    teams = values[1],
                    perkId = badge.dataset.perkId,
                    perk = perks[perkId];

                perk.power = 'achievement';
                perk.can_buy = perk.status === 1;
                perk.has_teams = perk.id == 20; // Only Timebender has a team option

                if (perk.has_teams) {
                    perk.teams = teams;
                }

                return perk;
            }).then(function (perk) {
                return Template.render('achievement-modal', perk);
            }).then(function (modal) {
                modal.classList.add('visible');
            });
        });

        delegate(element, '.power .badge', function () {
            var badge = this;

            // Wait until the perks are resolved. This should be immediately
            // because they are preloaded
            perks.then(function (perks) {
                var perkId = badge.dataset.perkId,
                    perk = perks[perkId];

                perk.power = powerNames[perk.power_id - 1];
                perk.can_buy = perk.status === 1;

                return perk;
            }).then(function (perk) {
                return Template.render('power-modal', perk);
            }).then(function (modal) {
                modal.classList.add('visible');
            });
        });
    });

    var achievementModal = document.getElementById('achievement-modal-template'),
        powerModal = document.getElementById('power-modal-template');

    delegate(achievementModal, '.cancel', function () {
        achievementModal.classList.remove('visible');
    });

    delegate(powerModal, '.cancel', function () {
        powerModal.classList.remove('visible');
    });

    delegate(achievementModal, '.buy', function () {
        var perkId = this.dataset.perkId;

        API.buyPerk(perkId).then(function (response) {
            if (response.result) {
                achievementModal.classList.remove('visible');
            } else {
                Notification.show(response.message);
            }
        });
    });

    delegate(powerModal, '.buy', function () {
        var perkId = this.dataset.perkId;

        API.buyPerk(perkId).then(function (response) {
            if (response.result) {
                powerModal.classList.remove('visible');
            } else {
                Notification.show(response.message);
            }
        });
    });

    /**
     * Helper function to make event delegation easy
     *
     * @param {Node|NodeList} element Container element to add delegation
     * @param {string} filter Selector to filter by
     * @param {function} handler Handler of the event
     * @param {string} [event] Name of the event. Defaults to click
     */
    function delegate(element, filter, handler, event) {
        event = event || 'click';

        // NodeList is the same as calling delegate for each element in the list
        if (element instanceof NodeList) {
            Array.prototype.forEach.call(element, function (el) {
                delegate(el, filter, handler, event);
            });
        }

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