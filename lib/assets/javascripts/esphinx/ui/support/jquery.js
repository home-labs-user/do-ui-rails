//= require jquery

"use strict";

var jQuery;

(function ($) {

  $.fn.extend({

        replaceToggleClass: function () {
            var
                self = this,
                cls1 = arguments[0],
                cls2 = arguments[1];

            // por que esse capeta está sendo chamado duas vezes?. Só pode ser por causa do new para fazer o teste
            // debugger
            if (self.get(0).classList.contains(cls1)) {
                // os métodos próprios do jquery mantém o controle da visibilidade e existência
                self.removeClass(cls1);
                self.addClass(cls2);
            } else if (self.get(0).classList.contains(cls2)) {
                self.removeClass(cls2);
                self.addClass(cls1);
            }

            return self;
        },

        centralizeOn: function (obj) {
            var
                self = $(this);

            self.css({
                top: ($(obj).outerHeight() / 2) - (self.outerHeight() / 2) + "px",
                left: ($(obj).outerWidth() / 2) - (self.outerWidth() / 2) + "px"
            });

            return self;
        },

    });

})(jQuery);
