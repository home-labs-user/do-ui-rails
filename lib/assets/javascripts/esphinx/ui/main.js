// require esphinx/main

var
    esPhinx,
    Extender;

(function ($) {
    "use strict";

    $.extend({
        ui: {
            extend: function() {
                Extender.new(this, arguments[0]);
            }
        }
    });

}(esPhinx));
