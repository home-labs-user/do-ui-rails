// require esphinx/support/jquery
// require esphinx_ui

"use strict";

var
    jQuery,
    esPhinx;

(function ($module) {

    $module.extend({
        navigators: {
            tabs: {
                new: function () {
                    const
                        MODULE_CSS = "esphinx-ui";

                    var
                        $ = jQuery,
                        Constructor = $module.navigators.tabs.new,
                        args,
                        navs,
                        containers,
                        opts,
                        tabs = [],

                        showContentOnload = function () {
                            var
                                id = nav.findWithoutAttr("a", "href").attr("id");

                            container.find("li." + MODULE_CSS + "-tabs-container-option").hide();
                            container.find("[data-nav='" + id + "']").show();
                        },

                        showContent = function (e) {
                            var
                                target = $(e.target),
                                id = target.attr("id");

                            container.find("li." + MODULE_CSS + "-tabs-container-option").hide();
                            container.find("[data-nav='" + id + "']").show();
                        },

                        // resolveTabs = function () {
                        //     var
                        //         parent,
                        //         tabs,
                        //         tab,
                        //         anchor;

                        //     parent = nav.closest("div");
                        //     nav.addClass(MODULE_CSS + "-tabs-nav");

                        //     tabs = nav.find("li");
                        //     tabs.each(function (i, o) {
                        //         tab = $(o);
                        //         anchor = tab.find("a");
                        //         if (!anchor.length) {
                        //             anchor = $("<a></a>");
                        //             anchor.append(tab.text().trim());
                        //             tab.empty();
                        //             tab.append(anchor);
                        //         }
                        //         anchor.attr("id", MODULE_CSS + "-tab-nav-" + (i + 1));
                        //         anchor.attr("href", "#" + anchor.attr("id"));
                        //         // anchor.attr("href", "javascript:void(0)");
                        //     });

                        //     if (opts) {
                        //         if (opts.selectOnload) {
                        //             nav.addClass(MODULE_CSS + "-tabs-select-in-loading");
                        //         }
                        //     } else {
                        //         nav.find("a:first").removeAttr("href");
                        //     }
                        // },

                        selectTab = function (target, onload) {
                            var
                                navs,
                                selected,
                                selectOnload;

                            navs = target.closest("ul.tabs").find("li");

                            selectOnload = navs.closest("ul.select-onload");

                            selected = navs
                                .findWithoutAttr("a.selector", "href");

                            if (selected.length) {
                                selected.attr("href", location.hash);
                            }

                            selected.removeClass("selected");
                            target.addClass("selected");
                            target.removeAttr("href");

                            if (!onload && selectOnload.length) {
                                location.hash = target.attr("id");
                            }
                        },

                        selectOnload = function (navs) {
                            var
                                urlHash = location.hash,
                                href,
                                anchor;

                            if (urlHash) {
                                selectTab(navs.find("a" + urlHash), true);
                            } else {
                                href = location.pathname
                                    .match(/[a-z\/\_\-]+[a-z]+/);
                                anchor = navs.findWithoutAttr("a", "href");

                                if (anchor.length) {
                                    selectTab(nav
                                        .findByAttr("a", "href", href), true);
                                } else {
                                    selectTab(navs.first()
                                        .find("a#tab-1"), true);
                                }
                            }
                        },

                        resolveNavs = function (navs) {
                            var
                                tab,
                                anchor,

                                nav;

                            navs.each(function (i, nav) {
                                nav = $(nav);
                                anchor = nav.find("a");

                                if (!anchor.length) {
                                    anchor = $("<a></a>");
                                    anchor.append(nav.text().trim());
                                    nav.empty();
                                    nav.append(anchor);
                                }
                                anchor.attr("id", "tab-" + (i + 1));
                                anchor.attr("class", "selector");
                                // anchor.attr("href", "#" + anchor.attr("id"));
                                anchor.attr("href", "javascript:void(0)");
                            });

                            if (opts) {
                                if (opts.selectOnload) {
                                    navs.closest("ul").addClass("select-onload");
                                }
                            } else {
                                navs.first().find("a#tab-1")
                                    .removeAttr("href");
                            }
                        },

                        resolveContainers = function (containers) {
                            containers.each(function (i, container) {
                                container.id = "tab-" + (i + 1);
                            });

                            // showContentOnload();
                        },

                        init = function (navs, containers, opts) {
                            resolveNavs(navs);

                            if (containers) {
                                if (opts) {
                                    if (opts.selectOnload) {
                                        selectOnload(navs);
                                    }
                                }
                                resolveContainers(containers);
                            } else {
                                selectOnload(navs);
                            }
                        },

                        // resolveClass = function (className) {
                        //     return "." + className.replace(/ /, ".");
                        // },

                        Tab = function (handler, container) {

                            // o método para resolver os lis deve ser chamado aqui
                            // this.select = function (e) {
                            this.select = function () {
                                selectTab($(handler).find("a.selector"));
                                // showContent();
                            };
                        };

                    if (!(this instanceof Constructor)) {
                        return new Constructor(arguments);
                    }

                    args = arguments.flatten();
                    navs = args[0];
                    containers = args[1];
                    if (args[2]) {
                        opts = args[2];
                    }

                    // ainda deve ter o resolve, para resolver id, pois ainda deve ser enumerado, etc...
                    // resolveContainers(containers);
                    init(navs, containers, opts);
                    navs.each(function (i, li) {
                        tabs.push({
                            // to set event
                            handler: li,
                            tab: new Tab(li, li
                                .querySelector("#tab-" + (i + 1)))
                        });
                    });

                    return tabs;

                }
            }
        }
    });

}(esPhinx.ui));
