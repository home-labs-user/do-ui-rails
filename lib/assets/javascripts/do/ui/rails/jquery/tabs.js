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
                target;
            if (handle instanceof jQuery.Event) {
                target = $(handle.target);
                if (handle.type === "click") {
                    if (params.selectOnload) {
                        location.hash = target.attr("id");
                    }
                }
            } else {
                target = handle;
            }

            tabs = target.closest("ul").find("li");

            tabSelected = tabs.findWithoutAttr("a", "href");

            if (tabSelected.length) {
                tabSelected.attr("href", location.hash);
            }

            tabs.find("a").removeClass("do-ui-tab-selected");
            target.addClass("do-ui-tab-selected");

            target.removeAttr("href");
        },

        selectOnload = function (nav) {
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
        
        tabContainerPrepare = function (params) {
            var
                items = params.container.find("li.do-ui-tabs-container-option"),
                li;
            items.each(function (i, o) {
                li = $(o);
                li.attr("data-parent-tab", "do-ui-tab-nav-" + (i + 1));
            });
        },

        showContent = function (handle, params) {
            var
                id = $(handle.target).attr("id");
            
            params.container.find("li.do-ui-tabs-container-option").hide();
            params.container.find("[data-parent-tab='" + id + "']").show();
        },

        showContentOnload = function (nav, params) {
            var
                id = nav.findWithoutAttr("a", "href").attr("id");

            params.container.find("li.do-ui-tabs-container-option").hide();
            params.container.find("[data-parent-tab='" + id + "']").show();

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

    $.fn.activateTabs = function (params) {
        var
            self = $(this),
            container;

        if (params) {
            
            tabsNavPrepare(self, params);
            if (params.selectOnload) {
                selectOnload(self);
            }

            if (params.container) {
                container = params.container;
                if (container.prop("tagName") !== "UL") {
                    container = container.closest("ul");
                    params.container = container;
                }

                container.addClass("do-ui-tabs-container");
                container.find("li").addClass("do-ui-tabs-container-option");
                tabContainerPrepare(params);
                showContentOnload(self, params);
            }
            
            self.find("a").click(function (e) {
                // se via ajax, por exemplo
                // aqui deverá vir a lógica de como carregar o conteúdo,
                selectTab(e, params);
                showContent(e, params);
            });

        }
        return self;
    };

}(jQuery));
