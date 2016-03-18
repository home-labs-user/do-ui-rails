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

        hide = function (jqObj, opts) {
            // faltam testes para suporte a estilização. Talvez tenha de mapear as propriedades do css para ver se há transition, o tipo, caso tenha pegar os ms para usar no setTimeout
            jqObj.hide();

            if (opts) {
                resolveArgs(jqObj, opts);
            }
        },

        resolveArgs = function (jqObj, opts) {
            if (opts.addClass) {
                jqObj.addClass(opts.addClass);
            }

            if (opts.removeClass) {
                jqObj.addClass(opts.removeClass);
            }
        };

    $module.extend({
        window: {
            tooltip: {

                hideAll: function (e, tooltipId, opts) {
                    var
                        target = $(e.target),

                        closeAll = function (jqObj, opts) {
                            hide(jqObj, opts);
                        };

                    if (target.children(tooltipId).length === 0 && !target
                        .is(tooltipId)) {
                        closeAll(target.find(tooltipId), opts);
                    }
                },

                new: function () {

                    var
                        Constructor = $module.window.tooltip.new,
                        args,
                        tooltip,
                        opts,

                        show = function (jqObj, opts) {
                            jqObj.show();

                            if (opts) {
                                resolveArgs(jqObj, opts);
                            }
                        },

                        toggle = function (jqObj, opts) {
                            jqObj.css("position", "absolute");

                            if (jqObj.is(":visible")) {
                                hide(jqObj, opts);
                            }
                            else {
                                show(jqObj, opts);
                            }
                        },

                        resolveClass = function (className) {
                            return "." + className.replace(/ /, ".");
                        };


                    if (!(this instanceof Constructor)) {
                        return new Constructor(arguments);
                    } else {
                        args = arguments.flatten();

                        this.handler = args[0];
                        tooltip = args[1];
                        if (args[2]) {
                            opts = args[2];
                        }
                    }

                    this.toggle = function (e) {
                        var
                            target = $(e.target);

                        if (!target.is(resolveClass(tooltip
                            .attr("class")))) {
                            toggle(tooltip, opts);
                        }
                    };
                }

            }
        }
    });

})(esPhinx.ui);
