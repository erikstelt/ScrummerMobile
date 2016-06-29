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
            }).sort(function(a, b) {
                if (a.deadline.timestamp > b.deadline.timestamp) {
                    return 1;
                } else if (b.deadline.timestamp > a.deadline.timestamp) {
                    return -1;
                };
                return 0;
            });

            document.querySelector(".cards").innerHTML = Mustache.render(template, {
                cards: cards
            });
        });
    });
    document.addEventListener('DOMContentLoaded', function () {
        delegate(window.document.body, '*', function () {
            console.log('works');
        });
    });
    //delegate(document.querySelector(".cards"), ".deny, .accept", function() {
       // var cardId = this.dataset.cardId;
        //var status = this.classList.contains("accept");
        //API.verifyCard(cardId, status);
      //  console.log(cardId, status);
    //});

    var test = document.querySelector(".cards");

    })();