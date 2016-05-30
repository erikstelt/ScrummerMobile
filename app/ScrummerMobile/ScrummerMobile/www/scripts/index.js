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

    // Override this slider's dragMove to prevent events from 'escaping' to the parent slider
    // Also disable overscroll
    Flickity.prototype.dragMove = function( event, pointer, moveVector ) {
        //preventDefaultEvent( event );

        this.previousDragX = this.dragX;
        // reverse if right-to-left
        var direction = this.options.rightToLeft ? -1 : 1;
        var dragX = this.dragStartPosition + moveVector.x * direction;

        if ( !this.options.wrapAround && this.cells.length ) {
            // slow drag
            var originBound = Math.max( -this.cells[0].target, this.dragStartPosition );
            dragX = dragX > originBound ? originBound : dragX;
            var endBound = Math.min( -this.getLastCell().target, this.dragStartPosition );
            dragX = dragX < endBound ? endBound : dragX;
        }

        this.dragX = dragX;

        this.dragMoveTime = new Date();

        if (this.selectedIndex === 0 && moveVector.x < 0) {
            event.stopImmediatePropagation();
        }
        else if (this.selectedIndex === this.cells.length - 1 && moveVector.x > 0) {
            event.stopImmediatePropagation();
        }
        else if (this.selectedIndex !== 0 && this.selectedIndex !== this.cells.length - 1) {
            event.stopImmediatePropagation();
        }
        else {
            this.dispatchEvent( 'dragMove', event, [ pointer, moveVector ] );
        }
    };
} )();