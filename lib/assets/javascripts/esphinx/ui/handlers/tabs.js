// require esphinx_ui

var
    esPhinx,
    window;

(function ($module) {
    "use strict";

    $module.extend({

        handlers: {

            tabs: {

                new: function (selector, container, options) {
                    var
                        $ = esPhinx,
                        ConstructorReference = $module.handlers.tabs.new,
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
                                    .attribute("id"),
                                container = containers.parent().first()
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
                                selected.attribute("href", "#");
                            }

                            selected.removeClass("selected");
                            $(target).addClass("selected");
                            $(target).removeAttr("href");

                            selectOnload = navs.parent("ul.select-onload");
                            if (!onload && selectOnload.length) {
                                window.location
                                    .queryParam('tab', $(target).attribute("id"));
                            }
                        },

                        selectNavOnload = function (selectors) {
                            var
                                tabParam = window.location.queryParam("tab"),
                                parent = selectors.parent(),
                                href,
                                anchor;

                            if (tabParam) {
                                selectNav(parent.find("a#" + tabParam));
                            } else {
                                href = window.location.pathname
                                    .match(/[a-z\/\_\-]+[a-z]+/);

                                anchor = parent.findHasNotAttr("a", "href");

                                if (anchor.length) {
                                    selectNav(anchor);
                                } else {
                                    selectNav(selectors.asNode(), true);
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
                            } else if (tagName == "a") {
                                navs = navs.parent();
                            }

                            navs.select(function (nav, i) {
                                nav = $(nav);
                                anchor = nav.find("a");

                                if (!anchor.count()) {
                                    anchor = $("<a></a>");
                                    anchor.append(window.document
                                        .createTextNode(nav.text()));

                                    nav.text("");
                                    nav.prepend(anchor);
                                }

                                i = parseInt(i);
                                anchor.attribute("id", "tab-" + (i + 1));
                                anchor.attribute("class", "selector");
                                anchor.attribute("href", "#");
                            });

                            selectors = navs.find("a.selector");

                            if (options) {
                                if (options.selectOnload) {
                                    navs.parent("ul").addClass("select-onload");
                                }
                            } else {
                                $(selectors.asNode()).removeAttr("href");
                            }

                            return selectors;
                        },

                        resolveContainers = function (containers, navs) {
                            var
                                containerTagName = containers.tagName()
                                    .toLowerCase();

                            if (containerTagName !== "li") {
                                containers = containers.find("li");
                            }

                            containers.select(function (container, i) {
                                i = parseInt(i);
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
                            container.show();
                        },

                        map = function (navs, containers, options) {
                            var
                                tabs = [];

                            if (navs.some()) {
                                navs = resolveNavs(navs, options);
                                init(navs, containers, options);
                                navs.select(function (a, i) {
                                    tabs.push({
                                        // to set event
                                        handler: a,
                                        tab: new Tab(a, containers.parent()
                                            .find(".container#" + a.id))
                                    });
                                });

                            }

                            return tabs;

                        };

                    if (!(this instanceof ConstructorReference)) {
                        return new ConstructorReference(selector, container, options);
                    }

                    navs = selector;
                    containers = container;

                    return map(navs, containers, options);
                }

            }

        }

    });

}(esPhinx.ui));