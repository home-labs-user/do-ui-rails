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

        selectTabOnload = function (params) {
            var
                href,
                URLHash = location.hash,
                tabSelected = params.controller.parent().find("a.selected");

            if (params.selectTabOnload) {
                if (URLHash) {
                    href = URLHash;
                }
                else if (tabSelected) {
                    href = tabSelected.attr("href");
                }
                else {
                    href = location.pathname.match(/[a-z\/_-]+[a-z]+/);
                }
            }
            else if (tabSelected) {
                href = tabSelected.attr("href")
            }

            params.controller.parent().findAnchorByHref(href).removeAttr("href");
        },

        showContent = function (handle, params) {
            var
                id = $(handle.target).attr("href");

            params.container.find("li.do-ui-tabs-container-option").hide();
            params.container.find("li.do-ui-tabs-container-option" + id).show();
        },

        selectTab = function (handle, params) {
            var
                URLHash = location.hash,
                parent,
                items,
                contentSelected,
                tabSelected,
                id;

            if (handle instanceof jQuery.Event) {
                handle = $(handle.target);
            } else {
                if (handle instanceof jQuery) {
                    handle = $(handle);
                }
            }

            parent = handle.closest("ul");
            items = parent.find("li");

            contentSelected = params.container
                .find("li.do-ui-tabs-container-option:visible");
            id = contentSelected.attr("id");

            tabSelected = params.controller.parent().findAnchorWithoutHref();
            tabSelected.attr("href", "#" + id);

            items.find("a").removeClass(params.selectedTabClass);
            handle.addClass(params.selectedTabClass);
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

            params.controller.click(function (e) {
                /* se via ajax, por exemplo
                /* aqui deverá vir a lógica de como carregar o conteúdo,
                */
                selectTab(e, params);
                showContent(e, params);
                if (params.selectTabOnload) {
                    location.hash = $(e.target).attr("href");
                }
                $(e.target).removeAttr("href");
            });
        }
    };

}(jQuery));
