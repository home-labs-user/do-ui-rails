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
                        progress,
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
                        timesUp,
                        calledback,
                        ready,
                        readyToShow,
                        instanceShowWasCalled,

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
                                _windowController = true;
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
                                    if (options.timesUp &&
                                        typeof options.timesUp == "function" &&
                                                                        !ready) {
                                        timesUp = true;
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
                                                calledback = true;
                                                options.loading
                                                    .call(mainReference);
                                            }
                                        }
                                    },
                                    success: function (a) {
                                        hide.call(mainReference, false);
                                        container.html(a);
                                    }
                                });
                            } else {
                                if (options.loading) {
                                    options.loading.call(mainReference);
                                }

                                hide.call(mainReference, false);
                                container.html(options.content);
                            }

                        },


                        bindHeaderEventListeners = function () {
                            if (closeButton) {
                                closeButton.on("click", function () {
                                    close.call(mainReference);
                                });
                            }

                            hideButton.on("click", function () {
                                hide.call(mainReference);
                            });
                        },

                        prependHeaderActions = function (main, options) {
                            var
                                header = main.find("header"),
                                actions;

                            if (_windowController && !header.count()) {
                                header = $("<header></header>");
                                actions = $("<div></div>").addClass("actions");
                                hideButton = $('<a href="#"></a>')
                                    .addClass("hide-button");

                                header.append(actions);

                                if (options.closeButton || timesUp) {
                                    closeButton = $('<a href="#"></a>')
                                        .addClass("close-button");
                                    actions.append(closeButton);
                                }

                                if (!timesUp) {
                                    actions.append(hideButton);
                                }

                                main
                                    .prepend(header)
                                    .css({
                                        "max-height": $(document).height(),
                                        "max-width": $(document).width()
                                    });

                                bindHeaderEventListeners();
                            }
                        },

                        show = function () {
                            // to execute without a complete key
                            FlowControl.new({
                                condition: function () {
                                    if (readyToShow) {
                                        return true;
                                    }

                                    return false;
                                },
                                ready: function () {
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
                            });
                        },

                        // hide = function (animation = true) {
                        hide = function (animation) {
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
                        },

                        close = function () {
                            main.hide();

                            restartTransition(mask);
                            if (options.fadeOut) {
                                mask.css("transition", "opacity " +
                                         options.fadeOut);
                            }

                            mask.addClass("transparent");
                            modal.remove(maskTransitionDuration(mask));
                            mainReference.deleteSingleton();
                        },

                        observers = function (main, options) {
                            var
                                loadingContainerObserver;

                            main.observe(function () {
                                var
                                    count = 0,
                                    imgs = main.find("img");

                                if (imgs.some()) {
                                    imgs.each(function (img) {
                                        $(img).on("load", function (e) {
                                            count += 1;
                                        });
                                    });

                                    FlowControl.new({
                                        condition: function () {
                                            if (count == imgs.length ||
                                                timesUp) {
                                                return true;
                                            }

                                            return false;
                                        },
                                        ready: function () {
                                            main.centralizeAt(document);
                                            if (progress ||
                                                progress === undefined) {
                                                readyToShow = true;
                                                show.call(mainReference);
                                            }
                                        }
                                    });

                                } else {
                                    prependHeaderActions(main, options);
                                    main.centralizeAt(document);
                                    readyToShow = true;
                                }

                            });

                            container.observe(function () {
                                var
                                    count = 0,
                                    imgs;

                                loadingContainerObserver = this;
                                imgs = container.find("img");

                                if (imgs.some()) {

                                    imgs.each(function (img) {
                                        $(img).on("load", function (e) {
                                            count += 1;
                                        });
                                    });

                                    FlowControl.new({
                                        condition: function () {
                                            progress = true;
                                            if (count == imgs.length ||
                                                timesUp) {
                                                return true;
                                            }

                                            return false;
                                        },
                                        ready: function () {
                                            progress = false;
                                            hide.call(mainReference, false);
                                            if (!timesUp) {
                                                main.html(container);
                                            }
                                            prependHeaderActions(main, options);
                                            main.centralizeAt(document);
                                            ready = true;
                                            readyToShow = true;
                                            if (instanceShowWasCalled) {
                                                show.call(mainReference);
                                            }
                                        }
                                    });

                                // doesn't have imgs
                                } else {
                                    progress = false;
                                    hide.call(mainReference, false);
                                    if (!timesUp) {
                                        main.html(container);
                                    }
                                    prependHeaderActions(main, options);
                                    main.centralizeAt(document);
                                    ready = true;
                                    readyToShow = true;
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
                            show.call(mainReference);
                        }

                    } else {
                        // global scope (public)

                        // this.hide = function (animation = true) {
                        this.hide = function (animation) {
                            if (typeof animation !== "boolean") {
                                animation = true;
                            }

                            hide.call(mainReference, animation);

                            return mainReference;
                        };

                        this.show = function () {
                            show.call(mainReference);
                            instanceShowWasCalled = true;

                            return mainReference;
                        };

                        this.close = function () {
                            close.call(mainReference);
                            return mainReference;
                        };

                        this.content = function (content) {
                            var
                                node = $(content);

                            if (!node.some()) {
                                node = $.text(content);
                            }

                            hide.call(mainReference, false);
                            loadingContainer.html(node);
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
