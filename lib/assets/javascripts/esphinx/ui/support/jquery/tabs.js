//= require jquery
//= require esphinx/support/jquery

"use strict";

var
    jQuery;

(function ($) {

    var
        resolveTabsNav = function (nav, args) {
            var
                parent,
                tabs,
                tab,
                anchor;

            parent = nav.closest("div");
            nav.addClass("esphinx-ui-tabs-nav");

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
                anchor.attr("id", "esphinx-ui-tab-nav-" + (i + 1));
                anchor.attr("href", "#" + anchor.attr("id"));
            });
            if (!args.selectOnload) {
                nav.find("a:first").removeAttr("href");
            }
        },

        selectTab = function (handle, args) {
            var
                tabs,
                tabSelected,
                target;
            if (handle instanceof jQuery.Event) {
                target = $(handle.target);
                if (handle.type === "click") {
                    if (args.selectOnload) {
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

            tabs.find("a").removeClass("esphinx-ui-tab-selected");
            target.addClass("esphinx-ui-tab-selected");

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

        resolveTabsContainer = function (args) {
            var
                items = args.container
                    .find("li.esphinx-ui-tabs-container-option"),
                li;
            items.each(function (i, o) {
                li = $(o);
                li.attr("data-parent-tab", "esphinx-ui-tab-nav-" + (i + 1));
            });
        },

        showContent = function (handle, args) {
            var
                id = $(handle.target).attr("id");

            args.container.find("li.esphinx-ui-tabs-container-option").hide();
            args.container.find("[data-parent-tab='" + id + "']").show();
        },

        showContentOnload = function (nav, args) {
            var
                id = nav.findWithoutAttr("a", "href").attr("id");

            args.container.find("li.esphinx-ui-tabs-container-option").hide();
            args.container.find("[data-parent-tab='" + id + "']").show();

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

    $.prototype.buildTabs = function (args) {
        var
            self = $(this),
            container;

        if (args) {

            resolveTabsNav(self, args);
            if (args.selectOnload) {
                selectOnload(self);
            }

            if (args.container) {
                container = args.container;
                if (container.prop("tagName") !== "UL") {
                    container = container.closest("ul");
                    args.container = container;
                }

                container.addClass("esphinx-ui-tabs-container");
                container.find("li").addClass("esphinx-ui-tabs-container-option");
                resolveTabsContainer(args);
                showContentOnload(self, args);
            }

            self.find("a").click(function (e) {
                // se via ajax, por exemplo
                // aqui deverá vir a lógica de como carregar o conteúdo,
                selectTab(e, args);
                showContent(e, args);
            });

        }
        return self;
    };

})(jQuery);
