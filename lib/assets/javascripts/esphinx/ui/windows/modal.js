// require ../support/jquery
// require esphinx_ui
// require esphinx/support/ajax
// require esphinx/support/function
// require esphinx/support/array
// require esphinx/observer

"use strict";

var
    jQuery,
    esPhinx,
    Singleton,
    Ajax,
    Constructor;

(function ($module) {

    $module.extend({

        windows: {
            modal: {
                // functions are objects in js
                new: function (contentSource, options) {

                    var
                        ModalConstructor = $module.windows.modal.new,
                        self = this,

                        $ = jQuery,
                        ajax = Ajax,
                        body = $("body"),

                        modal,
                        mask,
                        main,
                        container,
                        btnClose,
                        btnHide,
                        headers,
                        params,
                        asynchronousAnswer,
                        calledBack,
                        imgControl,

                        maskTransitionDuration = function (mask) {
                            return parseFloat(mask
                                .css("transition-duration")) * 1000;
                        },

                        restartTransition = function (mask) {
                            mask.css("transition", "opacity 0s");
                        },

                        resolveParams = function () {
                            options = options || {};

                            if (typeof options.windowController !== "boolean") {
                                options.windowController = true;
                            }

                            if (typeof options.remote !== "boolean") {
                                options.remote = true;
                            }
                        },

                        resolveHeaderActions = function (main, options) {
                            var
                                header,
                                actions;

                            if (options.windowController) {
                                header = $("<header></header>");
                                actions = $("<div></div>").addClass("actions");
                                btnClose = $('<a href="#"></a>')
                                    .addClass("btn-close");
                                btnHide = $('<a href="#"></a>')
                                    .addClass("btn-hide");

                                header.append(actions);
                                actions.append(btnClose);
                                actions.append(btnHide);

                                main
                                    .prepend(header)
                                    .css({
                                        "max-height": $(window).height(),
                                        "max-width": $(document).width()
                                    });

                                bindHeaderEventListeners();
                            }
                        },

                        bindHeaderEventListeners = function () {
                            // $(document).off("keydown").on("keydown", function (e) {
                            //     if (e.keyCode === 27) {
                            //         self.hide();
                            //     }
                            // });

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

                            esPhinx(main[0]).observe(function (observer) {
                                imgs = main.find("img");
                                if (imgs.length) {
                                    imgs.each(function (i, img) {
                                        esPhinx(img).on("load", function () {
                                            length += 1;
                                        });
                                    });

                                    FlowControl.new({
                                        condition: function (condition) {
                                            if (!options.remote) {
                                                if (!calledBack) {
                                                    calledBack = true;
                                                    if (options.loading) {
                                                        options.loading(main);
                                                    }
                                                    self.show();
                                                }
                                            }

                                            condition(length === imgs.length);
                                        },
                                        ready: function () {
                                            if (!asynchronousAnswer) {
                                                container.html(contentSource);
                                                main.html(container);
                                            }

                                            length = 0;
                                            resolveHeaderActions(main, options);

                                            if (options.complete) {
                                                self.hide(false);
                                                options.complete(self);
                                            }
                                        }
                                    })

                                } else {
                                    resolveHeaderActions(main, options);

                                    if (options.complete) {
                                        options.complete(self);
                                    }
                                }

                                // talvez tenha que remanejar o disconnect
                                observer.disconnect();
                            });
                        },

                        create = function (remote) {
                            modal = $("<div></div>")
                                .addClass("esphinx ui modal");
                            main = $("<main></main>")
                                .addClass("basicss hidden");
                            mask = $("<div></div>")
                                .addClass("basicss fixed transparent mask");
                            container = $("<div></div>").addClass("container");

                            modal
                                .append(mask)
                                .append(main);

                            body.append(modal);

                            observeContent();

                            if (options.remote) {
                                headers = options.header || options.headers || null;
                                params = options.param || options.params || null;
                                ajax.new(contentSource, {
                                    params: params,
                                    headers: headers,
                                    processing: function () {
                                        if (!calledBack) {
                                            calledBack = true;
                                            if (options.loading) {
                                                options.loading(main);
                                                // because here the processing is asynchronous, it's not linear
                                                self.show();
                                            }
                                        }
                                    },
                                    success: function (a) {
                                        if (options.success) {
                                            options.success(main);
                                        }
                                        asynchronousAnswer = a;
                                        container.html(asynchronousAnswer);
                                        // because here the processing is asynchronous, it's not linear
                                        self.hide(false);
                                        main.html(container);
                                    }
                                });
                            } else {
                                container.html(contentSource);
                                main.html(container);
                            }

                        };

                    // global scope (public)
                    this.close = function () {
                        main.hide();

                        restartTransition(mask);
                        if (options.fadeOut) {
                            mask.css("transition", "opacity " + options.fadeOut);
                        }
                        mask.addClass("transparent");

                        setTimeout(function () {
                            modal.remove();
                        }, maskTransitionDuration(mask));

                        self.deleteSingleton();
                    };

                    this.hide = function (animation = true) {
                        main.hide();

                        restartTransition(mask);

                        if (animation) {
                            if (options.fadeOut) {
                                mask.css("transition", "opacity " + options.fadeOut);
                                setTimeout(function () {
                                    modal.css("z-index", -1);
                                }, maskTransitionDuration(mask));
                            }
                        }

                        mask.addClass("transparent");
                    };

                    this.show = function () {
                        modal.css("z-index", 0);

                        restartTransition(mask);
                        if (options.fadeIn) {
                            mask.css("transition", "opacity " + options.fadeIn);
                        }
                        mask.removeClass("transparent");

                        main.centralizeAt($(document));
                        main.show();
                        // debugger
                    };

                    if (!(this instanceof ModalConstructor)) {
                        self = Singleton.exists(ModalConstructor, arguments);
                        if (self) {
                            self.show();
                        } else {
                            return ModalConstructor.singleton(arguments);
                        }
                    // that "else" will should to exit for the "show" method can be used by who instanciates it
                    } else {
                        resolveParams();
                        create();
                    }

                    return self;
                }
            }
        }
    });

}(esPhinx.ui));
