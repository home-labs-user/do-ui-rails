var
    $ = jQuery;

(function ($module) {
    "use strict";

    var setButtonsAction = function () {

        var
            btnClose = $("a.jtime-ui-modal-btn-close"),
            modal = $module.modal(),
            time;

        $(document).keydown(function (e) {
            if (e.keyCode === 27) {
                modal.minimize();
            }
        });

        btnClose.click(function (e) {
            modal.close();
        });

    };

    $module.modal = function () {
        return {
            create: function (params) {
                var
                    body = $("body"),
                    wrapperModal,
                    modalMask,
                    modal,
                    header,
                    btnClose,
                    content;

                if ($(".jtime-ui-wrapper-modal").length < 1) {
                    wrapperModal = $("<div></div>")
                        .addClass("jtime-ui-wrapper-modal");
                    modalMask = $("<div></div>")
                        .addClass("jtime-ui-modal-mask basicss-fixed basicss-transparent");
                    modal = $("<div></div>").addClass("jtime-ui-modal");
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
                } else {
                    wrapperModal = $(".jtime-ui-wrapper-modal");
                    modal = wrapperModal.find(".jtime-ui-modal");
                    modalMask = wrapperModal.find(".jtime-ui-modal-mask");

                    wrapperModal.show();
                    modal.show();
                }

                // todas as linhas de um bloco function são executadas
                // numa porrada só executa somente quando estiver visível
                if (wrapperModal.is(":visible")) {
                    modalMask
                        .replaceToggleClass("basicss-transparent",
                                            "basicss-opacity-transition");
                }

                modal.centralizeOn($(document));

                if (params.load) {
                    params.load(modal);
                }

            },

            minimize: function () {
                var
                    wrapperModal = $(".jtime-ui-wrapper-modal"),
                    modalMask = wrapperModal.find(".jtime-ui-modal-mask"),
                    time = 0;

                $(".jtime-ui-modal").hide();

                modalMask.replaceToggleClass("basicss-transparent", "basicss-opacity-transition");

                time = parseFloat(
                    modalMask.css("transition-duration")
                ) * 1000;
                setTimeout(function () {
                    $(".jtime-ui-wrapper-modal").hide();
                }, time);
            },

            close: function () {
                var
                    wrapperModal = $(".jtime-ui-wrapper-modal"),
                    modalMask = wrapperModal.find(".jtime-ui-modal-mask"),
                    time = 0;

                $(".jtime-ui-modal").hide();

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