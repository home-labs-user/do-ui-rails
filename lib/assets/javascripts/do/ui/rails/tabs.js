var jQuery = jQuery;

(function ($) {
    "use strict";

    var
        tabsNavPrepare = function (nav, params) {
            var
                parent,
                tabs,
                tab,
                anchor;

            parent = nav.closest("div");
            nav.addClass("do-ui-tabs-nav");

            tabs = nav.find("li");
            tabs.each(function (i, o) {
                tab = $(o);
                anchor = tab.find("a");
                if (!anchor.length) {
                    anchor = $("<a></a>");
                    anchor.append(tab.text().trim());
                    tab.empty();
                    tab.append(anchor);
                }
                anchor.attr("id", "do-ui-tab-nav-" + (i + 1));
                anchor.attr("href", "#" + anchor.attr("id"));
            });
            if (!params.selectOnload) {
                nav.find("a:first").removeAttr("href");
            }
        },

        selectTab = function (handle, params) {
            var
                tabs,
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

            tabs = nav.closest("li");

            // tabSelected = tabs.findAnchorWithoutHref();
            tabSelected = tabs.findWithoutAttr("a", "href");

            if (tabSelected.length) {
                tabSelected.attr("href", location.hash);
            }

            tabs.find("a").removeClass("do-ui-tab-selected");
            handle.addClass("do-ui-tab-selected");

            handle.removeAttr("href");
            if (eventType === "click") {
                if (params.selectOnload) {
                    location.hash = handle.attr("id");
                }
            }
        },

        selectOnload = function (nav, params) {
            var
                URLHash = location.hash,
                href,
                anchor;

            if (URLHash) {
                selectTab(nav.findByAttr("a", "href", URLHash));
            } else {
                href = location.pathname.match(/[a-z\/\_\-]+[a-z]+/);
                anchor = nav.findWithoutAttr("a", "href");
                if (anchor.length) {
                    selectTab(nav.findByAttr("a", "href", URLHash));
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
            tabSelected = params.navigator.parent().findWithoutAttr("a", "href");

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

    $.fn.activateTabs = function (params) {
        var
            self = $(this),
            container;

        if (params) {
            
            tabsNavPrepare($(this), params);
            if (params.selectOnload) {
                selectOnload($(this), params);
            }

            /*params.navigator.find("a").click(function (e) {
                // se via ajax, por exemplo
                // aqui deverá vir a lógica de como carregar o conteúdo,
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
            }*/

        }
    };

}(jQuery));
