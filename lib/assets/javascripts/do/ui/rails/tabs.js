var jQuery = jQuery;

(function ($) {

    var
        showContentOnload = function (jqObj, params) {
            var
                parent = jqObj.closest("nav").parent(),
                list = parent.find("nav ul"),
                items = list.find("li"),
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
                list = parent.find("nav ul"),
                items = list.find("li"),
                selectedDefault = items.find("a.selected"),
                URLHash = location.hash,
                URLPath,
                anchorSearch;

            if (URLHash) {
                list.findAnchorByHref(URLHash).removeAttr("href");
                selectTab(list.findAnchorByHref(URLHash));
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

            parentContainer.find("li").hide();
            parentContainer.find("li" + id).show();
        },

        selectTab = function (handle) {
            var
                URLHash = location.hash,
                parent,
                toSelected,
                contentSelected,
                anchors;

            if (handle instanceof jQuery.Event) {
                handle = $(handle.target);
            } else {
                if (handle instanceof jQuery) {
                    handle = $(handle);
                }
            }

            parent = handle.closest("nav").parent();
            anchors = parent.find("a");

            toSelected = parent.find("nav ul li a.selected");
            if (URLHash) {
                // toSelected = parent.find("nav ul li a.selected");
                toSelected.attr("href", URLHash);
            } else {
                // if () {
                //     tabSelected = parent.find("nav ul li a.selected");
                // }
                // testar o que tá com selected. Mas o problema está AQUI!!!
                contentSelected = parent
                    .find("ul.do-ui-tabs-container li:visible");
                toSelected.attr("href", "#" + contentSelected.attr("id"));
            }

            anchors.removeClass("selected");
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
