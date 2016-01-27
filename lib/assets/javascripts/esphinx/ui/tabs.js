//= require esphinx/support/jquery
//= require esphinx_ui

var
    jQuery,
    esPhinx;

(function ($module, $) {
    "use strict";

    var
        resolveTabsNav = function (nav, args) {
            var
                parent,
                tabs,
                tab,
                anchor;

            parent = nav.closest("div");
            nav.addClass("esphinx-ui-tabs-nav");

            if (args) {
                if (args.selectOnload) {
                    nav.addClass("esphinx-ui-tabs-select-in-loading");
                }
            } else {
                throw new Error("2 arguments required.");
            }

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

        // selectTab = function (handle, args) {
        selectTab = function (handle) {
            var
                tabs,
                tabSelected,
                target;

            if (handle instanceof jQuery.Event) {
                target = $(handle.target);
                if (handle.type === "click") {
                    if (target.closest("ul").is(".esphinx-ui-tabs-select-in-loading")) {
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

        // showContent = function (handle, args) {
        showContent = function (handle) {
            var
                target = $(handle.target),
                id = target.attr("id"),
                nav = target.closest("ul"),
                container = nav.siblings(".esphinx-ui-tabs-container");

            container.find("li.esphinx-ui-tabs-container-option").hide();
            container.find("[data-parent-tab='" + id + "']").show();
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


    $.fn.resolveTabs = function (args) {
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

        }

        return self;
    };

    $module.extend({
        tab: function () {

            return {
                select: function (e) {
                    selectTab(e);
                    showContent(e);
                    // showContent(e, args);
                    // selectTab(e, args);
                }
            };
        }
    });

}(esPhinx.ui, jQuery));
