$.fn.wideModal = ->
    handler = $(this)
    body = $("body")
    wrapperModal = $("<div></div>").addClass "wrapper-modal transparent"
    modalMask = $("<div></div>").addClass "modal-mask fixed"
    modal = $("<div></div>").addClass("modal")
    header = $("<div></div>").addClass 'modal-header'
    # headerActions = $("<div></div>").addClass 'modal-header-actions'
    btnClose = $("<a href='#'></a>").addClass 'modal-btn-close'
    content = $("<div></div>").addClass 'modal-content'

    body
        .append wrapperModal

    wrapperModal
        .append modalMask
        .append modal

    modal
        .append header

        .css
            "max-height": $(document).height()
            "max-width": $(window).width()

    header
        .append btnClose

    modal
        .append content

    loadActions()

    url = params.url;

    if url
        format = $(this).data("format")

    if !format
        format = "js"

    fn = $.get(url, { format: format })

    fn
    .done (reply)->
        if handler.data("resize-by-img")
            modal.load url, ->
                content.load url, ->
                    $(this).find("img").css
                        zoom: "reset"

            if format == 'html'
                content.html reply

                modal.centralizeOnScreen()
                wrapperModal.replaceClass "transparent", "opacity-transition"

        else
            if format == 'html'
                content.html reply

            modal.centralizeOnScreen()
            wrapperModal.replaceClass "transparent", "opacity-transition"


# minimize = ->
  # atribuir classe
  # colocar left: 0; bottom: 0 e mostrar só o header


# afterLoad = (url, execute)->
#   $(".modal").load url, ->
#     $(this).find(".modal-content").load url, ->
#       execute.each
          # ...


close = ->
    closeModal()


loadActions = ->
    $(document).keydown (e) ->
        if e.keyCode == 27
            close()

    $('body').on 'click', 'a.modal-btn-close', ->
        close()

    # $(".modal-mask").click ->
    #   minimize()

    # colocar ação de minimização de modal aqui
