//= require esphinx/support/jquery
//= require esphinx_ui

var
    jQuery,
    esPhinx;

(function ($module) {
    "use strict";

    $module.extend({
        navigators: {
            tabs: {
                new: function () {
                    const
                        MODULE_CSS = "esphinx-ui";

                    var
                        $ = jQuery,
                        constructor = $module.navigators.tabs.new,
                        args,
                        nav,
                        container,
                        opts,

                        selectOnload = function () {
                            var
                                URLHash = location.hash,
                                href,
                                anchor;

                            if (URLHash) {
                                selectTab(nav
                                    .findByAttr("a", "href", URLHash));
                            } else {
                                href = location.pathname
                                    .match(/[a-z\/\_\-]+[a-z]+/);
                                anchor = nav.findWithoutAttr("a", "href");
                                if (anchor.length) {
                                    selectTab(nav
                                        .findByAttr("a", "href", URLHash));
                                } else {
                                    selectTab(nav.find("a:first"));
                                }
                            }
                        },

                        showContentOnload = function () {
                            var
                                id = nav.findWithoutAttr("a", "href").attr("id");

                            container.find("li." + MODULE_CSS + "-tabs-container-option").hide();
                            container.find("[data-nav='" + id + "']").show();

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

                        showContent = function (e) {
                            var
                                target = $(e.target),
                                id = target.attr("id");

                            container.find("li." + MODULE_CSS + "-tabs-container-option").hide();
                            container.find("[data-nav='" + id + "']").show();
                        },

                        selectTab = function (handle) {
                            var
                                tabs,
                                tabSelected,
                                target;

                            if (handle instanceof jQuery.Event) {
                                target = $(handle.target);
                                if (handle.type === "click") {
                                    if (target.closest("ul")
                                        .is("." + MODULE_CSS + "-tabs-select-in-loading")) {
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

                            tabs.find("a")
                                .removeClass(MODULE_CSS + "-tab-selected");
                            target.addClass(MODULE_CSS + "-tab-selected");

                            target.removeAttr("href");
                        },

                        resolveTabsNav = function () {
                            var
                                parent,
                                tabs,
                                tab,
                                anchor;

                            parent = nav.closest("div");
                            nav.addClass(MODULE_CSS + "-tabs-nav");

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
                                anchor.attr("id", MODULE_CSS + "-tab-nav-" + (i + 1));
                                anchor.attr("href", "#" + anchor.attr("id"));
                            });

                            if (opts) {
                                if (opts.selectOnload) {
                                    nav.addClass(MODULE_CSS + "-tabs-select-in-loading");
                                }
                            } else {
                                nav.find("a:first").removeAttr("href");
                            }
                        },

                        resolveTabsContainer = function () {
                            var
                                items,
                                li;

                            if (container.prop("tagName") !== "UL") {
                                container = container.closest("ul");
                            }

                            container
                                .addClass(MODULE_CSS + "-tabs-container");
                            container.find("li").addClass(MODULE_CSS + "-tabs-container-option");

                            items = container
                                .find("li." + MODULE_CSS + "-tabs-container-option"),

                            items.each(function (i, o) {
                                li = $(o);
                                li.attr("data-nav", MODULE_CSS + "-tab-nav-" + (i + 1));
                            });

                            showContentOnload();
                        },

                        init = function () {
                            resolveTabsNav();

                            if (container) {
                                if (opts) {
                                    if (opts.selectOnload) {
                                        selectOnload();
                                    }
                                }
                                resolveTabsContainer();
                            } else {
                                selectOnload();
                            }
                        };

                    if (!(this instanceof constructor)) {
                        return new constructor(arguments);
                    } else {
                        args = arguments.flatten();
                        nav = args[0];
                        container = args[1];
                        if (args[2]) {
                            opts = args[2];
                        }

                        init();
                    }

                    this.select = function (e) {
                        selectTab(e);
                        showContent(e);
                    }
                }
            }
        }
    });

}(esPhinx.ui));
