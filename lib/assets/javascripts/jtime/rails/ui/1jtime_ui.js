//= require jtime

// jTime has been already declared
(function ($) {
    "use strict";

    $.extend({

        ui: {
            extend: function() {
                $.extend.call(null, [{args: arguments[0], module: this}]);
            }
        }

    });

})(jTime);
