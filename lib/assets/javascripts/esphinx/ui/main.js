//= require esphinx/main

(function ($) {
    // esPhinx has been already declared
    "use strict";

    $.extend({

        ui: {
            extend: function() {
                $.extend.call(null, [{args: arguments[0], module: this}]);
            }
        }

    });

})(esPhinx);
