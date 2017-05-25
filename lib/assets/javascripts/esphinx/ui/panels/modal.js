// require esphinx_ui
// require esphinx/observer


var
    esPhinx,
    Flyweight;

(function($module) {
    "use strict";

    var
        minimized = [],
        visible;

    $module.extend(true, {

        panels: {

            modal: {

                hide: function(animation) {
                    visible.hide(animation);
                },

                close: function() {
                    visible.close();
                },

                // functions are objects in js
                new: function(options) {
                    var
                        self = $module.panels.modal.new,
                        mainReference = this,

                        $ = esPhinx,
                        body = $("body"),
                        _classes = options.class || options.classes,
                        _windowController,
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
                        instance,
                        timesUp,
                        calledback,
                        ready,
                        readyToShow,
                        instanceShowWasCalled,

                        isMinimized = function() {
                            var
                                index = minimized.indexOfEquivalence(this);

                            if (index) {
                                return index;
                            }

                            return false;
                        },

                        addToMinimized = function() {
                            if (!isMinimized.call(this)) {
                                minimized.push(this);
                            }
                        },

                        removeFromMinimized = function() {
                            var
                                index = isMinimized.call(this);

                            if (index) {
                                minimized.delete(index);
                            }
                        },

                        maskTransitionDuration = function(mask) {
                            return parseFloat(mask
                                .css("transition-duration")) * 1000;
                        },

                        restartTransition = function(mask) {
                            mask.css("transition", "opacity 0s");
                        },

                        resolveParams = function() {
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

                        create = function() {
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
                                window.setTimeout(function() {
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
                                    progress: function() {
                                        if (options.loading) {
                                            if (!calledback) {
                                                calledback = true;
                                                options.loading
                                                    .call(mainReference);
                                            }
                                        }
                                    },
                                    success: function(a) {
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


                        bindHeaderEventListeners = function() {
                            if (closeButton) {
                                closeButton.on("click", function() {
                                    close.call(mainReference);
                                });
                            }

                            hideButton.on("click", function() {
                                hide.call(mainReference);
                            });
                        },

                        prependHeaderActions = function(main, options) {
                            var
                                header = main.find("header"),
                                actions;

                            if ((_windowController || timesUp) &&
                                !header.count()) {
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
                                        "max-height": $(window.document).height(),
                                        "max-width": $(window.document).width()
                                    });

                                bindHeaderEventListeners();
                            }
                        },

                        show = function() {
                            // to execute without a complete key
                            $.FlowControl.new({
                                condition: function() {
                                    return readyToShow;
                                },

                                ready: function() {
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

                        // hide = function(animation = true) {
                        hide = function(animation) {
                            if (typeof animation != "boolean") {
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

                        close = function() {
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

                        observers = function(main, options) {
                            var
                                loadingContainerObserver;

                            main.observe(function() {
                                var
                                    count = 0,
                                    imgs = main.find("img");

                                if (imgs.some()) {
                                    imgs.each(function(img) {
                                        $(img).on("load", function(e) {
                                            count += 1;
                                        });
                                    });

                                    $.FlowControl.new({
                                        condition: function() {
                                            return count == imgs.length ||
                                                timesUp;
                                        },
                                        ready: function() {
                                            main.centralizeAt(window.document);
                                            if (progress ||
                                                progress === undefined) {
                                                readyToShow = true;
                                                show.call(mainReference);
                                            }
                                        }
                                    });

                                } else {
                                    prependHeaderActions(main, options);
                                    main.centralizeAt(window.document);
                                    readyToShow = true;
                                    if (options.complete && !progress) {
                                        options.complete
                                            .call(mainReference);
                                    }
                                }

                            });

                            container.observe(function() {
                                var
                                    count = 0,
                                    imgs;

                                loadingContainerObserver = this;
                                imgs = container.find("img");

                                if (imgs.some()) {

                                    imgs.each(function(img) {
                                        $(img).on("load", function(e) {
                                            count += 1;
                                        });
                                    });

                                    $.FlowControl.new({
                                        condition: function() {
                                            progress = true;
                                            return count == imgs.length ||
                                                timesUp;
                                        },
                                        ready: function() {
                                            progress = false;
                                            hide.call(mainReference, false);
                                            if (!timesUp) {
                                                main.html(container);
                                            }
                                            prependHeaderActions(main, options);
                                            main.centralizeAt(window.document);
                                            ready = true;
                                            readyToShow = true;
                                            if (instanceShowWasCalled) {
                                                show.call(mainReference);
                                            }

                                            if (options.complete) {
                                                options.complete
                                                    .call(mainReference);
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
                                    main.centralizeAt(window.document);
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
                        //     return self.functionalSingleton(arguments);
                        // } else if (isMinimized.call(self.instance)) {
                        //     self.instance.show();
                        // }

                        instance = Flyweight.Factory
                            .exists(self, arguments);
                        if (!instance) {
                            return Flyweight.Factory.new(self, arguments);
                        } else if (isMinimized.call(instance)) {
                            mainReference = instance;
                            show.call(mainReference);
                        }

                    } else {
                        // global scope (public)

                        // this.hide = function(animation = true) {
                        this.hide = function(animation) {
                            if (typeof animation != "boolean") {
                                animation = true;
                            }

                            hide.call(mainReference, animation);

                            return mainReference;
                        };

                        this.show = function() {
                            show.call(mainReference);
                            instanceShowWasCalled = true;

                            return mainReference;
                        };

                        this.close = function() {
                            close.call(mainReference);
                            return mainReference;
                        };

                        this.content = function(content) {
                            var
                                node = $(content);

                            if (!node.some()) {
                                node = window.document.createTextNode(content);
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
