// possible params:
    // resizeByContent:

(function () {

    var hide = function (){
        window.hideModal();
    }

    var setButtonsAction = function () {
        $(document).keydown(function (e) {
            if( e.keyCode === 27 )
                Modal.hide();
        });

        $('body').on('click', 'a.modal-btn-close', function () {
            Modal.hide();
        });

        // $(".modal-mask").click ->
        //   minimize()

    }

    Modal = {
        open: function (params) {
            var
                body = $('body')
                ,url = null
                ,format = null
            ;

            if( params.url ) {
                url = params.url;
            }

            if( params.format ) {
                format = params.format;
            } else {
                format = 'html';
            }

            if( $('.wrapper-modal').length < 1) {

                var
                    wrapperModal = $('<div></div>').addClass('wrapper-modal')
                    ,modalMask = $('<div></div>').addClass('modal-mask fixed transparent')
                    ,modal = $('<div></div>').addClass('modal')
                    ,header = $('<div></div>').addClass('modal-header')
                    ,btnClose = $("<a href='#'></a>").addClass('modal-btn-close button')
                    ,content = $('<div></div>').addClass('modal-content')
                ;

                body.append(wrapperModal);

                wrapperModal
                .append(modalMask)
                .append(modal);

                modal
                .append(header)
                .css({
                    'max-height': $(document).height(),
                    'max-width': $(window).width()
                });

                header.append(btnClose);
                modal.append(content);

                setButtonsAction();

            } else {
                var
                    wrapperModal = $('.wrapper-modal')
                    ,modal = wrapperModal.find('.modal')
                ;

                // se passar o objeto via callback primeiro para executar o show nesse block não funciona, porque todas as linhas de um dado bloco são executadas numa porrada só
                wrapperModal.show();
                modal.show();
            }

            // de repente pode ser executado no evento show
            modal.centralizeOnScreen();

            if(params.load) {
                params.load(modal);
            }

            // var request = Ajax.get({
            //     url: url,
            //     urlParams: {
            //         format: format
            //     },
            //     readyStateChange: function(xhr) {

            //     }
            // });

            // request.done(function (r) {
            //     if( params.resizeByContent ) {
            //         modal.load(url, function () {
            //             content.load(url, function () {
            //                 $(this).find('img').css({
            //                     zoom: 'reset'
            //                 });
            //             });
            //         });

            //         if( format === 'html' ) {
            //             content.html(r);

            //             modal.centralizeOnScreen();
            //             modalMask.replaceToggleClass('transparent', 'opacity-transition');
            //         }
            //     } else {
            //         if( format === 'html' ) {
            //             content.html(r);
            //         }

            //         wrapperModal.show();

            //         modal.centralizeOnScreen();
            //         modal.show();

            //         modalMask.replaceToggleClass('transparent', 'opacity-transition');
            //     }
            // });

        },

        hide: function () {
            var
                wrapperModal = $('.wrapper-modal')
                ,mask = wrapperModal.find('.modal-mask')
                ,time = 0
            ;

            $('.modal').hide();

            mask.replaceToggleClass('transparent', 'opacity-transition');

            time = parseFloat( mask.css('transition-duration') ) * 1000;
            setTimeout(function () {
                $('.wrapper-modal').hide();
            }, time);
        },

    }

}).call(this)
;


var maximizeModal = function () {
    //wrapper-modal e modal ficam hide
    //trocar transparencia de wrapperModal
}

// minimize = ->
  // atribuir classe
  // colocar left: 0; bottom: 0 e mostrar só o header


// afterLoad = (url, execute)->
//   $(".modal").load url, ->
//     $(this).find(".modal-content").load url, ->
//       execute.each
          // ...
