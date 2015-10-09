var jQuery = jQuery;

(function ($) {

    var
        showContentOnload = function (jqObj, params) {
            var
                parent = jqObj.closest("nav").parent(),
                items = parent.find("nav ul li"),
                container = parent.find("ul.do-ui-tabs-container"),
                URLHash = location.hash,
                handle = null,
                id = null;

            container.find("li").hide();

            if (params) {
                if (params.selectTabOnload) {
                    if (URLHash) {
                        handle = items.findAnchorByHref(URLHash);
                    }
                }
            }

            if (!handle) {
                handle = items.find("a.selected");
            }

            id = handle.attr("href");
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
        },

        selectTabOnload = function (jqObj) {
            var
                parent = jqObj.closest(".do-ui-tabs-wrapper"),
                items = parent.find("nav ul li"),
                selectedDefault = items.find("a.selected"),
                URLHash = location.hash,
                URLPath,
                anchorSearch;

            if (URLHash) {
                items.findAnchorByHref(URLHash).removeAttr("href");
            } else {
                URLPath = location.pathname.match(/[a-z\/_-]+[a-z]+/);
                anchorSearch = items.findAnchorByHref(URLPath);

                if (anchorSearch.length) {
                    selectTab(anchorSearch);
                }
                selectedDefault.removeAttr("href");
            }

        },

        showContent = function (handle) {
            var
                parentContainer = $(handle.target)
                    .closest(".do-ui-tabs-wrapper")
                        .find("ul.do-ui-tabs-container"),
                id = $(handle.target).attr("href");

            // deve trazer apenas uma linha abaixo
            parentContainer.find("li").hide();
            parentContainer.find("li" + id).show();
        },

        selectTab = function (handle) {
            var
                URLHash = location.hash,
                parent,
                toSelected,
                contentSelected;

            if (handle instanceof jQuery.Event) {
                handle = $(handle.target);
            } else {
                if (handle instanceof jQuery) {
                    handle = $(handle);
                }
            }

            parent = handle.closest("nav").parent();
            items = parent.find("nav ul li");

            if (URLHash) {
                toSelected = items.findAnchorWithoutHref();
                toSelected.attr("href", URLHash);
            } else {
                // deve trazer apenas uma linha abaixo
                contentSelected = parent.find("ul.do-ui-tabs-container li:visible")
                toSelected = parent.find("nav ul li a.selected");
                toSelected.attr("href", "#" + contentSelected.attr("id"));
            }

            items.find("a").removeClass("selected");
            handle.addClass("selected");
        };

    $.controlNavTabs = function (query, params) {
        var
            jqObj = $(query),
            parent = jqObj.closest("nav").parent();

        if (parent.find("ul.do-ui-tabs-container").length) {
            showContentOnload(jqObj, params);
        }
        if (params) {
            if (params.selectTabOnload) {
                selectTabOnload(jqObj);
            }
        }

        jqObj.click(function (e) {
            /* se via ajax, por exemplo
            /* aqui deverá vir a lógica de como carregar o conteúdo,
            */
            selectTab(e);
            showContent(e);
            location.hash = $(e.target).attr("href");
            $(e.target).removeAttr("href");
        });
    };

}(jQuery));
