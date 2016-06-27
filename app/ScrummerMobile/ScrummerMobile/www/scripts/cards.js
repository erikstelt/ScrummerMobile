(function () {
    'use strict';

    var powerIcons = ['ton-li-chart-7', 'ton-li-eye', 'ton-li-speech-buble-3', 'ton-li-gear-1', 'ton-li-pen'];
        // Get profile
        return API.getProfile().then(function (profile) {
            // Get cards that need to be verified by you
            return API.getCards(profile.email).then(function (cards) {
                var template = document.getElementById("cards-template").innerHTML;
                var test = Mustache.parse(template);
                for (var i = 0; i < cards.length; i++) {
                    cards[i].icon = powerIcons[cards[i].power - 1];
                    if (cards[i].description === "") { cards[i].description = "No description available" };
                }
                console.log(template);
                console.log(document.querySelector(".cards").innerHTML);
                document.querySelector(".cards").innerHTML = Mustache.render(template, {cards: cards});
                console.log(document.querySelector(".cards").innerHTML);
            });
        });
})();