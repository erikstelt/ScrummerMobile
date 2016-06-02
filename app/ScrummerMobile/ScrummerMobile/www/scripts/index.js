(function () {
    "use strict";

    api.token = window.localStorage.getItem('token');

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