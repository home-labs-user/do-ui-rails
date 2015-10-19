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
                anchor = li.find("a");
                if (!anchor.length) {
                    anchor = $("<a></a>");
                    anchor.append(li.text().trim());
                    li.empty();
                    li.append(anchor);
                }
                anchor.attr("id", "do-ui-tab-nav-" + (i + 1));
                anchor.attr("href", "#" + anchor.attr("id"));
            });

            if (!params.selectTabOnload) {
                nav.find("a:first").removeAttr("href");
            }

        },

        selectTab = function (handle, params) {
            var
                items,
                tabSelected,
                nav,
                eventType;

            if (handle instanceof jQuery.Event) {
                handle = $(handle.target);
                nav = handle.closest("nav");
                eventType = "click";
            } else {
                nav = handle;
            }

            items = nav.find("ul li");

            tabSelected = items.findAnchorWithoutHref();

            if (tabSelected.length) {
                tabSelected.attr("href", location.hash);
            }

            items.find("a").removeClass("do-ui-tab-selected");
            handle.addClass("do-ui-tab-selected");

            handle.removeAttr("href");
            if (eventType === "click") {
                if (params.selectTabOnload) {
                    location.hash = handle.attr("id");
                }
            }
        },

        selectTabOnload = function (params) {
            var
                URLHash = location.hash,
                nav = params.navigator,
                href,
                anchor;

            if (URLHash) {
                selectTab(nav.findAnchorByHref(URLHash));
            } else {
                href = location.pathname.match(/[a-z\/_-]+[a-z]+/);
                anchor = nav.findAnchorByHref(href);
                if (anchor.length) {
                    selectTab(nav.findAnchorByHref(href));
                } else {
                    selectTab(nav.find("a:first"));
                }
            }
        },

        showContent = function (handle, params) {
            var
                id = $(handle.target).attr("id");

            params.container.find("li.do-ui-tabs-container-option").hide();
            params.container
                .find("li.do-ui-tabs-container-option#" + id).show();
        },

        showContentOnload = function (params) {
            var
                tabSelected;

            params.container.find("li.do-ui-tabs-container-option").hide();
            tabSelected = params.navigator.parent().findAnchorWithoutHref();

            params.container.find("li#" + tabSelected.attr("id")).show();

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

        tabContainerPrepare = function (params) {
            var
                items = params.container.find("li.do-ui-tabs-container-option"),
                li;
            items.each(function (i, o) {
                li = $(o);
                li.attr("id", "do-ui-tab-nav-" + (i + 1));
            });
        };

    $.tabsController = function (params) {
        var
            container;

        if (params) {

            tabNavPrepare(params);

            if (params.selectTabOnload) {
                selectTabOnload(params);
            }

            params.navigator.find("a").click(function (e) {
                /* se via ajax, por exemplo
                /* aqui deverá vir a lógica de como carregar o conteúdo,
                */
                selectTab(e, params);
                showContent(e, params);
            });

            if (params.container) {
                container = params.container;
                if (container.prop("tagName") !== "UL") {
                    container = container.closest("ul");
                    params.container = container;
                }

                container.addClass("do-ui-tabs-container");
                container.find("li").addClass("do-ui-tabs-container-option");
                tabContainerPrepare(params);
                showContentOnload(params);
            }

        }
    };

}(jQuery));
