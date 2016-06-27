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

                card.description = card.description || 'No description given.';

                return card;
            });

            document.querySelector(".cards").innerHTML = Mustache.render(template, {
                cards: cards
            });
        });
    });
})();