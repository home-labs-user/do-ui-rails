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
                    // const
                    //     MODULE_CSS = "esphinx ui";

                    var
                        $ = jQuery,
                        Constructor = $module.navigators.tabs.new,
                        args,
                        navs,
                        containers,
                        opts,

                        Tab = function (handler, container) {
                            this.select = function () {
                                selectNav(handler);
                                showContent(handler, container);
                            };
                        },

                       showContentOnload = function (navs, containers) {
                            var
                                id = navs.parent().findWithoutAttr("a", "href")
                                    .attr("id"),
                                container = containers.parent()
                                    .find(".container#" + id);

                            containers.hide();
                            container.show();
                        },

                        selectNav = function (target, onload) {
                            var
                                navs,
                                selected,
                                selectOnload;

                            navs = $(target).closest("ul").find("li");

                            selected = navs
                                .findWithoutAttr("a.selector", "href");

                            if (selected.length) {
                                selected.attr("href", "#");
                            }

                            selected.removeClass("selected");
                            $(target).addClass("selected");
                            $(target).removeAttr("href");

                            selectOnload = navs.closest("ul.select-onload");
                            if (!onload && selectOnload.length) {
                                // location.hash = $(target).attr("id");
                                location
                                    .queryParam('tab', $(target).attr("id"));
                            }
                        },

                        selectNavOnload = function (selectors) {
                            var
                                urlHash = location.hash,
                                parent = selectors.parent(),
                                href,
                                anchor;

                            if (urlHash) {
                                selectNav(parent.find("a" + urlHash));
                            } else {
                                href = location.pathname
                                    .match(/[a-z\/\_\-]+[a-z]+/);
                                anchor = parent.findWithoutAttr("a", "href");

                                if (anchor.length) {
                                    selectNav(anchor);
                                } else {
                                    selectNav(selectors.first(), true);
                                }
                            }
                        },

                        resolveNavs = function (navs, opts) {
                            var
                                tagName = navs.get(0).tagName.toLowerCase(),
                                anchor,
                                selectors;

                            if (tagName !== "li" && tagName !== "a") {
                                navs = navs.find("li");
                            } else if (tagName === "a") {
                                navs = navs.parent();
                            }

                            navs.each(function (i, nav) {
                                nav = $(nav);
                                anchor = nav.find("a");

                                if (!anchor.length) {
                                    anchor = $("<a></a>");
                                    anchor.append(nav.get(0).firstChild
                                        .textContent.trim());

                                    nav.get(0).firstChild.textContent = "";
                                    nav.prepend(anchor);
                                }
                                anchor.attr("id", "tab-" + (i + 1));
                                anchor.attr("class", "selector");
                                anchor.attr("href", "#");
                            });

                            selectors = navs.find("a.selector");

                            if (opts) {
                                if (opts.selectOnload) {
                                    navs.closest("ul").addClass("select-onload");
                                }
                            } else {
                                selectors.first().removeAttr("href");
                            }

                            return selectors;
                        },

                        resolveContainers = function (containers, navs) {
                            var
                                containerTagName = containers.get(0).tagName
                                    .toLowerCase();

                            if (containerTagName !== "li") {
                                containers = containers.find("li");
                            }

                            containers.each(function (i, container) {
                                container.id = "tab-" + (i + 1);
                                container.classList.add("container");
                            });

                            showContentOnload(navs, containers);
                        },

                        init = function (navs, containers, opts) {
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

                        showContent = function (target, container) {
                            var
                                containers = $(container).closest("ul")
                                    .find(".container");

                            containers.hide();
                            $(container).show();
                        },

                        map = function (navs, containers, opts) {
                            var
                                tabs = [];

                            navs = resolveNavs(navs, opts);
                            init(navs, containers, opts);
                            navs.each(function (i, a) {
                                tabs.push({
                                    // to set event
                                    handler: a,
                                    tab: new Tab(a, containers.parent().get(0).querySelector(".container#" + a.id))
                                });
                            });
                            return tabs;
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

                    return map(navs, containers, opts);
                }
            }

        }
    });

}(esPhinx.ui));
