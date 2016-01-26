//= require esphinx/main


"use strict";

var
    esPhinx;

(function ($) {

    $.extend({

        ui: {
            extend: function() {
                Extender.extendWith(this, arguments[0]);
            }
        }

    });

}(esPhinx));
