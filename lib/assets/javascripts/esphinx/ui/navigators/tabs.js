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

                       showContentOnload = function (navs) {
                            var
                                id = navs.findWithoutAttr("a", "href")
                                    .attr("id"),
                                containers = navs.find(".container"),
                                container = containers.parent().find(".container#" + id);

                            containers.hide();
                            container.show();
                        },

                        showContent = function (target, container) {
                            var
                                containers = $(target).closest('ul')
                                    .find(".container");

                            containers.hide();
                            $(container).show();
                        },

                        selectNav = function (target, onload) {
                            var
                                navs,
                                selected,
                                selectOnload;

                            navs = $(target).closest("ul.tabs").find("li");

                            selected = navs
                                .findWithoutAttr("a.selector", "href");

                            if (selected.length) {
                                selected.attr("href", location.hash);
                            }

                            selected.removeClass("selected");
                            $(target).addClass("selected");
                            $(target).removeAttr("href");

                            selectOnload = navs.closest("ul.select-onload");
                            if (!onload && selectOnload.length) {
                                location.hash = $(target).attr("id");
                            }
                        },

                        selectNavOnload = function (navs) {
                            var
                                urlHash = location.hash,
                                href,
                                anchor;

                            if (urlHash) {
                                selectNav(navs.find("a" + urlHash));
                            } else {
                                href = location.pathname
                                    .match(/[a-z\/\_\-]+[a-z]+/);
                                anchor = navs.findWithoutAttr("a", "href");

                                if (anchor.length) {
                                    selectNav(anchor);
                                } else {
                                    selectNav(navs.first()
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
                                    anchor.append(nav.get(0).firstChild
                                        .textContent.trim());
                                    nav.empty();
                                    nav.append(anchor);
                                }
                                anchor.attr("id", "tab-" + (i + 1));
                                anchor.attr("class", "selector");
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

                        resolveContainers = function (containers, navs) {
                            containers.each(function (i, container) {
                                container.id = "tab-" + (i + 1);
                                container.classList.add("container");
                            });

                            showContentOnload(navs);
                        },

                        init = function (navs, containers, opts) {
                            resolveNavs(navs);

                            if (containers) {
                                if (opts) {
                                    if (opts.selectOnload) {
                                        selectNavOnload(navs);
                                    }
                                }
                                resolveContainers(containers, navs);
                            } else {
                                selectNavOnload(navs);
                            }
                        },

                        Tab = function (handler, container) {
                            this.select = function () {
                                selectNav(handler);
                                showContent(handler, container);
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

                    init(navs, containers, opts);
                    navs.find("a.selector").each(function (i, a) {
                        tabs.push({
                            // to set event
                            handler: a,
                            tab: new Tab(a, $(a).closest("li").get(0)
                                .querySelector(".container"))
                        });
                    });

                    return tabs;

                }
            }
        }
    });

}(esPhinx.ui));
