(function ($ns) {
    var showContentOnload = function (className) {
        var
            list = $("nav ul.tabs")
            ,items = list.find("li")
            ,container = $("ul.tabs-container")
            ,URLHash = location.hash
            ,handle = null
            ,id = null
        ;

        container.find("li").hide();

        if( URLHash.isSet() )
            handle = items.findByHref(URLHash);
        else
            handle = items.find("a." + className);

        id = handle.attr('href');

        container.find("li" + id).show();

        // selected = container.find("li.#{tabAnchor.attr("class")}")
        // selected = container.find("li#{tabAnchor.attr("href")}")
        //  if selected.length == 0
        //    url = $(this).data("url")
        //    if url
        //      content = $("<li></li>").addClass tabAnchor.attr("class")
        //      container.append content

        //      format = $(this).data("format")
        //      if !format
        //        format = "js"

        //      $.get url, {format: format},
        //        (data, status, xhr)->
        //          if format == "html"
        //            content.html data
    };

    // var selectTabOnload = function (className) {
    var selectTabOnload = function (jqObj, selectedClassName) {
        var
            list = $("nav ul.tabs")
            ,items = list.find("li")
            ,anchors = items.find("a")
            ,URLHash = location.hash
            ,hrefHash = null
            ,selectedDefault = items.find("a." + selectedClassName)
            ,handle = null
            ,URLPath = null
            ,anchorSearch = null
        ;

        if( anchors.length > 0 ) {
            hrefHash = anchors.attr("href").match(/^#/);
        }

        // if( URLHash.isSet() ) {
        //     selectTab(jqObj, selectedClassName);
        // } else {
        //     URLPath = location.pathname.match(/[a-z\/_-]+[a-z]+/);
        //     anchorSearch = items.findByHref(URLPath);

        //     if(anchorSearch.length != 0) {
        //         selectTab(anchorSearch, selectedClassName);
        //     } else {
        //         selectedDefault.removeAttr('href');
        //     }

        //     anchorSearch.removeAttr('href');
        // }
    };

    var showContent = function (e) {
        var
            list = $("nav ul.tabs")
            ,items = list.find("li")
            ,container = $("ul.tabs-container")
            id = $(e.target).attr('href')
        ;
        container.find("li").hide()
        container.find("li" + id).show();
    };

    var selectTab = function (handle, selectedClassName) {
        var
            parent = $(handle.target).closest("ul.tabs")
            ,anchors = parent.find("a")
        ;
        anchors.removeClass(selectedClassName);
        $(handle.target).addClass(selectedClassName);
    };

    // $ns.tabs = {
    $ns.tabs = function (jqObj) {

        this.initWith = function (selectedClassName) {
            selectTabOnload(jqObj, selectedClassName);

            // verificar o href, dependendo, irá redirecionar. Caso em que essas linhas abaixo não devem ser carregadas.
            jqObj.click( function (e) {
                selectTab(e, selectedClassName);
                //aqui vem a lógica de como carregar o conteúdo, se via ajax, por exemplo
                showContent(e);
            });
        }

        return this;

    };

})(DO.ui)
;