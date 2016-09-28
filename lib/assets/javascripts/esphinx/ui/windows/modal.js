// require esphinx/support/array
// require esphinx/support/singleton

// require esphinx_ui
// require esphinx/observer


var
    esPhinx,
    Singleton,
    FlowControl;

(function ($module) {
    "use strict";

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

                        $ = esPhinx,
                        body = $("body"),
                        _classes = options.class || options.classes,

                        modal,
                        mask,
                        main,
                        loadingContainer,
                        container,
                        closeButton,
                        hideButton,
                        headers,
                        params,
                        singleton,
                        _windowController,
                        progress,
                        timesUp,

                        calledback,

                        isMinimized = function () {
                            var
                                index = minimized
                                .indexPerEquivalence(this);

                            if (index) {
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
                                index = isMinimized.call(this);

                            if (index) {
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
                            loadingContainer = $("<div></div>")
                                .addClass("container loading");

                            main.append(loadingContainer);

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
                                headers = options.header || options.headers || null;
                                params = options.param || options.params || null;
                                $.Ajax.new(options.url, {
                                    params: params,
                                    headers: headers,
                                    progress: function () {
                                        if (options.loading) {
                                            if (!calledback) {

                                                // progress = true;

                                                // ajaxProgress = true;

                                                calledback = true;
                                                options.loading
                                                    .call(mainReference);
                                            }
                                        }
                                    },
                                    success: function (a) {

                                        // progress = false;
                                        // ajaxProgress = false;

                                        a = $(a);
                                        if (!a.some()) {
                                            a = $.text(a);
                                        }

                                        // because here the processing is asynchronous, it's not linear
                                        // mainReference.hide(false);
                                        // mainReference.content(a);
                                        container.html(a);
                                    }
                                });
                            } else {
                                // colocar um flowControl aqui também???
                                if (options.loading) {
                                    // progress = true;
                                    options.loading.call(mainReference);
                                }

                                container.html(options.content);
                            }

                        },


                        bindHeaderEventListeners = function () {
                            if (closeButton) {
                                closeButton.on("click", function () {
                                    mainReference.close();
                                });
                            }

                            hideButton.on("click", function () {
                                mainReference.hide();
                            });
                        },

                        prependHeaderActions = function (main, options) {
                            var
                                header,
                                actions;

                            if (_windowController) {
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

                            if (!timesUp) {
                                modal.css("z-index", 0);

                                if (options.fadeIn) {
                                    restartTransition(mask);
                                    mask.css("transition", "opacity " +
                                             options.fadeIn);
                                }

                                mask.removeClass("transparent");
                                main.show();

                                visible = mainReference;

                                removeFromMinimized.call(this);
                            }
                        },

                        observers = function (main, options) {

                            main.observe(function () {
                                var
                                    count = 0,
                                    imgs = main.find("img");

                                mainReference.hide(false);

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

                                            return false;
                                        },
                                        ready: function () {
                                            main.centralizeAt(document);
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
                                    main.centralizeAt(document);
                                    if (progress) {
                                        mainReference.show();
                                    } else if (options.complete) {
                                        options.complete
                                            .call(mainReference);
                                    }
                                }

                            });

                            container.observe(function () {
                                var
                                    count = 0,
                                    imgs;

                                imgs = container.find("img");

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

                                            progress = true;

                                            return false;
                                        },
                                        ready: function () {
                                            main.html(container);
                                            prependHeaderActions(main, options);
                                            progress = false;
                                        }
                                    });

                                } else {
                                    main.html(container);
                                    prependHeaderActions(main, options);
                                    progress = false;
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
                                    mask.css("transition", "opacity " +
                                             options.fadeOut);

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
                                mask.css("transition", "opacity " +
                                         options.fadeOut);
                            }

                            mask.addClass("transparent");
                            modal.remove(maskTransitionDuration(mask));
                            mainReference.deleteSingleton();

                            return mainReference;
                        };

                        this.content = function (content) {
                            loadingContainer.html(content);

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
