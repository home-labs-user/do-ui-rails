// require esphinx_ui

var
    esPhinx;


(function ($, $module) {
    "use strict";

    $module.extend({
        handlers: {tabs: {}}
    });

    $.Extender.extend($module.handlers.tabs, true, {
        // new: function (selector, content, options) {
        new: function (data) {
            var
                navs,
                contents,
                tabs = [],
                ConstructorReference = $module.handlers.tabs.new,

                showContentOnload = function (navs, contents) {
                    var
                        id = navs.parent().findHasNotAttr("a", "href")
                            .attribute("id"),
                        content = contents.parent().first()
                            .find(".content#" + id);

                    contents.hide();
                    content.show();
                },

                checkNav = function (target, onload) {
                    var
                        navs,
                        selected,
                        selectOnload;

                    navs = $(target).parent("ul").find("li");

                    selected = navs.findHasNotAttr("a.selector", "href");

                    if (selected.length) {
                        selected.attribute("href", "#");
                    }

                    selected.removeClass("selected");
                    $(target).addClass("selected");
                    $(target).removeAttr("href");

                    selectOnload = navs.parent("ul.select-onload");
                    if (!onload && selectOnload.length) {
                        window.location.queryParameter('tab', $(target)
                                                   .attribute("id"));
                    }
                },

                checkNavOnload = function (selectors) {
                    var
                        tabParam = window.location.queryParameter("tab"),
                        parent = selectors.parent(),
                        href,
                        anchor;

                    if (tabParam) {
                        checkNav(parent.find("a#" + tabParam));
                    } else {
                        href = window.location.pathname
                            .match(/[a-z\/\_\-]+[a-z]+/);

                        anchor = parent.findHasNotAttr("a", "href");

                        if (anchor.length) {
                            checkNav(anchor);
                        } else {
                            checkNav(selectors.asNode(), true);
                        }
                    }
                },

                resolveNavs = function (navs, options) {
                    var
                        anchor,
                        selectors,
                        tagName = navs.tagName().toLowerCase(),

                        callback = function (nav, i) {
                            nav = $(nav);
                            anchor = nav.find("a");

                            if (!anchor.amount()) {
                                anchor = $("<a></a>");
                                anchor.append(window.document.createTextNode(nav
                                    .text()));

                                nav.text("");
                                nav.prepend(anchor);
                            }

                            i = parseInt(i);
                            anchor.attribute("id", "tab-" + (i + 1));
                            anchor.attribute("class", "selector");
                            anchor.attribute("href", "#");
                        };

                    if (tagName != "li" && tagName != "a") {
                        navs = navs.find("li");
                    } else if (tagName == "a") {
                        navs = navs.parent();
                    }

                    navs.each(callback);

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

                resolveContents = function (contents, navs) {
                    var
                        contentTagName = contents.tagName().toLowerCase(),

                        callback = function (content, i) {
                            i = parseInt(i);
                            content.id = "tab-" + (i + 1);
                            content.classList.add("content");
                        };

                    if (contentTagName != "li") {
                        contents = contents.find("li");
                    }

                    contents.each(callback);

                    showContentOnload(navs, contents);
                },

                init = function (navs, contents, options) {
                    if (contents) {
                        if (options) {
                            if (options.selectOnload) {
                                checkNavOnload(navs);
                            }
                        }
                        resolveContents(contents, navs);
                    } else {
                        checkNavOnload(navs);
                    }
                },

                showContent = function (target, content) {
                    var
                        contents = $(content).parent("ul")
                            .find(".content");
                    contents.hide();
                    content.show();
                },

                map = function (navs, contents, options) {
                    var
                        callback = function (a) {
                            tabs.push({
                                // to set event
                                handler: a,
                                tab: Tab.new(a, contents.parent()
                                    .find(".content#" + a.id))
                            });
                        };

                    if (navs && navs instanceof $ && navs.some()) {
                        navs = resolveNavs(navs, options);
                        init(navs, contents, options);
                        navs.each(callback);
                    }
                },

                Tab = {
                    new: function (handler, content) {

                        var
                            ConstructorReference = Tab.new;

                        if (!(this instanceof ConstructorReference)) {
                            return new ConstructorReference(handler, content);
                        }

                        this.select = function () {
                            checkNav(handler);
                            showContent(handler, content);
                        };
                    }
                };

            if (!(this instanceof ConstructorReference)) {
                return new ConstructorReference(data);
            }

            navs = data.selectors;
            contents = data.contents;

            map(navs, contents, data.options);

            this.all = function () {
                return tabs;
            };

            this.addTabs = function () {

            };

            this.replaceContent = function () {

            };

            return this;
        }
    });

}(esPhinx, esPhinx.ui));
