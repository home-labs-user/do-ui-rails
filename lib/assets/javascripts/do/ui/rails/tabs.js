var jQuery = jQuery;

(function ($) {

    var
        showContentOnload = function (params) {
            var
                URLHash = location.hash,
                id;

            params.container.find("li").hide();

            if (params.selectTabOnload) {
                if (URLHash) {
                    id = URLHash;
                }
            }

            if (!id) {
                id = params.controller.parent().find("a.selected").attr("href");
            }

            params.container.find("li.do-ui-tabs-container-option" + id).show();

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

        selectTab = function (handle, params) {
            var
                URLHash = location.hash,
                parent,
                items,
                tabSelected,
                contentSelected;

            if (handle instanceof jQuery.Event) {
                handle = $(handle.target);
            } else {
                if (handle instanceof jQuery) {
                    handle = $(handle);
                }
            }

            parent = handle.closest("ul");
            items = parent.find("li");

            tabSelected = items.find("a." + params.selectedTabClass);

            if (URLHash) {
                tabSelected = items.findAnchorWithoutHref();
                tabSelected.attr("href", URLHash);
            } else {
                contentSelected = $(params.container)
                    .find(params.container.find("li:visible"));
                tabSelected.attr("href", "#" + contentSelected.attr("id"));
            }

            items.find("a").removeClass(params.selectedTabClass);
            handle.addClass(params.selectedTabClass);
        },

        selectTabOnload = function (params) {
            var
                parent = params.controller.closest("ul"),
                items = parent.find("li"),
                selectedDefault = items.find("a." + params.selectedTabClass),
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

        showContent = function (handle, params) {
            var
                id = $(handle.target).attr("href");

            params.container.find("li.do-ui-tabs-container-option").hide();
            params.container.find("li.do-ui-tabs-container-option" + id).show();
        };

    $.tabsController = function (params) {
        var
            anchor;

        if (params) {
            // creates anchor
            if (params.controller.prop("tagName") !== "A") {
                params.controller.each(function (i, o) {
                    anchor = $("<a></a>");
                    $(o).append(anchor);
                    if ($(o).attr("id")) {
                        anchor.attr("href", $(o).attr("id"));
                    }
                    if ($(o).attr("class")) {
                        anchor.attr("class", $(o).attr("class"));
                    }
                });
            }

            if (params.container) {
                params.container.addClass("do-ui-tabs-container");
                params.container.find("li").addClass("do-ui-tabs-container-option");
                showContentOnload(params);
            }

            selectTabOnload(params);

            // if (params.selectTabOnload) {

            params.controller.click(function (e) {
                /* se via ajax, por exemplo
                /* aqui deverá vir a lógica de como carregar o conteúdo,
                */
                selectTab(e, params);
                showContent(e, params);
                location.hash = $(e.target).attr("href");
                $(e.target).removeAttr("href");
            });
            // }

        }

        // if (parent.find("ul.do-ui-tabs-container").length) {
        //     showContentOnload(jqObj, params);
        // }

        // jqObj.click(function (e) {
        //     /* se via ajax, por exemplo
        //     /* aqui deverá vir a lógica de como carregar o conteúdo,
        //     */
        //     showContent(e);
        // });
    };

}(jQuery));
