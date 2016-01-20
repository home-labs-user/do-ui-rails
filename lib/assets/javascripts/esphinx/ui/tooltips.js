//= require jquery
//= require esphinx/ui/support/jquery
// require esphinx/ui/support/jquery

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
            // var
            //     handler = Singleton.recover('handler'),
            //     tooltip = handler.find(".tooltip");

            // // antes de remover, ou mesmo inserir um classe, pegar os ms usado como parâmetro no transition e meter no interval
            // tooltip.removeClass("transition-in");

            jqObj.hide();

            if (args) {
                resolveArgs();
            }
        },

        show = function (jqObj, args) {
            // var
            //     handler = Singleton.recover('handler'),
            //     tooltip = handler.find(".tooltip");

            jqObj.show();

            if (args) {
                resolveArgs();
            }

            // tooltip.addClass("transition-in");
        },

        toggle = function (jqObj, args) {
            // var
                // handler = Singleton.recover('handler'),
                // acho que é nessa linha que está dando ruim
                // tooltip = handler.find(".tooltip");

            // {folowMouse: true}

            // mudar
            // if (tooltip.visible()) {
            if (jqObj.is(":visible")) {
                hide(jqObj, args);
            }
            else {
                show(jqObj, args);
            }
        },

        // dar a oportunidade de informar as classes para o efeito
        closeAll = function (jqObj, args) {
            // var tooltips = $(".tooltip");

            // self.removeClass("transition-in");

            hide(jqObj, args);
        };

  // window.toggleTooltip = function (e) {
    $.fn.toggleTooltip = function (jqObj, args) {
        // var self = $(this);

        // dando problema em na hora de reconhecer o params, pois está reconhecendo como Function

        // Singleton.saveState(target, 'handler');
        toggle(jqObj, args);
  };

  // usar sintaxe de tabs para setar o tooltip
  // window.closeAllTooltips = function (e) {
  // O próximo passo é testar se o evento é do mouse. Caso seja colocar um temporizador para desaparecer caso o ponteiro esteja fora do handler
    // $.fn.closeAllTooltips = function (jqObj, tooltipId, args) {
    $.fn.closeAllTooltips = function (target, tooltipId, args) {
        var
            self = $(this);

        if (target.children(tooltipId).length == 0 && !target
            .is(tooltipId)) {
            closeAll(target.find(tooltipId), args);
        }

    };

})(jQuery);
