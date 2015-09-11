// possible params:
    // resizeByContent:

(function () {

    var hide = function (){
        window.hideModal();
    }

    var setButtonsAction = function () {
        $(document).keydown(function (e) {
            if( e.keyCode === 27 )
                hide();
        });

        $('body').on('click', 'a.modal-btn-close', function () {
            hide();
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
                    ,modal = $('<div></div>').addClass('modal hidden')
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
            }

            modal.centralizeOnScreen();

            if(params.load) {
                params.load(modal);
            }

            // passar o controle do modal pra o usuário e centralizar ANTES de mostrar, não depois de inserir o conteúdo. Porém, dessa forma, as dimensões do modal não deverão ser dinâmicas
            // modal.show();

            // modalMask.replaceToggleClass('transparent', 'opacity-transition');

            // var request = Ajax.get({
            //     url: url,
            //     urlParams: {
            //         format: format
            //     },
            //     readyStateChange: function(xhr) {
            //         if(params.processing) {
            //             // o modal já tem que existir nesse contexto, o usuário poderá definir um tamanho para ele para que possa usar um gif de carregamento, por exemplo
            //             params.processing(modal);
            //         }
            //         // talvez seja o caso colocar um else aqui e fazer um processamento padrão para o caso de um processing não definido
            //     }
            // });

            // request.done(function (r) {
            //     // if(params.processing) {
            //     //     // o modal já tem que existir nesse contexto, o usuário poderá definir um tamanho para ele para que possa usar um gif de carregamento, por exemplo
            //     // }
            //     content.html(r);
            //     modal.centralizeOnScreen();
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

            //         // acho que essas linhas devem ser executadas logo após saber o conteúdo para saber sua largura e então mostrar o modal
            //         wrapperModal.show();

            //         modal.centralizeOnScreen();
            //         modal.show();

            //         modalMask.replaceToggleClass('transparent', 'opacity-transition');
            //     }
            // });

        },

    }

}).call(this)
;


window.maximizeModal = function () {
    //wrapper-modal e modal ficam hide
    //trocar transparencia de wrapperModal
}

window.hideModal = function () {
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
}

// minimize = ->
  // atribuir classe
  // colocar left: 0; bottom: 0 e mostrar só o header


// afterLoad = (url, execute)->
//   $(".modal").load url, ->
//     $(this).find(".modal-content").load url, ->
//       execute.each
          // ...
