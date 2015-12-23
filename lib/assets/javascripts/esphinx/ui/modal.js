//= require ./support/jquery
//= require esphinx_ui
//= require esphinx/ajax
//= require esphinx/support/function
//= require esphinx/observer

(function ($module) {
    "use strict";

    // resta saber se ele se mantém para outros objetos, pois não deve se manter na criação de outros modais
    var
        wrapperModal,
        modalMask,
        modal,
        header,
        headerActions,
        btnClose,
        content,
        btnHide;

    $module.extend({
        modal: function () {

            if (!(this instanceof esPhinx.ui.modal)) {
                if (!wrapperModal) {
                    return this.modal.singleton(arguments);
                }  else {
                    (function ($) {
                        return $.modal.singleton(arguments);
                    })(this);
                }
            }
            // debugger
            // else {
            //     debugger
            //     (function ($) {
            //         // debugger
            //         // return $.call(this);
            //     })(this);
            // }

            // global scope (public)
            // runtime set
            this.close = function () {
                modal.hide();

                modalMask.replaceToggleClass("basicss-transparent", "basicss-opacity-transition");

                time = parseFloat(
                    modalMask.css("transition-duration")
                ) * 1000;
                setTimeout(function () {
                    wrapperModal.remove();
                }, time);
            };

            this.hide = function () {
                modal.hide();

                modalMask.replaceToggleClass("basicss-transparent", "basicss-opacity-transition");

                wrapperModal.css("zIndex", -1);

            };

            this.show = function () {
                wrapperModal.css("zIndex", 0);
                modalMask
                    .replaceToggleClass("basicss-transparent",
                        "basicss-opacity-transition");
                // debugger
                modal.show();
            };

            var
                self = this,
                $ = jQuery,
                args = arguments[0],
                body = $("body"),
                time = 0,

                // wrapperModal,
                // modalMask,
                // modal,
                // header,
                // headerActions,
                // btnClose,
                // content,
                // btnHide,

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
                    esPhinx(content[0]).observe({
                        config: {
                            childList: true
                        },
                        done: function () {
                            modal.centralizeOn($(document));
                        }
                    });
                },

                create = function () {
                    wrapperModal = $("<div></div>")
                        .addClass("esphinx-ui-wrapper-modal");
                    modalMask = $("<div></div>")
                        .addClass("esphinx-ui-modal-mask basicss-fixed" +
                            " basicss-transparent");
                    modal = $("<div></div>").addClass("esphinx-ui-modal" +
                        " basicss-hidden");
                    header = $("<div></div>")
                        .addClass("esphinx-ui-modal-header");
                    headerActions = $("<div></div>")
                        .addClass("esphinx-ui-modal-header-actions");
                    btnClose = $("<a href=\"#\"></a>")
                        .addClass("esphinx-ui-modal-btn-close button");
                    btnHide = $("<a href=\"#\"></a>")
                        .addClass("esphinx-ui-modal-btn-hide button");
                    content = $("<div></div>")
                        .addClass("esphinx-ui-modal-content");

                    body.append(wrapperModal);

                    wrapperModal
                        .append(modalMask)
                        .append(modal);

                    modal
                        .append(header)
                        .css({
                            "max-height": $(window).height(),
                            "max-width": $(document).width()
                        });

                    header.append(headerActions);

                    headerActions.append(btnClose);
                    headerActions.append(btnHide);

                    modal.append(content);

                    setButtonsAction();

                    observeContent();

                    if (args.url) {
                        esPhinx.ajax.get({
                            url: args.url,
                            readyStateChange: function (xhr) {
                                if (args.load) {
                                    args.load(modal, xhr);
                                }
                            }
                        }).done(function (answer) {
                            content.append(answer);
                            self.show();
                        });
                    }

                };

            if ($(".esphinx-ui-wrapper-modal").length === 0) {
                create();
            } else {
                self.show();
            }

            return self;
        }
    });

}(esPhinx.ui));
