//= require jtime

// jTime has been already declared
(function ($) {
    "use strict";

    $.extend({
        ui: {
            extend: function() {
                $.extend.call(this, {
                    module: $.ui,
                    args: arguments[0]
                });
            }
        }
    });

})(jTime);
