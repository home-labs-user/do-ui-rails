// require esphinx/main

"use strict";

var
    esPhinx,
    Extensor;

(function ($) {

    $.extend({
        ui: {
            extend: function() {
                Extensor.new(this, arguments[0]);
            }
        }
    });

}(esPhinx));
