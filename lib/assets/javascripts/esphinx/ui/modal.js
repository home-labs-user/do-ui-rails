//= require ./support/jquery
//= require esphinx_ui
//= require esphinx/ajax
//= require esphinx/support/function
//= require esphinx/support/array
//= require esphinx/observer

(function ($module) {
    "use strict";

    $module.extend({
        modal: function () {

            // aparentemente o var realmente faz com que variáveis locais sejam atributos privados de classe, visto que seus valores são mantidos
            // this.domObject = this.domObject || null;

            // global scope (public)
            // runtime set
            this.close = function () {
                // o objeto deveria ser detruído da memória??
                modal.hide();

                modalMask.replaceToggleClass("basicss-transparent", "basicss-opacity-transition");

                time = parseFloat(
                    modalMask.css("transition-duration")
                ) * 1000;
                setTimeout(function () {
                    wrapperModal.remove();
                }, time);

                self.deleteSingleton();
            };

            this.hide = function () {
                modal.hide();

                modalMask.replaceToggleClass("basicss-transparent", "basicss-opacity-transition");

                wrapperModal.css("zIndex", -1);

            };

            this.show = function () {
                // debugger;
                // wrapperModal = wrapperModal || self.domObject;
                wrapperModal.css("zIndex", 0);
                modalMask
                    .replaceToggleClass("basicss-transparent",
                        "basicss-opacity-transition");

                modal.show();
            };

            var
                self = this,
                $ = jQuery,
                args = arguments[0],
                body = $("body"),
                time = 0,

                wrapperModal,
                modalMask,
                modal,
                header,
                headerActions,
                btnClose,
                content,
                btnHide,
                index,
                instance,

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

                    // self.domObject = wrapperModal;

                };

            if (!(this instanceof esPhinx.ui.modal)) {
                if (self = Singleton.instanceExists
                    .apply(esPhinx.ui.modal, arguments.flatten())) {
                    self.show();
                } else {
                    return this.modal.singleton(arguments);
                }
            } else {
                create();
            }

            return self;
        }
    });

})(esPhinx.ui);
