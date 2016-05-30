// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// To debug code on page load in Ripple or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.
(function () {
    "use strict";

    document.addEventListener( 'deviceready', onDeviceReady.bind( this ), false );

    function onDeviceReady() {
        // Handle the Cordova pause and resume events
        document.addEventListener( 'pause', onPause.bind( this ), false );
        document.addEventListener( 'resume', onResume.bind( this ), false );
        
        // TODO: Cordova has been loaded. Perform any initialization that requires Cordova here.
    }

    function onPause() {
        // TODO: This application has been suspended. Save application state here.
    }

    function onResume() {
        // TODO: This application has been reactivated. Restore application state here.
    }

    document.addEventListener('DOMContentLoaded', function () {
        // Initialize main slider
        var flickity = new Flickity(document.querySelector('.main'), {
            initialIndex: 1,
            setGallerySize: false,
            pageDots: false,
            prevNextButtons: false
        });

        var mainNav = document.querySelector('.main-nav');

        // Update the button state after a swipe
        flickity.on('cellSelect', function () {
            mainNav.querySelector('[data-slide-index="' + flickity.selectedIndex + '"]').checked = true;
        });

        // Bind the main menu buttons to
        [].forEach.call(mainNav.querySelectorAll('.main-nav input'), function (input) {
            input.addEventListener('change', function () {
                if (this.checked) {
                    flickity.select(this.dataset.slideIndex);
                }
            });
        });

        // TODO: Mustache the slides and widget
    });
} )();