// require jquery/min/2.2.0

var
    jQuery;

(function ($) {
    "use strict";

    $.fn.extend({

        replaceToggleClass: function () {
            var
                self = this,
                cls1 = arguments[0],
                cls2 = arguments[1];

            if (self.get(0).classList.contains(cls1)) {
                self.removeClass(cls1);
                self.addClass(cls2);
            } else if (self.get(0).classList.contains(cls2)) {
                self.removeClass(cls2);
                self.addClass(cls1);
            }

            return self;
        },

        centralizeAt: function (obj) {
            var
                self = $(this);

            self.css({
                top: ($(obj).outerHeight() / 2) - (self.outerHeight() / 2) + "px",
                left: ($(obj).outerWidth() / 2) - (self.outerWidth() / 2) + "px"
            });

            return self;
        },

    });

})(jQuery);
