var jQuery = jQuery;

(function ($) {
    "use strict";

    var
        tabNavPrepare = function (params) {
            var
                parent,
                nav,
                ul,
                li,
                anchors,
                anchor;

            nav = params.navigator;
            if (nav.prop("tagName") !== "NAV") {
                nav = nav.closest("nav");
                if (!nav.length) {
                    nav = nav.find("nav");
                    if (!nav.length) {
                        nav = $("<nav></nav>");
                        parent = params.navigator.closest("div");
                        parent.prepend(nav);
                        ul = parent.find("ul:first");
                        nav.append(ul);
                    }
                }
                params.navigator = nav;
            }
            nav.addClass("do-ui-tabs-nav");

            li = params.navigator.find("li");

            li.each(function (i, o) {
                li = $(o);
                i = i + 1;
                anchor = li.find("a");
                if (!anchor.length) {
                    anchor = $("<a></a>");
                    anchor.append(li.text().trim());
                    li.empty();
                    li.append(anchor);
                }
                anchor.attr("id", "do-ui-tab-nav-" + i);
                anchor.attr("href", "#" + anchor.attr("id"));
            });

        },

        selectTab = function (params, handle) {
            var
                parent,
                items,
                contentSelected,
                tabSelected,
                id;

            if (handle instanceof jQuery.Event) {
                handle = $(handle.target);
            }

            parent = handle.closest("ul");
            items = parent.find("li");

            tabSelected = params.navigator.findAnchorWithoutHref();

            if (tabSelected.length) {
                tabSelected.attr("href", location.hash);
            }

            items.find("a").removeClass("do-ui-tab-selected");
            handle.addClass("do-ui-tab-selected");

            handle.removeAttr("href");
            if (params.selectTabOnload) {
                location.hash = handle.attr("id");
            }
        },

        selectTabOnload = function (params) {
            var
                URLHash = location.hash,
                nav = params.navigator,
                href,
                anchor;

            // debugger
            if (URLHash) {
                selectTab(params, nav.findAnchorByHref(URLHash));
            } else {
                href = location.pathname.match(/[a-z\/_-]+[a-z]+/);
                anchor = nav.findAnchorByHref(href);
                if (anchor.length) {
                    selectTab(params, nav.findAnchorByHref(href));
                } else {
                    selectTab(params, nav.find("a:first"));
                }
            }
        },

        showContent = function (handle, params) {
            var
                id = $(handle.target).attr("href");

            params.container.find("li.do-ui-tabs-container-option").hide();
            params.container.find("li.do-ui-tabs-container-option" + id).show();
        },

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

            // basta procurar quem está sem href e selecionar
            if (!id) {
                // debugger;
                // id = params.navigator.parent().find("a.selected").attr("href");
                id = params.navigator.parent().findAnchorWithoutHref().attr("id");
            }

            // params.container.find("li.do-ui-tabs-container-option" + id).show();

            params.container.findAnchorWithoutHref().show();

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

    $.tabsController = function (params) {
        var
            container;

        if (params) {

            tabNavPrepare(params);

            if (params.selectTabOnload) {
                selectTabOnload(params);
            }

            params.navigator.click(function (e) {
                /* se via ajax, por exemplo
                /* aqui deverá vir a lógica de como carregar o conteúdo,
                */
                selectTab(params, e);
                showContent(e, params);
                // if (params.selectTabOnload) {
                //     location.hash = $(e.target).attr("href");
                // }
                // $(e.target).removeAttr("href");
            });

            // if (params.container) {
            //     container = params.container;
            //     if (container.prop("tagName") !== "UL") {
            //         container = container.closest("ul");
            //         params.container = container;
            //     }
            //     container.addClass("do-ui-tabs-container");
            //     container.find("li").addClass("do-ui-tabs-container-option");
            //     showContentOnload(params);
            // }


        }
    };

}(jQuery));
