var
    $ = jQuery,
    DO = DO;

(function ($namespace) {
    "use strict";
        
    var setButtonsAction = function () {

        var
            btnClose = $("a.do-ui-modal-btn-close"),
            time;

        $(document).keydown(function (e) {

            if (e.keyCode === 27) {
                $namespace.modal.minimize();
            }
        });

        btnClose.click(function (e) {
            $namespace.modal.close();
        });

    };

    $namespace.modal = {
        create: function (params) {
            var
                body = $("body"),
                wrapperModal,
                modalMask,
                modal,
                header,
                btnClose,
                content;

            if ($(".do-ui-wrapper-modal").length < 1) {

                wrapperModal = $("<div></div>")
                    .addClass("do-ui-wrapper-modal");
                modalMask = $("<div></div>")
                    .addClass("do-ui-modal-mask basicss-fixed basicss-transparent");
                modal = $("<div></div>").addClass("do-ui-modal");
                header = $("<div></div>").addClass("do-ui-modal-header");
                btnClose = $("<a href=\"#\"></a>")
                    .addClass("do-ui-modal-btn-close button");
                content = $("<div></div>").addClass("do-ui-modal-content");

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
                wrapperModal = $(".do-ui-wrapper-modal");
                modal = wrapperModal.find(".do-ui-modal");
                modalMask = wrapperModal.find(".do-ui-modal-mask");

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
                wrapperModal = $(".do-ui-wrapper-modal"),
                modalMask = wrapperModal.find(".do-ui-modal-mask"),
                time = 0;

            $(".do-ui-modal").hide();

            modalMask.replaceToggleClass("basicss-transparent", "basicss-opacity-transition");

            time = parseFloat(
                modalMask.css("transition-duration")
            ) * 1000;
            setTimeout(function () {
                $(".do-ui-wrapper-modal").hide();
            }, time);
        },

        close: function () {
            var
                wrapperModal = $(".do-ui-wrapper-modal"),
                modalMask = wrapperModal.find(".do-ui-modal-mask"),
                time = 0;

            $(".do-ui-modal").hide();

            modalMask.replaceToggleClass("basicss-transparent", "basicss-opacity-transition");

            time = parseFloat(
                modalMask.css("transition-duration")
            ) * 1000;
            setTimeout(function () {
                $(".do-ui-wrapper-modal").remove();
            }, time);
        }

    };

}(DO.ui));


//var maximizeModal = function () {
    //do-ui-wrapper-modal e modal ficam hide
    //trocar transparencia de wrapperModal
//};

// minimize = ->
  // atribuir classe
  // colocar left: 0; bottom: 0 e mostrar só o header


// afterLoad = (url, execute)->
//   $(".modal").load url, ->
//     $(this).find(".do-ui-modal-content").load url, ->
//       execute.each
          // ...
//