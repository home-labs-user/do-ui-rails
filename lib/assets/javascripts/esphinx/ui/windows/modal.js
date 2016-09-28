// require esphinx/support/array
// require esphinx/support/singleton

// require esphinx_ui
// require esphinx/observer

"use strict";

var
    esPhinx,
    Singleton;

(function ($module) {

    var
        minimized = [],
        visible;

    $module.extend({

        windows: {

            modal: {

                hide: function (animation) {
                    visible.hide(animation);
                },

                close: function () {
                    visible.close();
                },

                // functions are objects in js
                new: function (options) {
                    var
                        self = $module.windows.modal.new,
                        mainReference = this,
                        args = Array.from(arguments),

                        $ = esPhinx,
                        body = $("body"),
                        imagesLoaded = [],
                        _classes = options.class || options.classes,

                        modal,
                        mask,
                        main,
                        container,
                        closeButton,
                        hideButton,
                        headers,
                        params,
                        asynchronousAnswer,
                        imgControl,
                        singleton,
                        index,
                        _windowController,

                        ready,
                        progress,
                        timesUp,

                        ajaxProgress,

                        calledback,

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

                        maskTransitionDuration = function (mask) {
                            return parseFloat(mask
                                .css("transition-duration")) * 1000;
                        },

                        restartTransition = function (mask) {
                            mask.css("transition", "opacity 0s");
                        },

                        resolveParams = function () {
                            options = options || {};

                            if (typeof options.windowController != "boolean") {
                                _windowController = false;
                            } else {
                                _windowController = options.windowController;
                            }

                            if (typeof options.closeButton != "boolean") {
                                options.closeButton = true;
                            }

                            if (options.content) {
                                options.url = false;
                            }
                        },

                        create = function () {
                            modal = $("<div></div>")
                                .addClass("esphinx ui modal");

                            if (_classes) {
                                modal.addClass(_classes);
                            }

                            main = $("<main></main>")
                                .addClass("hidden");
                            mask = $("<div></div>")
                                .addClass("fixed transparent mask");
                            container = $("<div></div>").addClass("container");

                            main.append(container);

                            modal
                                .append(mask)
                                .append(main);

                            body.append(modal);

                            if (options.timeout) {
                                setTimeout(function () {
                                    timesUp = true;
                                    if (options.timesUp &&
                                        typeof options.timesUp == "function") {
                                        options.timesUp.call(mainReference);
                                    }
                                }, options.timeout * 1000);
                            }

                            observers(main, options);

                            if (options.url) {
                                headers = options.header || options.headers
                                || null;
                                params = options.param || options.params
                                || null;
                                $.Ajax.new(options.url, {
                                    params: params,
                                    headers: headers,
                                    progress: function () {
                                        if (options.loading) {
                                            if (!calledback) {

                                                progress = true;

                                                // ajaxProgress = true;

                                                calledback = true;
                                                options.loading
                                                    .call(mainReference);
                                            }
                                        }
                                    },
                                    success: function (a) {

                                        progress = false;
                                        // ajaxProgress = false;

                                        a = $(a);
                                        if (!a.some()) {
                                            a = $.text(a);
                                        }

                                        // because here the processing is asynchronous, it's not linear
                                        mainReference.hide(false);
                                        mainReference.content(a);
                                    }
                                });
                            } else {
                                // colocar um flowControl aqui também???
                                if (options.loading) {
                                    progress = true;
                                    options.loading.call(mainReference);
                                }

                                mainReference.content(options.content);
                            }

                        },


                        bindHeaderEventListeners = function () {
                            // $(document).off("keydown").on("keydown", function (e) {
                            //     if (e.keyCode == 27) {
                            //         self.hide();
                            //     }
                            // });

                            if (closeButton) {
                                closeButton.on("click", function () {
                                    mainReference.close();
                                });
                            }

                            hideButton.on("click", function () {
                                mainReference.hide();
                            });

                        },

                        resolveHeaderActions = function (main, options) {
                            var
                                // container = main.find(".container"),
                                // childNodesCount = container.childNodes()
                                //     .count(),
                                // imgsCount = container.find("img").count(),
                                header,
                                actions;

                            // if (childNodesCount > 1
                            //     || (childNodesCount == 1 && !imgsCount)
                            //     || _windowController) {
                            //     header = $("<header></header>");
                            //     actions = $("<div></div>").addClass("actions");
                            //     hideButton = $('<a href="#"></a>')
                            //         .addClass("hide-button");

                            //     header.append(actions);

                            //     if (options.closeButton) {
                            //         closeButton = $('<a href="#"></a>')
                            //             .addClass("close-button");
                            //         actions.append(closeButton);
                            //     }

                            //     actions.append(hideButton);

                            //     main
                            //         .prepend(header)
                            //         .css({
                            //             "max-height": $(document).height(),
                            //             "max-width": $(document).width()
                            //         });

                            //     bindHeaderEventListeners();
                            // }

                            if (!ajaxProgress) {
                                header = $("<header></header>");
                                actions = $("<div></div>").addClass("actions");
                                hideButton = $('<a href="#"></a>')
                                    .addClass("hide-button");

                                header.append(actions);

                                if (options.closeButton) {
                                    closeButton = $('<a href="#"></a>')
                                        .addClass("close-button");
                                    actions.append(closeButton);
                                }

                                actions.append(hideButton);

                                main
                                    .prepend(header)
                                    .css({
                                        "max-height": $(document).height(),
                                        "max-width": $(document).width()
                                    });

                                bindHeaderEventListeners();
                            }

                        },

                        show = function (mainReference) {

                            FlowControl.new({
                                condition: function () {
                                    // debugger
                                    if (ready && !timesUp) {
                                    // if ((ready && !progress) || ajaxProgress) {
                                        return true;
                                    }

                                    return false;
                                },
                                ready: function () {
                                    modal.css("z-index", 0);

                                    if (options.fadeIn) {
                                        restartTransition(mask);
                                        mask.css("transition", "opacity "
                                        + options.fadeIn);
                                    }

                                    mask.removeClass("transparent");
                                    main.show();

                                    visible = mainReference;

                                    removeFromMinimized.call(this);
                                }
                            });

                        },

                        observers = function (main, options) {
                            var
                                count = 0,
                                imgs;

                            main.observe(function () {
                                imgs = main.find("img");

                                if (imgs.some()) {
                                    imgs.each(function (img) {
                                        $(img).on("load", function (e) {
                                            count += 1;
                                        });
                                    });

                                    FlowControl.new({
                                        condition: function () {
                                            if (count == imgs.length) {
                                                return true;
                                            }

                                            // progress = true;

                                            return false;
                                        },
                                        ready: function () {

                                            // na hora de mostarar está acontecendo o seguinte problema:
                                            // if () {
                                            //     progress = false;
                                            // }

                                            mainReference.hide(false);

                                            // main.html(container);

                                            resolveHeaderActions(main, options);
                                            main.centralizeAt(document);

                                            ready = true;

                                            // debugger
                                            // if (!asynchronousAnswer.some()) {
                                            // if (ajaxProgress) {
                                            debugger
                                            if (progress) {
                                                mainReference.show();
                                            } else if (options.complete) {
                                                options.complete
                                                    .call(mainReference);
                                            }

                                        }
                                    });

                                // doesn't have imgs
                                } else {
                                    resolveHeaderActions(main, options);
                                    main.centralizeAt(document);
                                    ready = true;
                                    if (options.complete) {
                                        options.complete.call(mainReference);
                                    }
                                }

                                this.disconnect();
                            });
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
                        if (!singleton) {
                            return Singleton.new(self, arguments);
                        } else if (isMinimized.call(singleton)) {
                            mainReference = singleton;
                            mainReference.show();
                        }

                    } else {
                        // global scope (public)

                        // this.hide = function (animation = true) {
                        this.hide = function (animation) {
                            if (typeof animation !== "boolean") {
                                animation = true;
                            }

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
                            show(mainReference);

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

                        this.content = function (content) {
                            // progress ? main.html(content) : container
                            //     .html(content);

                            container.html(content);

                            return mainReference;
                        };

                        create();

                    }

                    return mainReference;
                }

            }

        }

    });

}(esPhinx.ui));
