// require esphinx/main

var
    esPhinx;

(function($) {
  "use strict";

    $.extend(false, {
        ui: {
            extend: function() {
                $.Extensor.new(this, arguments[0], arguments[1]);
            }
        }
    });

}(esPhinx));
