//= require jquery
//= require esphinx/ui/support/jquery

"use strict";

var
    jQuery;

(function ($) {

    var
        hide = function () {
            var
                handler = Singleton.recover('handler'),
                tooltip = handler.find(".tooltip");

            // antes de remover, ou mesmo inserir um classe, pegar os ms usado como parâmetro no transition e meter no interval
            tooltip.removeClass("transition-in");
        },

        show = function () {
            var
                handler = Singleton.recover('handler'),
                tooltip = handler.find(".tooltip");

            tooltip.addClass("transition-in");
        },

        toggle = function () {
            var
                handler = Singleton.recover('handler'),
                // acho que é nessa linha que está dando ruim
                tooltip = handler.find(".tooltip");

            // {folowMouse: true}

            // mudar
            // if (tooltip.visible()) {
            if (tooltip.is(":visible")) {
                hide();
            }
            else {
                show();
            }
        },

        // dar a oportunidade de informar as classes para o efeito
        closeAll = function () {
            var tooltips = $(".tooltip");

            tooltips.removeClass("transition-in");
        };

  // window.toggleTooltip = function (e) {
    $.fn.toggleTooltip = function (e) {
        var target = $(e.target);

        // dando problema em na hora de reconhecer o params, pois está reconhecendo como Function

        Singleton.saveState(target, 'handler');
        toggle();
  };

  // usar sintaxe de tabs para setar o tooltip
  // window.closeAllTooltips = function (e) {
  // O próximo passo é testar se o evento é do mouse. Caso seja colocar um temporizador para desaparecer caso o ponteiro esteja fora do handler
    $.fn.closeAllTooltips = function (e) {
        var target = $(e.target);

        if (target.children(".esphinx-ui-tooltip").length == 0 && !target
            .is(".esphinx-ui-tooltip-body")) {
            closeAll();
        }

    };

})(jQuery);
