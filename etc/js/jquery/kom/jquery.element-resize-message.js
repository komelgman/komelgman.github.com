// depends : jquery.timers.js

(function($){

    $.event.special.elementresize = {
        setup: function() {
            var self = this, $this = $(this), height = $this.height(), width = $this.width();

            $this.everyTime(100, 'elementresize-timer', function() {

                if (($this.height() != height) || ($this.width() != width)) {
                    height = $this.height();
                    width = $this.width();

                    jQuery.event.handle.call(self, {type:'elementresize'});
                }
            });
        },
        teardown: function() {
            $(this).stopTime('elementresize-timer');
        }
    };

})(jQuery);