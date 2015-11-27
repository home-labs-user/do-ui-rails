(function ($module) {
    "use strict";

    var
        $ = jQuery,
        setButtonsAction = function (wrapperModal) {

            var
                btnClose = $("a.jtime-ui-modal-btn-close"),
                modal = $module.modal();

            $(document).keydown(function (e) {
                if (e.keyCode === 27) {
                    modal.hide(wrapperModal);
                }
            });

            btnClose.click(function (e) {
                modal.close(wrapperModal);
            });

        },

        observeContent = function (wrapperModal) {
            var
                modalMask = wrapperModal.find(".jtime-ui-modal-mask"),
                modal = wrapperModal.find(".jtime-ui-modal"),
                target = modal.find(".jtime-ui-modal-content"),
                time = 0;

            jTime(target[0]).observe({
                config: {
                    childList: true
                },
                done: function () {
                    wrapperModal.css("zIndex", 0);
                    modalMask
                        .replaceToggleClass("basicss-transparent",
                            "basicss-opacity-transition");
                    modal.centralizeOn($(document));
                    modal.show();

                }
            });
        };

    $module.modal = function () {
        return {
            // url, load
            create: function (args) {
                var
                    body = $("body"),
                    wrapperModal,
                    modalMask,
                    modal,
                    header,
                    btnClose,
                    content,
                    observer;

                if ($(".jtime-ui-wrapper-modal").length === 0) {
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

                    setButtonsAction(wrapperModal);
                } else {
                    wrapperModal = $(".jtime-ui-wrapper-modal");
                    modal = wrapperModal.find(".jtime-ui-modal");
                    content = modal.find(".jtime-ui-modal-content");
                    content.empty();
                }

                // callback
                if (args.load) {
                    args.load(wrapperModal);
                }

                observeContent(wrapperModal);

            },

            hide: function (wrapperModal) {
                var
                    modalMask = wrapperModal.find(".jtime-ui-modal-mask"),
                    modal = wrapperModal.find(".jtime-ui-modal"),
                    time = 0;

                modal.hide();

                modalMask.replaceToggleClass("basicss-transparent", "basicss-opacity-transition");

                wrapperModal.css("zIndex", -1);
            },

            close: function (wrapperModal) {
                var
                    modalMask = wrapperModal.find(".jtime-ui-modal-mask"),
                    modal = wrapperModal.find(".jtime-ui-modal"),
                    time = 0;

                modal.hide();

                modalMask.replaceToggleClass("basicss-transparent", "basicss-opacity-transition");

                time = parseFloat(
                    modalMask.css("transition-duration")
                ) * 1000;
                setTimeout(function () {
                    $(".jtime-ui-wrapper-modal").remove();
                }, time);
            }
        }

    };

})(jTime.ui);


//var maximizeModal = function () {
    //jtime-ui-wrapper-modal e modal ficam hide
    //trocar transparencia de wrapperModal
//};

// minimize = ->
  // atribuir classe
  // colocar left: 0; bottom: 0 e mostrar só o header


// afterLoad = (url, execute)->
//   $(".modal").load url, ->
//     $(this).find(".jtime-ui-modal-content").load url, ->
//       execute.each
          // ...
//