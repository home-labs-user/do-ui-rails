var jQuery = jQuery;

(function ($) {
    "use strict";

    var
        selectTab = function (handle, params) {
            var
                parent,
                items,
                contentSelected,
                tabSelected,
                id;

            if (handle instanceof jQuery.Event) {
                handle = $(handle.target);
            } else {
                if (handle instanceof jQuery) {
                    handle = $(handle);
                }
            }

            parent = handle.closest("ul");
            items = parent.find("li");

            contentSelected = params.container
                .find("li.do-ui-tabs-container-option:visible");
            id = contentSelected.attr("id");

            tabSelected = params.navigator.parent().findAnchorWithoutHref();
            tabSelected.attr("href", "#" + id);

            items.find("a").removeClass("do-ui-tab-selected");
            handle.addClass("do-ui-tab-selected");
        },

        selectTabOnload = function (params) {
            var
                href,
                URLHash = location.hash,
                tabSelected = params.navigator.parent().find("a.selected"),
                anchor;

            href = location.pathname.match(/[a-z\/_-]+[a-z]+/);

            anchor = params.navigator.parent().findAnchorByHref(href);
            if (!anchor.length) {
                if (params.selectTabOnload) {
                    if (URLHash) {
                        href = URLHash;
                    } else if (tabSelected) {
                        href = tabSelected.attr("href");
                    }
                } else if (tabSelected) {
                    href = tabSelected.attr("href");
                }
            }

            params.navigator.parent().findAnchorByHref(href).removeAttr("href");
        },

        showContent = function (handle, params) {
            var
                id = $(handle.target).attr("href");

            params.container.find("li.do-ui-tabs-container-option").hide();
            params.container.find("li.do-ui-tabs-container-option" + id).show();
        },

        showContentOnload = function (params) {
            var
                URLHash = location.hash,
                id;

            params.container.find("li").hide();

            if (params.selectTabOnload) {
                if (URLHash) {
                    id = URLHash;
                }
            }

            if (!id) {
                id = params.navigator.parent().find("a.selected").attr("href");
            }

            params.container.find("li.do-ui-tabs-container-option" + id).show();

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

        checkNavTag = function (params) {
            var
                parent,
                nav,
                ul;

            nav = params.navigator;
            if (nav.prop("tagName") !== "NAV") {
                nav = nav.closest("nav");
                if (!nav.length) {
                    nav = nav.find("nav");
                    if (!nav.length) {
                        nav = $("<nav></nav>");
                        parent = params.navigator.closest("div");
                        parent.prepend(nav);
                        ul = parent.find("ul:first");
                        nav.append(ul);
                    }
                }
                params.navigator = nav;
            }
            nav.addClass("do-ui-tabs-nav");
            checkAnchors(params);
        },

        checkAnchors = function (params) {
            var
                nav,
                list,
                li,
                anchors,
                anchor;

            nav = params.navigator;
            anchors = nav.find("a");
            if (!anchors.length) {
                list = nav.find("li");
                list.each(function (undefined, o) {
                    li = $(o);
                    anchor = $("<a></a>");
                    anchor.append(li.text().trim());
                    li.empty();
                    li.append(anchor);

                    if (li.attr("id")) {
                        anchor.attr("href", "#" + li.attr("id"));
                    }
                    if (li.attr("class")) {
                        anchor.attr("class", li.attr("class"));
                    }
                });
            }
            params.navigator = nav.find("a");
        };

    $.tabsController = function (params) {
        var
            container;

        if (params) {

            checkNavTag(params);

            //definir classe para ul navigator por causa do css
            params.navigator.click(function (e) {
                /* se via ajax, por exemplo
                /* aqui deverá vir a lógica de como carregar o conteúdo,
                */
                selectTab(e, params);
                showContent(e, params);
                if (params.selectTabOnload) {
                    location.hash = $(e.target).attr("href");
                }
                $(e.target).removeAttr("href");
            });

            if (params.container) {
                container = params.container;
                if (container.prop("tagName") !== "UL") {
                    container = container.closest("ul");
                    params.container = container;
                }
                container.addClass("do-ui-tabs-container");
                container.find("li").addClass("do-ui-tabs-container-option");
                showContentOnload(params);
            }

            selectTabOnload(params);

        }
    };

}(jQuery));
