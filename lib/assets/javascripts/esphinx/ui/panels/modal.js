var
    esPhinx,
    AsyncPromise,
    Flyweight;


(function ($, $module) {
    "use strict";

    var
        visible,
        minimized = [];

    $module.extend({
        panels: {modal: {}}
    });

    $.Extender.extend($module.panels.modal, true, {
        hide: function (animation) {
            visible.hide(animation);
        },

        close: function () {
            visible.close();
        },

        // functions are constructors in js
        new: function (options) {
            var
                _windowController,
                progress,
                modal,
                mask,
                section,
                loadingContainer,
                main,
                closeButton,
                hideButton,
                headers,
                URLParameters,
                instance,
                timesUp,
                calledback,
                ready,
                readyToShow,
                instanceShowWasCalled,
                self = this,
                ConstructorReference = $module.panels.modal.new,
                body = $("body"),
                _classes = options.class || options.classes,

                isMinimized = function () {
                    var
                        index = minimized.indexOfEquivalence(this);

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
                        minimized.deleteAt(index);
                    }
                },

                maskTransitionDuration = function (mask) {
                    return parseFloat(mask
                        .css("transition-duration")) * 1000;
                },

                restartTransition = function (mask) {
                    mask.css("transition", "opacity 0s");
                },

                resolveArguments = function () {
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

                    section = $("<section></section>").addClass("hidden");
                    mask = $("<div></div>").addClass("fixed transparent mask");
                    main = $("<div></div>").addClass("main");
                    loadingContainer = $("<div></div>")
                        .addClass("main loading");

                    section.append(loadingContainer);

                    modal.append(mask).append(section);

                    body.append(modal);

                    if (options.timeout) {
                        window.setTimeout(function () {
                            if (options.timesUp &&
                                typeof options.timesUp == "function" &&
                                                                !ready) {
                                timesUp = true;
                                options.timesUp.call(self);
                            }
                        }, options.timeout * 1000);
                    }

                    observers(section, options);

                    if (options.url) {
                        headers = options.header || options.headers || null;
                        URLParameters = options.param ||
                            options.URLParameters || null;

                        $.Ajax.new(options.url).get({
                            URLParameters: URLParameters,
                            headers: headers,
                            progress: function () {
                                if (options.loading) {
                                    if (!calledback) {
                                        calledback = true;
                                        options.loading
                                            .call(self);
                                    }
                                }
                            },
                            success: function (r) {
                                hide.call(self, false);
                                main.html(r);
                            }
                        });

                    } else {
                        if (options.loading) {
                            options.loading.call(self);
                        }

                        hide.call(self, false);
                        main.html(options.content);
                    }
                },


                bindHeaderEventListeners = function () {
                    if (closeButton) {
                        closeButton.on("click", function () {
                            close.call(self);
                        });
                    }

                    hideButton.on("click", function () {
                        hide.call(self);
                    });
                },

                prependHeaderActions = function (section, options) {
                    var
                        header = section.find("header"),
                        actions;

                    if ((_windowController || timesUp) &&
                        !header.amount()) {
                        header = $("<header></header>");
                        actions = $("<div></div>").addClass("actions");
                        hideButton = $('<a url="#"></a>')
                            .addClass("hide-button");

                        header.append(actions);

                        if (options.closeButton || timesUp) {
                            closeButton = $('<a url="#"></a>')
                                .addClass("close-button");
                            actions.append(closeButton);
                        }

                        if (!timesUp) {
                            actions.append(hideButton);
                        }

                        section.prepend(header)
                            .css({
                                "max-height": $(window.document).height(),
                                "max-width": $(window.document).width()
                            });

                        bindHeaderEventListeners();
                    }
                },

                show = function () {
                    AsyncPromise.new({
                        onAccomplish: function () {
                            modal.css("z-index", 0);

                            if (options.fadeIn) {
                                restartTransition(mask);
                                mask.css("transition", "opacity " +
                                         options.fadeIn);
                            }

                            mask.removeClass("transparent");
                            section.show();

                            visible = self;

                            removeFromMinimized.call(this);
                        }
                    }, function (_accomplish) {
                        if (readyToShow) {
                            _accomplish();
                        }
                    });
                },

                // hide = function (animation = true) {
                hide = function (animation) {
                    if (typeof animation != "boolean") {
                        animation = true;
                    }

                    section.hide();

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
                    section.hide();

                    restartTransition(mask);
                    if (options.fadeOut) {
                        mask.css("transition", "opacity " + options.fadeOut);
                    }

                    mask.addClass("transparent");
                    modal.remove(maskTransitionDuration(mask));
                    self.deleteSingleton();
                },

                observers = function (section, options) {
                    var
                        loadingContainerObserver,
                        amount = 0,

                        callback = function (img) {
                            $(img).on("load", function () {
                                amount += 1;
                            });
                        },

                        sectionObserveBlock = function () {
                            var
                                imgs = section.find("img");

                            if (imgs.some()) {
                                imgs.each(callback);

                                AsyncPromise.new({
                                    onAccomplish: function () {
                                        section.centralizeAt(window.document);
                                        if (progress ||
                                            progress === undefined) {
                                            readyToShow = true;
                                            show.call(self);
                                        }
                                    }
                                }, function (_accomplish) {
                                    if (amount == imgs.length || timesUp) {
                                        _accomplish();
                                    }
                                });
                            } else {
                                prependHeaderActions(section, options);
                                section.centralizeAt(window.document);
                                readyToShow = true;
                                if (options.complete && !progress) {
                                    options.complete.call(self);
                                }
                            }
                        },

                        mainObserveBlock = function () {
                            var
                                imgs,
                                amount = 0,

                                callback = function (img) {
                                    $(img).on("load", function () {
                                        amount += 1;
                                    });
                                };

                            loadingContainerObserver = this;
                            imgs = main.find("img");

                            if (imgs.some()) {

                                imgs.each(callback);

                                AsyncPromise.new({
                                    onAccomplish: function () {
                                        progress = false;
                                        hide.call(self, false);
                                        if (!timesUp) {
                                            section.html(main);
                                        }
                                        prependHeaderActions(section, options);
                                        section.centralizeAt(window.document);
                                        ready = true;
                                        readyToShow = true;
                                        if (instanceShowWasCalled) {
                                            show.call(self);
                                        }

                                        if (options.complete) {
                                            options.complete.call(self);
                                        }
                                    }
                                },
                                function (_accomplish) {
                                    progress = true;
                                    if (amount == imgs.length || timesUp) {
                                        _accomplish();
                                    }
                                });
                            // doesn't have imgs
                            } else {
                                progress = false;
                                hide.call(self, false);
                                if (!timesUp) {
                                    section.html(main);
                                }
                                prependHeaderActions(section, options);
                                section.centralizeAt(window.document);
                                ready = true;
                                readyToShow = true;
                            }

                            this.disconnect();
                        };

                    section.observe(sectionObserveBlock);

                    main.observe(mainObserveBlock);
                };

            resolveArguments();

            if (!(this instanceof ConstructorReference)) {
                // debugger
                // if (!ConstructorReference.instance) {
                //     return ConstructorReference.functionalSingleton(arguments);
                // } else if (isMinimized.call(ConstructorReference.instance)) {
                //     ConstructorReference.instance.show();
                // }

                instance = Flyweight.Factory.exists(ConstructorReference,
                                                    arguments);
                if (!instance) {
                    return Flyweight.Factory.new(ConstructorReference,
                                                 arguments);
                } else if (isMinimized.call(instance)) {
                    self = instance;
                    show.call(self);
                }

            } else {
                // global scope (public)

                // this.hide = function (animation = true) {
                this.hide = function (animation) {
                    if (typeof animation != "boolean") {
                        animation = true;
                    }

                    hide.call(self, animation);

                    return self;
                };

                this.show = function () {
                    show.call(self);
                    instanceShowWasCalled = true;

                    return self;
                };

                this.close = function () {
                    close.call(self);
                    return self;
                };

                this.content = function (content) {
                    var
                        node = $(content);

                    if (node.empty()) {
                        node = window.document.createTextNode(content);
                    }

                    hide.call(self, false);
                    loadingContainer.html(node);
                    return self;
                };

                create();
            }

            return self;
        }
    });

}(esPhinx, esPhinx.ui));
