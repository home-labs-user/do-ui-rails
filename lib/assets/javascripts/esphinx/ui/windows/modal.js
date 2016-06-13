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
                // new: function (contentSource, remote, options) {
                new: function (contentSource, options) {
                    options = options || {};

                    // if (!options) {

                    // }
                    // // if (!options.header ||
                    //     typeof options.header !== "boolean") {
                    //     options.header = true;
                    // }

                    var
                        ModalConstructor = $module.windows.modal.new,
                        self = this,

                        $ = jQuery,
                        ajax = Ajax,
                        body = $("body"),
                        time = 0,

                        headers,
                        params,
                        modal,
                        mask,
                        main,
                        header,
                        actions,
                        btnClose,
                        container,
                        btnHide,
                        callback,

                        resolveRemote = function () {

                        },

                        resolveParams = function () {

                            // if (typeof options === )

                            // debugger
                            // resolveOptions
                            // if (typeof options === "undefined") {
                            if (typeof options === "undefined"
                                || typeof options === "function") {
                                options = {};
                                if (typeof remote === "boolean") {
                                    options.header = true;
                                }
                            } else if (typeof options === "boolean") {
                                options.header = options;
                            }
                            // else if (typeof options === "function") {
                            //     if (typeof remote === "boolean") {
                            //         options = {};
                            //         options.header = true;
                            //     } else {
                            //         remote = false;
                            //     }
                            // }

                            // resolveRemote
                            if (typeof remote === "object") {
                                options = remote;
                                remote = true;
                                if (options.complete) {
                                    callback = options.complete;
                                }
                            } else if (typeof remote === "function") {
                                callback = remote;
                                remote = false;
                            } else if (typeof remote !== "boolean") {
                                remote = true;
                            }
                        },

                        resolveHeaderActions = function (main, options) {
                            // debugger
                            if (options.header) {

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

                        // setButtonsAction = function () {
                        bindHeaderEventListeners = function () {
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

                            esPhinx(container[0]).observe(function (observer) {
                                imgs = main.find("img");
                                if (imgs.length) {
                                    imgs.each(function (i, img) {
                                        esPhinx(img).on("load", function () {
                                            length += 1;
                                        });
                                    });

                                    FlowControl.new({
                                        condition: function (condition) {
                                            condition(length === imgs.length);
                                            if (callback) {
                                                callback(self);
                                            }
                                        },
                                        ready: function () {
                                            main.centralizeAt($(document));
                                            if (callback) {
                                                callback(self);
                                            }
                                            self.show();
                                        }
                                    })

                                } else {
                                    main.centralizeAt($(document));
                                    self.show();
                                }

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

                            // header = $("<header></header>");
                            // actions = $("<div></div>").addClass("actions");
                            // btnClose = $('<a href="javascript:void(0)"></a>')
                            //     .addClass("btn-close");
                            // btnHide = $('<a href="javascript:void(0)"></a>')
                            //     .addClass("btn-hide");

                            container = $("<div></div>").addClass("container");

                            modal
                                .append(mask)
                                .append(main);

                            // depends
                            // main
                            //     .append(header)
                            //     .css({
                            //         "max-height": $(window).height(),
                            //         "max-width": $(document).width()
                            //     });

                            // header.append(actions);
                            // actions.append(btnClose);
                            // actions.append(btnHide);

                            main.append(container);

                            resolveHeaderActions(main, options);
                            // setButtonsAction();

                            observeContent();

                            if (remote) {
                                headers = options.header || options.headers || null;
                                params = options.param || options.params || null;
                                ajax.new(contentSource, {
                                    params: params,
                                    headers: headers,
                                    processing: function () {
                                        if (options.loading) {
                                            options.loading(main);
                                        }
                                    },
                                    success: function (answer) {
                                        body.append(modal);
                                        container.append(answer);
                                    }
                                });
                            } else {
                                body.append(modal);
                                container.append(contentSource);

                                if (callback) {
                                    callback(self);
                                }
                            }

                        };

                    if (!(this instanceof ModalConstructor)) {
                        self = Singleton.instanceExists
                            .apply(ModalConstructor, arguments);
                        if (self) {
                            self.show();
                        } else {
                            return ModalConstructor.singleton(arguments);
                        }
                    // that "else" will should to exit for the "show" method can be used by who instanciates it
                    } else {
                        // resolveParams();
                        // create(remote);
                        create();
                    }

                    // global scope (public)
                    this.close = function () {
                        main.hide();

                        // 1.3s
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

                        time = parseFloat(
                            mask.css("transition-duration")
                        ) * 1000;
                        setTimeout(function () {
                            modal.css("zIndex", -1);
                        }, time);

                    };

                    this.show = function () {
                        modal.css("z-index", 0);

                        if (options.fadeIn) {
                            mask.css("transition", "opacity " + options.fadeIn);
                        }
                        mask.removeClass("transparent");

                        main.show();
                    };

                    return self;
                }
            }
        }
    });

}(esPhinx.ui));
