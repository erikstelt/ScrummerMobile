(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', function () {
        var cards = document.querySelector('.cards'),
            cardsNav = cards.querySelector('.slider-nav');

        var slider = new Flickity(cards.querySelector('.slider'), {
                initialIndex: 1,
                setGallerySize: false,
                pageDots: false,
                prevNextButtons: false
            });

        // Update the button state after a swipe
        slider.on('cellSelect', function (e) {
            cardsNav.querySelector('[data-slide-index="' + slider.selectedIndex + '"]').checked = true;
        });

        // Bind the main menu buttons to
        [].forEach.call(cardsNav.querySelectorAll('input[type="radio"]'), function (input) {
            input.addEventListener('change', function () {
                if (this.checked) {
                    slider.select(this.dataset.slideIndex);
                }
            });
        });
    });
})();