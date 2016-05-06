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
    Ajax,
    Constructor;

(function ($module) {
    "use strict";

    $module.extend({

        windows: {
            modal: {
                // functions are objects in js
                new: function () {
                    var
                        ModalConstructor = Constructor.get($module.windows.modal.new, arguments),
                        self = this,

                        $ = jQuery,
                        ajax = Ajax,
                        args = arguments[0],
                        body = $("body"),
                        time = 0,
                        headers = args.header || args.headers || null,
                        params = args.param || args.params || null,

                        modal,
                        mask,
                        main,
                        header,
                        actions,
                        btnClose,
                        container,
                        btnHide,

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

                            esPhinx(container[0]).observe(function () {
                                // implementar método find em esPhinx
                                imgs = main.find("img");
                                if (imgs.length) {
                                    imgs.each(function (i, img) {
                                        esPhinx(img).on("load", function () {
                                            length += 1;
                                        });
                                    });

                                    FlowControl.new({
                                        condition: function (callback) {
                                            callback(length === imgs.length);
                                        },
                                        ready: function () {
                                            main.centralizeOn($(document));
                                            self.show();
                                        }
                                    })

                                } else {
                                    main.centralizeOn($(document));
                                    self.show();
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

                            ajax.new(args.contentSource, {
                                params: params,
                                headers: headers,
                                processing: function (xhr) {
                                    if (args.loading) {
                                        args.loading(modal, xhr);
                                    }
                                },
                                success: function (answer) {
                                    body.append(modal);
                                    container.append(answer);
                                }
                            });

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
                        create();
                    }

                    // global scope (public)
                    this.close = function () {
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
