#= require "do/helpers/jquery"
#= require "do/helpers/string"

window.selectTabOnload = (className) ->
    list = $("nav ul.tabs")
    items = list.find "li"
    anchors = items.find "a"
    URLHash = location.hash
    hrefHash = anchors.attr("href").match /^#/
    selectedDefault = items.find("a.#{className}")

    if URLHash.isSet()
        handle = items.findByHref URLHash
        selectTab handle, className
        showContentOnload className
    else
        if hrefHash
            showContentOnload className
        else
            URLPath = location.pathname.match /[a-z\/_-]+[a-z]+/
            anchorSearch = items.findByHref URLPath

            if anchorSearch.length != 0
                selectTab anchorSearch, className
            else
                selectedDefault.removeAttr 'href'

            anchorSearch.removeAttr 'href'

showContentOnload = (className) ->
    list = $("nav ul.tabs")
    items = list.find "li"
    container = $("ul.tabs-container")

    container.find("li").hide()

    URLHash = location.hash

    if URLHash.isSet()
        handle = items.findByHref URLHash
    else
        handle = items.find "a.#{className}"

    id = handle.attr 'href'

    container.find("li#{id}").show()

    # selected = container.find("li.#{tabAnchor.attr("class")}")
    #selected = container.find("li#{tabAnchor.attr("href")}")
    # if selected.length == 0
    #   url = $(this).data("url")
    #   if url
    #     content = $("<li></li>").addClass tabAnchor.attr("class")
    #     container.append content

    #     format = $(this).data("format")
    #     if !format
    #       format = "js"

    #     $.get url, {format: format},
    #       (data, status, xhr)->
    #         if format == "html"
    #           content.html data
