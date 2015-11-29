(function ($module) {
    "use strict";

    // private static attrs
    var
        instance = null,
        wrapperModal = null,
        modalMask = null,
        modal = null,
        header = null,
        btnClose = null,
        content = null;

    $module.extend({
        modal: function () {

            if (!(this instanceof jTime.ui.modal)) {
                if (!instance) {
                    return instance = new jTime.ui.modal(arguments[0]);
                }
            }

            var
                self = this,
                args = arguments[0],
                $ = jQuery,
                body = $("body"),
                time = 0,

                setButtonsAction = function () {
                    $(document).keydown(function (e) {
                        if (e.keyCode === 27) {
                            self.hide();
                        }
                    });

                    btnClose.click(function (e) {
                        self.close();
                    });

                },

                observeContent = function () {
                    jTime(content[0]).observe({
                        config: {
                            childList: true
                        },
                        done: function () {
                            wrapperModal.css("zIndex", 0);
                            modalMask
                                .replaceToggleClass("basicss-transparent",
                                    "basicss-opacity-transition");
                            modal.show();

                        }
                    });
                },

                create = function () {
                    wrapperModal = $("<div></div>")
                        .addClass("jtime-ui-wrapper-modal");
                    modalMask = $("<div></div>")
                        .addClass("jtime-ui-modal-mask basicss-fixed basicss-transparent");
                    modal = $("<div></div>").addClass("jtime-ui-modal basicss-hidden");
                    header = $("<div></div>").addClass("jtime-ui-modal-header");
                    btnClose = $("<a href=\"#\"></a>")
                        .addClass("jtime-ui-modal-btn-close button");
                    content = $("<div></div>").addClass("jtime-ui-modal-content");

                    body.append(wrapperModal);

                    wrapperModal
                        .append(modalMask)
                        .append(modal);

                    modal
                        .append(header)
                        .css({
                            "max-height": $(document).height(),
                            "max-width": $(window).width()
                        });

                    header.append(btnClose);
                    modal.append(content);

                    setButtonsAction();

                    if (args.url) {
                        jTime.ajax.get({
                            url: args.url,
                            readyStateChange: function (xhr) {
                                if (args.load) {
                                    args.load(modal, xhr);
                                }
                            }
                        }).done(function (answer) {
                            content.append(answer);
                            modal.centralizeOn($(document));
                        })
                    }

                };

            if ($(".jtime-ui-wrapper-modal").length === 0) {
                create();
            }

            observeContent();

            // public
            this.close = function () {
                modal.hide();

                modalMask.replaceToggleClass("basicss-transparent", "basicss-opacity-transition");

                time = parseFloat(
                    modalMask.css("transition-duration")
                ) * 1000;
                setTimeout(function () {
                    wrapperModal.remove();
                }, time);
            }

            this.hide = function () {
                modal.hide();

                modalMask.replaceToggleClass("basicss-transparent", "basicss-opacity-transition");

                wrapperModal.css("zIndex", -1);
            }

            return self;
        }
    });

})(jTime.ui);
