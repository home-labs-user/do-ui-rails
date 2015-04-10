window.toggleTooltip = (e)->
  target = $(e.target)
  # dando problema em na hora de reconhecer o params, pois está reconhecendo como Function
  Singleton.saveState target, 'handler'
  toggle()


toggle = ->
  handler = Singleton.recover 'handler'
  # acho que é nessa linha que está dando ruim
  tooltip = handler.find(".tooltip")

  # {folowMouse: true}

  # mudar
  if tooltip.visible()
    hide()
  else
    show()


closeAll = ->
  tooltips = $(".tooltip")
  tooltips.removeClass "transition-in"


hide = ->
  handler = Singleton.recover 'handler'
  tooltip = handler.find(".tooltip")
  # antes de remover, ou mesmo inserir um classe, pegar os ms usado como parâmetro no transition e meter no interval
  tooltip.removeClass "transition-in"


show = ->
  handler = Singleton.recover 'handler'
  tooltip = handler.find(".tooltip")
  tooltip.addClass "transition-in"


window.closeAllTooltips = (e)->
  target = $(e.target)

  if !target.is(".tooltip-body") && target.children(".tooltip").length == 0
    closeAll()


  # O próximo passo é testar se o evento é do mouse. Caso seja colocar um temporizador para desaparecer caso o ponteiro esteja fora do handler
# $(document).click (e)->
  # é só multiplicar por mil lá no método
  # interval(2)
  # alert 'eee'
  # target = $(e.target)
  # if !target.is(".tooltip-body") && target.children(".tooltip").length == 0
  #   closeAll()