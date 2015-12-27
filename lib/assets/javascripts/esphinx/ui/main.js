//= require esphinx/main

"use strict";
var esPhinx;

(function ($) {
    // esPhinx has been already declared

    $.extend({

        ui: {
            extend: function() {
                $.extend.call(null, [{args: arguments[0], module: this}]);
            }
        }

    });

})(esPhinx);
