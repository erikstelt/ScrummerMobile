(function () {
    'use strict';

    var powerIcons = ['ton-li-chart-7', 'ton-li-eye', 'ton-li-speech-buble-3', 'ton-li-gear-1', 'ton-li-pen'];
    // Get profile
    return API.getProfile().then(function (profile) {
        // Get cards that need to be verified by you
        return API.getCards(profile.email).then(function (cards) {
            var template = document.getElementById("cards-template").innerHTML;

            Mustache.parse(template);

            cards = cards.map(function (card) {
                card.icon = powerIcons[card.power - 1];
                // Sets the class of the status part in the card (verified / denied) and status text
                if (card.is_verified === 1) {
                    card.statusclass = 'accepted';
                    card.statustext = 'accepted';
                } else if (card.is_verified === 2) {
                    card.statusclass = 'denied';
                    card.statustext = 'denied';
                } else { card.statusclass = ""}
                card.description = card.description || 'No description given.';
                card.deadline.class = card.deadline.class.split(' ').join('');

                return card;
            });

            document.querySelector(".cards").innerHTML = Mustache.render(template, {
                cards: cards
            });
        });
    });
})();