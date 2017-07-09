// require esphinx/main

var
    esPhinx;


(function($) {
  "use strict";

    $.extend(false, {
        ui: {
            extend: function() {
                $.Extender.new(this, arguments[0], arguments[1]);
            }
        }
    });

}(esPhinx));
