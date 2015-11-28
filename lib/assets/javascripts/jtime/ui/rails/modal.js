(function ($module) {
    "use strict";

    $module.extend({
        modal: function () {
            var
                $ = jQuery,
                // passar o objeto como parâmetro
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

                // observeContent = function (wrapperModal) {
                observeContent = function () {
                    var
                        wrapperModal = $(".jtime-ui-wrapper-modal"),
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

        // $module = function () {
        // $module = function () {
        //     var
        //         self = this;
        //     debugger
            // $class.call(this);
            // return {

            // }



        // $module.modal = function () {
            // return {
            //     // url, load
            //     create: function () {
            //         var
            //             body = $("body"),
            //             args = arguments[0],
            //             wrapperModal,
            //             modalMask,
            //             modal,
            //             header,
            //             btnClose,
            //             content,
            //             observer;

            //         if ($(".jtime-ui-wrapper-modal").length === 0) {
            //             wrapperModal = $("<div></div>")
            //                 .addClass("jtime-ui-wrapper-modal");
            //             modalMask = $("<div></div>")
            //                 .addClass("jtime-ui-modal-mask basicss-fixed basicss-transparent");
            //             modal = $("<div></div>").addClass("jtime-ui-modal basicss-hidden");
            //             header = $("<div></div>").addClass("jtime-ui-modal-header");
            //             btnClose = $("<a href=\"#\"></a>")
            //                 .addClass("jtime-ui-modal-btn-close button");
            //             content = $("<div></div>").addClass("jtime-ui-modal-content");

            //             body.append(wrapperModal);

            //             wrapperModal
            //                 .append(modalMask)
            //                 .append(modal);

            //             modal
            //                 .append(header)
            //                 .css({
            //                     "max-height": $(document).height(),
            //                     "max-width": $(window).width()
            //                 });

            //             header.append(btnClose);
            //             modal.append(content);

            //             setButtonsAction(wrapperModal);

            //             if (args.url) {
            //                 binding.pry
            //                 jTime.ajax.get({
            //                     url: args.url,
            //                     readyStateChange: function (xhr) {
            //                         if (args.load) {
            //                             args.load(modal, xhr);
            //                         }
            //                     }
            //                 }).done
            //             }

            //         }
            //         // } else {
            //         //     wrapperModal = $(".jtime-ui-wrapper-modal");
            //         //     // modal = wrapperModal.find(".jtime-ui-modal");
            //         //     // content = modal.find(".jtime-ui-modal-content");
            //         //     // content.empty();
            //         // }

            //         // observeContent(wrapperModal);
            //         observeContent();

            //     },

            //     hide: function (wrapperModal) {
            //         var
            //             modalMask = wrapperModal.find(".jtime-ui-modal-mask"),
            //             modal = wrapperModal.find(".jtime-ui-modal"),
            //             time = 0;

            //         modal.hide();

            //         modalMask.replaceToggleClass("basicss-transparent", "basicss-opacity-transition");

            //         wrapperModal.css("zIndex", -1);
            //     },

            //     close: function (wrapperModal) {
            //         var
            //             modalMask = wrapperModal.find(".jtime-ui-modal-mask"),
            //             modal = wrapperModal.find(".jtime-ui-modal"),
            //             time = 0;

            //         modal.hide();

            //         modalMask.replaceToggleClass("basicss-transparent", "basicss-opacity-transition");

            //         time = parseFloat(
            //             modalMask.css("transition-duration")
            //         ) * 1000;
            //         setTimeout(function () {
            //             $(".jtime-ui-wrapper-modal").remove();
            //         }, time);
            //     }
            // }

        // };
            // this.hide = function () {}
        }
    });

})(jTime.ui);
// })(jTime);


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