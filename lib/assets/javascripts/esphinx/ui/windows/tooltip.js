// require ../support/jquery
// require esphinx/support/object
// require esphinx_ui

"use strict";

var
    jQuery,
    esPhinx;

(function ($module) {

    var
        // $ = jQuery,
        $ = esPhinx,

        hide = function (colletion, options) {
            // faltam testes para suporte a estilização. Talvez tenha de mapear as propriedades do css para ver se há transition, o tipo, caso tenha pegar os ms para usar no setTimeout
            colletion.hide();

            if (options) {
                resolveArgs(colletion, options);
            }
        },

        resolveArgs = function (colletion, options) {
            if (options.addClass) {
                colletion.addClass(options.addClass);
            }

            if (options.removeClass) {
                colletion.addClass(options.removeClass);
            }
        };

    $module.extend({

        windows: {

            tooltip: {

                hideAll: function (e, tooltipClass, options) {
                    var
                        target = $(e.target),

                        closeAll = function (colletion, options) {
                            hide(colletion, options);
                        };

                    // if (target.children(tooltipClass).length === 0 && !target
                    // debugger
                    if (target.find(tooltipClass).count() === 0 && !target
                        .hasClass(tooltipClass)) {
                        closeAll(target.find(tooltipClass), options);
                    }
                },

                new: function () {

                    var
                        Constructor = $module.windows.tooltip.new,
                        args,
                        // tooltip,
                        options,

                        show = function (colletion, options) {
                            colletion.show();

                            if (options) {
                                resolveArgs(colletion, options);
                            }
                        },

                        toggle = function (colletion, options) {
                            colletion.css("position", "absolute");

                            if (colletion.visible()) {
                                hide(colletion, options);
                            }
                            else {
                                show(colletion, options);
                            }
                        },

                        resolveClass = function (className) {
                            return "." + className.replace(/ /, ".");
                        };


                    if (!(this instanceof Constructor)) {
                        return new Constructor(arguments);
                    }

                    args = Array.flatten(arguments);

                    if (args[1]) {
                        options = args[1];
                    }

                    this.tooltip = args[0];

                    // when click on son, the parent too will answer, because son it is contained in parent
                    this.toggle = function (e) {
                        var
                            target = $(e.target);

                        if (!target.is(this.tooltip)) {
                            toggle(this.tooltip, options);
                        }
                    };
                }

            }

        }

    });

})(esPhinx.ui);
