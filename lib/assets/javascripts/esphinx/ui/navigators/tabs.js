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

                new: function (selector, container, options) {
                    var
                        $ = esPhinx,
                        Constructor = $module.navigators.tabs.new,
                        args,
                        navs,
                        containers,

                        Tab = function (handler, container) {
                            this.select = function () {
                                selectNav(handler);
                                showContent(handler, container);
                            };
                        },

                       showContentOnload = function (navs, containers) {
                            var
                                id = navs.parent().findHasNotAttr("a", "href")
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

                            navs = $(target).parent("ul").find("li");

                            selected = navs
                                .findHasNotAttr("a.selector", "href");

                            if (selected.length) {
                                selected.attr("href", "#");
                            }

                            selected.removeClass("selected");
                            $(target).addClass("selected");
                            $(target).removeAttr("href");

                            selectOnload = navs.parent("ul.select-onload");
                            if (!onload && selectOnload.length) {
                                location
                                    .queryParam('tab', $(target).attr("id"));
                            }
                        },

                        selectNavOnload = function (selectors) {
                            var
                                tabParam = location.queryParam("tab"),
                                parent = selectors.parent(),
                                href,
                                anchor;

                            if (tabParam) {
                                selectNav(parent.find("a#" + tabParam));
                            } else {
                                href = location.pathname
                                    .match(/[a-z\/\_\-]+[a-z]+/);

                                anchor = parent.findHasNotAttr("a", "href");

                                if (anchor.length) {
                                    selectNav(anchor);
                                } else {
                                    selectNav(selectors.first(), true);
                                }
                            }
                        },

                        resolveNavs = function (navs, options) {
                            var
                                tagName = navs.tagName().toLowerCase(),
                                anchor,
                                selectors;

                            if (tagName !== "li" && tagName !== "a") {
                                navs = navs.find("li");
                            } else if (tagName === "a") {
                                navs = navs.parent();
                            }

                            navs.each(function (nav, i) {
                                nav = $(nav);
                                anchor = nav.find("a");

                                if (!anchor.length) {
                                    anchor = $("<a></a>");
                                    anchor.append(nav.first().firstChild
                                        .textContent.trim());

                                    // $(nav.first().firstChild).text("");
                                    nav.first().firstChild.textContent = "";
                                    nav.prepend(anchor);
                                }

                                anchor.attr("id", "tab-" + (i + 1));
                                anchor.attr("class", "selector");
                                anchor.attr("href", "#");
                            });

                            selectors = navs.find("a.selector");

                            if (options) {
                                if (options.selectOnload) {
                                    navs.parent("ul").addClass("select-onload");
                                }
                            } else {
                                $(selectors.first()).removeAttr("href");
                            }

                            return selectors;
                        },

                        resolveContainers = function (containers, navs) {
                            var
                                containerTagName = containers.first().tagName
                                    .toLowerCase();

                            if (containerTagName !== "li") {
                                containers = containers.find("li");
                            }

                            containers.each(function (container, i) {
                                container.id = "tab-" + (i + 1);
                                container.classList.add("container");
                            });

                            showContentOnload(navs, containers);
                        },

                        init = function (navs, containers, options) {
                            if (containers) {
                                if (options) {
                                    if (options.selectOnload) {
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
                                containers = $(container).parent("ul")
                                    .find(".container");

                            containers.hide();
                            $(container).show();
                        },

                        map = function (navs, containers, options) {
                            var
                                tabs = [];

                            navs = resolveNavs(navs, options);
                            init(navs, containers, options);
                            navs.each(function (a, i) {
                                tabs.push({
                                    // to set event
                                    handler: a,
                                    tab: new Tab(a, containers.parent().first().querySelector(".container#" + a.id))
                                });
                            });

                            return tabs;
                        };

                    if (!(this instanceof Constructor)) {
                        return new Constructor(selector, container, options);
                    }

                    navs = selector;
                    containers = container;

                    return map(navs, containers, options);
                }

            }

        }

    });

}(esPhinx.ui));
