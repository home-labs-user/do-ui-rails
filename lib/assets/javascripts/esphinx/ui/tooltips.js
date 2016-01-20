//= require jquery
//= require esphinx/ui/support/jquery

"use strict";

var
    jQuery;

(function ($) {

    var
        resolveArgs = function (jqObj, args) {
            if (args.addClass) {
                jqObj.addClass(args.addClass)
            }

            if (args.removeClass) {
                jqObj.addClass(args.removeClass)
            }
        },

        hide = function (jqObj, args) {
            jqObj.hide();

            if (args) {
                resolveArgs(jqObj, args);
            }
        },

        show = function (jqObj, args) {
            jqObj.show();

            if (args) {
                resolveArgs(jqObj, args);
            }
        },

        toggle = function (jqObj, args) {
            if (jqObj.is(":visible")) {
                hide(jqObj, args);
            }
            else {
                show(jqObj, args);
            }
        },

        // dar a oportunidade de informar as classes para o efeito
        closeAll = function (jqObj, args) {
            hide(jqObj, args);
        };

    $.fn.toggleTooltip = function (jqObj, args) {
        var self = $(this);

        // mudar essa linha. Na verdade, verificar como funciona o método is do jQuery tentar refatorá-lo
        if (!self.is("." + jqObj.attr("class"))) {
            toggle(jqObj, args);
        }
    };

    // O próximo passo é testar se o evento é do mouse. Caso seja colocar um temporizador para desaparecer caso o ponteiro esteja fora do handler
    $.fn.closeAllTooltips = function (target, tooltipId, args) {
        var
            self = $(this);

        if (target.children(tooltipId).length == 0 && !target
            .is(tooltipId)) {
            closeAll(target.find(tooltipId), args);
        }

    };

})(jQuery);
