// $.fn.wideModal = ->

// params:
    // url
    // resizeByContent
window.modalBuild = function (params) {
    var
        url = null
        ,format = null
        ,body = $("body")
        ,wrapperModal = $("<div></div>").addClass("wrapper-modal transparent")
        ,modalMask = $("<div></div>").addClass("modal-mask fixed")
        ,modal = $("<div></div>").addClass("modal")
        ,header = $("<div></div>").addClass('modal-header')
        // headerActions = $("<div></div>").addClass 'modal-header-actions'
        ,btnClose = $("<a href='//'></a>").addClass('modal-btn-close')
        ,content = $("<div></div>").addClass('modal-content')
    ;

    if( params.url ) {
        url = params.url;
    }

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

    if( url ) {
        format = $(this).data("format");
    }

    if( !format ) {
        format = "js";
    }

    $.get(url, { format: format })
    .done(function (reply) {
        if( params.resizeByContent ) {
            modal.load(url, function () {
                content.load(url, function () {
                    $(this).find("img").css({
                        zoom: "reset"
                    });
                });
            });

            if( format === 'html' ) {
                content.html(reply);

                modal.centralizeOnScreen();
                wrapperModal.replaceClass("transparent", "opacity-transition");
            }
        } else {
            if( format === 'html' ) {
                content.html(reply);
            }

            modal.centralizeOnScreen();
            wrapperModal.replaceClass("transparent", "opacity-transition");
        }
    });
}

// minimize = ->
  // atribuir classe
  // colocar left: 0; bottom: 0 e mostrar só o header


// afterLoad = (url, execute)->
//   $(".modal").load url, ->
//     $(this).find(".modal-content").load url, ->
//       execute.each
          // ...

var close = function (){
    closeModal();
}

var setButtonsAction = function () {
    // $(document).keydown (e) ->
    $(document).keydown(function (e) {
        if( e.keyCode === 27 )
            close();
    });

    // $('body').on 'click', 'a.modal-btn-close', ->
    $('body').on('click', 'a.modal-btn-close', function () {
        close();
    });

    // $(".modal-mask").click ->
    //   minimize()

    // colocar ação de minimização de modal aqui
}
;