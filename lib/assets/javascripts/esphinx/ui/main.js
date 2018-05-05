var
    esPhinx;


(function ($) {
  "use strict";


    $.extend(false, {
        ui: {
            extend: function () {
                $.Extender.extend(this, arguments[0], arguments[1]);
            }
        }
    });

}(esPhinx));
