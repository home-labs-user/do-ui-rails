//= require ./support/jquery
//= require esphinx_ui
//= require esphinx/support/jquery
//= require esphinx/support/ajax
//= require esphinx/support/function
//= require esphinx/support/array

"use strict";

var
    jQuery,
    esPhinx,
    Singleton,
    Ajax;

(function ($module, $) {

    var
        resolveTabsNav = function (nav, args) {
            var
                parent,
                tabs,
                tab,
                anchor;

            parent = nav.closest("div");
            nav.addClass("esphinx-ui-tabs-nav");

            if (args.selectOnload) {
                nav.addClass("esphinx-tabs-select-in-loading");
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

        // selectTab = function (handle, args) {
        selectTab = function (handle) {
            var
                tabs,
                tabSelected,
                target;

            if (handle instanceof jQuery.Event) {
                target = $(handle.target);
                if (handle.type === "click") {
                    if (target.closest("ul").is(".esphinx-tabs-select-in-loading")) {
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

            // resolver container com classe no método resolvedor para não precisar manter args com essa mesma utilidade aqui
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

    $.fn.resolveTabs = function (args) {
        var
            self = $(this),
            container;

        // isso deve ser feita apenas uma vez após o carregamento da página. Mas, quais parâmetros usar para se basear?
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

            // self.find("a").click(function (e) {
            //     // se via ajax, por exemplo
            //     // aqui deverá vir a lógica de como carregar o conteúdo,
            //     selectTab(e, args);
            //     showContent(e, args);
            // });

            // selectTab(e, args);
            // showContent(e, args);
        }

        return self;
    };

    $module.extend({
        tab: function (domObj) {

            var
                self = this,

                $ = jQuery,
                args = arguments[0],

                ajax = Ajax;

            // if (!(this instanceof esPhinx.ui.tab)) {
            //     self = Singleton.instanceExists
            //         .apply(esPhinx.ui.tab, arguments.flatten());
            //     if (self) {
            //         self.select();
            //     } else {
            //         return this.tab.singleton(arguments);
            //     }
            // }

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

})(esPhinx.ui, jQuery);
