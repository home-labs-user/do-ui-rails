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

    var
        minimized = [];

    $module.extend({

        windows: {

            modal: {

                // functions are objects in js
                new: function (contentSource, options) {
                    var
                        self = $module.windows.modal.new,
                        mainReference = this,
                        args = Array.from(arguments),

                        $ = esPhinx,
                        ajax = Ajax,
                        body = $("body"),
                        imagesLoaded = [],

                        modal,
                        mask,
                        main,
                        container,
                        btnClose,
                        btnHide,
                        headers,
                        params,
                        asynchronousAnswer,
                        imgControl,
                        singleton,
                        index,

                        isMinimized = function () {
                            var
                                index;

                            if (index = minimized
                                .indexPerEquivalence(this)) {
                                return index;
                            }

                            return false;
                        },

                        addToMinimized = function () {
                            if (!isMinimized.call(this)) {
                                minimized.push(this);
                            }
                        },

                        removeFromMinimized = function () {
                            var
                                index;

                            if (index = isMinimized.call(this)) {
                                minimized.delete(index);
                            }
                        },

                        show = function () {
                            modal.css("z-index", 0);
                            restartTransition(mask);
                            if (options.fadeIn) {
                                mask.css("transition", "opacity "
                                + options.fadeIn);
                            }
                            mask.removeClass("transparent");
                            main.show();

                            removeFromMinimized.call(this);
                        },

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
                                        "max-height": $(document).height(),
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

                            btnHide.on("click", function () {
                                mainReference.hide();
                            });

                            btnClose.on("click", function () {
                                mainReference.close();
                            });

                        },

                        observeContent = function (main, options) {
                            var
                                count = 0,
                                imgs;

                            main.observe(function () {

                                imgs = main.find("img");
                                if (imgs.any()) {
                                    imgs.each(function (img) {
                                        if (imagesLoaded
                                            .indexPerEquivalence(img)) {
                                            count += 1;
                                        } else {
                                            $(img).on("load", function (e) {
                                                count += 1;
                                            });
                                        }
                                    });

                                    FlowControl.new({
                                        condition: function () {
                                            if (count === imgs.length) {
                                                return true;
                                            }

                                            // when processing is synchronous
                                            if (!options.remote) {
                                                if (options.loading) {
                                                    options.loading(main);
                                                    main.centralizeAt(document);
                                                    mainReference.show();
                                                    // debugger
                                                }
                                            }

                                            return false;
                                        },
                                        ready: function () {
                                            if (!asynchronousAnswer) {
                                                container.html(contentSource);
                                                main.html(container);
                                            }

                                            resolveHeaderActions(main, options);
                                            main.centralizeAt(document);

                                            if (options.complete) {
                                                mainReference.hide(false);

                                                options.complete
                                                    .call(mainReference);
                                            }
                                        }
                                    });

                                } else {
                                    resolveHeaderActions(main, options);
                                    main.centralizeAt(document);

                                    if (options.complete) {
                                        options.complete.call(mainReference);
                                    }
                                }

                                this.disconnect();
                            });
                        },

                        create = function (remote) {
                            modal = $("<div></div>")
                                .addClass("esphinx ui modal");
                            main = $("<main></main>")
                                .addClass("hidden");
                            mask = $("<div></div>")
                                .addClass("fixed transparent mask");
                            container = $("<div></div>").addClass("container");
                            debugger
                            modal
                                .append(mask)
                                .append(main);

                            body.append(modal);

                            observeContent(main, options);

                            if (options.remote) {
                                headers = options.header || options.headers
                                || null;
                                params = options.param || options.params
                                || null;
                                ajax.new(contentSource, {
                                    params: params,
                                    headers: headers,
                                    progress: function () {
                                        if (options.loading) {
                                            // callback
                                            options.loading(main);
                                            main.centralizeAt(document);
                                            mainReference.show();
                                            // debugger
                                        }
                                    },
                                    success: function (a) {
                                        asynchronousAnswer = a;
                                        container.html(asynchronousAnswer);
                                        // because here the processing is asynchronous, it's not linear
                                        mainReference.hide(false);
                                        main.html(container);
                                    }
                                });
                            } else {
                                container.html(contentSource);
                                main.html(container);
                            }

                        };

                    resolveParams();

                    if (!(this instanceof self)) {
                        // debugger
                        // if (!self.instance) {
                        //     return self.singleton(arguments);
                        // } else if (isMinimized.call(self.instance)) {
                        //     self.instance.show();
                        // }

                        singleton = Singleton
                            .exists(self, arguments);
                        // debugger
                        if (!singleton) {
                            return Singleton.new(self, arguments);
                        } else if (isMinimized.call(singleton)) {
                            singleton.show();
                        }

                    } else {
                        create();
                    }

                    // global scope (public)
                    this.hide = function (animation) {
                        if (typeof animation !== "boolean") {animation = true;}
                    // this.hide = function (animation = true) {
                        main.hide();

                        restartTransition(mask);
                        if (animation) {
                            if (options.fadeOut) {
                                mask.css("transition", "opacity "
                                + options.fadeOut);

                                modal.css("z-index", -1,
                                    maskTransitionDuration(mask));
                            }
                        }

                        mask.addClass("transparent");

                        addToMinimized.call(this);

                        return mainReference;
                    };

                    this.show = function () {
                        show();

                        return mainReference;
                    };

                    this.close = function () {
                        main.hide();

                        restartTransition(mask);
                        if (options.fadeOut) {
                            mask.css("transition", "opacity "
                                + options.fadeOut);
                        }
                        mask.addClass("transparent");

                        modal.remove(maskTransitionDuration(mask));

                        mainReference.deleteSingleton();

                        return mainReference;
                    };

                    return this;
                }

            }

        }

    });

}(esPhinx.ui));
