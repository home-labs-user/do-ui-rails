//= require jtime

// jTime has been already declared
(function ($) {
    "use strict";

    $.extend({

        ui: {
            extend: function() {
                $.extend.call(this, {
                    argument: arguments[0],
                    context: $.ui
                });
            },

            // test: function () {

            // }
        }

    });

})(jTime);
