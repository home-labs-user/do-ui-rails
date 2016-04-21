// require esphinx/main

var
    esPhinx,
    Extensor;

(function ($) {
    "use strict";

    $.extend({
        ui: {
            extend: function() {
                Extensor.new(this, arguments[0]);
            }
        }
    });

}(esPhinx));
