// require esphinx/main

"use strict";

var
    esPhinx,
    Extensor;

(function ($) {

    $.extend(false, {
        ui: {
            extend: function() {
                Extensor.new(this, arguments[0], arguments[1]);
            }
        }
    });

}(esPhinx));
