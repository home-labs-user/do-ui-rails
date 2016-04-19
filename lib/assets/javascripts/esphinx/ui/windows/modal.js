// require ../support/jquery
// require esphinx_ui
// require esphinx/support/ajax
// require esphinx/support/function
// require esphinx/support/array
// require esphinx/observer

var
    jQuery,
    esPhinx,
    Singleton,
    Ajax;

(function ($module) {
    "use strict";

    $module.extend({

        window: {
            // function are object in js
            modal: {

                new: function () {

                    var
                        self = this,
                        $ = jQuery,
                        ajax = Ajax,
                        args = arguments[0],
                        body = $("body"),
                        time = 0,
                        Constructor = $module.window.modal.new,

                        modal,
                        mask,
                        main,
                        header,
                        actions,
                        btnClose,
                        container,
                        btnHide,
                        Constructor,

                        setButtonsAction = function () {

                            $(document).off("keydown").on("keydown", function (e) {
                                if (e.keyCode === 27) {
                                    self.hide();
                                }
                            });

                            btnHide.click(function () {
                                self.hide();
                            });

                            btnClose.click(function () {
                                self.close();
                            });

                        },

                        observeContent = function () {
                            var
                                imgs,
                                length = 0;

                            esPhinx(container[0]).observe({
                                config: {
                                    childList: true
                                },
                                done: function () {
                                    // implementar método find em esPhinx
                                    imgs = main.find("img");
                                    if (imgs.length) {

                                        // future esPhinx way
                                        // imgs.afterLoad(function () {
                                        //     modal.centralizeOn($(document));
                                        //     self.show();
                                        // });

                                        // jQuery way
                                        // imgs.on('load',function() {
                                        //     modal.centralizeOn($(document));
                                        //     self.show();
                                        // });

                                        // hybrid way
                                        imgs.each(function (i, img) {
                                            img.addEventListener("load", function () {
                                                length += 1;
                                            });
                                        });

                                        (function waitLoading () {
                                            setTimeout(function () {
                                                if (length === imgs.length) {
                                                    main.centralizeOn($(document));
                                                    self.show();
                                                } else {
                                                    waitLoading();
                                                }
                                            }, 0);
                                        })();
                                    } else {
                                        main.centralizeOn($(document));
                                        self.show();
                                    }
                                }
                            });
                        },

                        create = function () {
                            modal = $("<div></div>")
                                .addClass("esphinx ui modal");
                            main = $("<main></main>")
                                .addClass("basicss hidden");
                            mask = $("<div></div>")
                                .addClass("basicss fixed transparent mask");
                            header = $("<header></header>");
                            actions = $("<div></div>").addClass("actions");
                            btnClose = $('<a href="javascript:void(0)"></a>')
                                .addClass("btn-close");
                            btnHide = $('<a href="javascript:void(0)"></a>')
                                .addClass("btn-hide");
                            container = $("<div></div>").addClass("container");

                            body.append(modal);

                            modal
                                .append(mask)
                                .append(main);

                            main
                                .append(header)
                                .css({
                                    "max-height": $(window).height(),
                                    "max-width": $(document).width()
                                });

                            header.append(actions);

                            actions.append(btnClose);
                            actions.append(btnHide);

                            main.append(container);

                            setButtonsAction();

                            observeContent();

                            ajax.new({
                                url: args.url,
                                params: args.params,
                                processing: function (xhr) {
                                    if (args.loading) {
                                        args.loading(modal, xhr);
                                    }
                                },
                                success: function (answer) {
                                    container.append(answer);
                                }
                            });

                        };

                    if (!(this instanceof Constructor)) {
                        self = Singleton.instanceExists
                            .apply(Constructor, arguments.flatten());
                        if (self) {
                            self.show();
                        } else {
                            return Constructor.singleton(arguments);
                        }
                    // esse else deverá sair para que o show possa ser usado por quem o instanciou
                    } else {
                        create();
                    }

                    // global scope (public)
                    this.close = function () {
                        // o objeto deveria ser detruído da memória??
                        main.hide();

                        mask.replaceToggleClass("transparent", "opacity-transition");

                        time = parseFloat(
                            mask.css("transition-duration")
                        ) * 1000;
                        setTimeout(function () {
                            modal.remove();
                        }, time);

                        self.deleteSingleton();
                    };

                    this.hide = function () {
                        main.hide();

                        mask.replaceToggleClass("transparent", "opacity-transition");

                        modal.css("zIndex", -1);

                    };

                    this.show = function () {
                        // debugger;
                        // modal = modal || self.domObject;
                        modal.css("zIndex", 0);
                        mask
                            .replaceToggleClass("transparent",
                                "opacity-transition");

                        main.show();
                    };
                }
            }
        }
    });

}(esPhinx.ui));
