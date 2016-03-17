//= require ../support/jquery
//= require esphinx/support/object
//= require esphinx_ui

"use strict";

var
    jQuery,
    esPhinx;

(function ($module) {

    var
        $ = jQuery,

        hide = function (jqObj, args) {
            // faltam testes para suporte a estilização. Talvez tenha de mapear as propriedades do css para ver se há transition, o tipo, caso tenha pegar os ms para usar no setTimeout
            jqObj.hide();

            if (args) {
                resolveArgs(jqObj, args);
            }
        },

        resolveArgs = function (jqObj, args) {
            if (args.addClass) {
                jqObj.addClass(args.addClass);
            }

            if (args.removeClass) {
                jqObj.addClass(args.removeClass);
            }
        };

    $module.extend({
        window: {
            tooltip: {

                // O próximo passo é testar se o evento é do mouse. Caso seja colocar um temporizador para desaparecer caso o ponteiro esteja fora do handler
                hideAll: function (e, tooltipId, args) {
                    var
                        target = $(e.target),

                        closeAll = function (jqObj, args) {
                            hide(jqObj, args);
                        };

                    if (target.children(tooltipId).length === 0 && !target
                        .is(tooltipId)) {
                        closeAll(target.find(tooltipId), args);
                    }
                },

                new: function () {

                    var
                        Constructor = $module.window.tooltip.new,
                        handler,
                        tooltipId,
                        args,

                        show = function (jqObj, args) {
                            jqObj.show();

                            if (args) {
                                resolveArgs(jqObj, args);
                            }
                        },

                        toggle = function (jqObj, args) {
                            jqObj.css("position", "absolute");

                            if (jqObj.is(":visible")) {
                                hide(jqObj, args);
                            }
                            else {
                                show(jqObj, args);
                            }
                        },

                        resolveClass = function (className) {
                            return "." + className.replace(/ /, ".");
                        };


                    if (!(this instanceof Constructor)) {
                        return new Constructor(arguments);
                    } else {
                        args = arguments.flatten();
                        if (!handler) {
                            handler = args[0];
                        }

                        if (!tooltipId) {
                            tooltipId = args[1];
                        }
                    }

                    this.toggle = function (e, args) {
                        var
                            target = $(e.target),
                            tooltipTag = target.find(tooltipId);

                        if (!target.is(resolveClass(tooltipTag
                            .attr("class")))) {
                            toggle(tooltipTag, args);
                        }
                    };
                }

            }
        }
    });

})(esPhinx.ui);
