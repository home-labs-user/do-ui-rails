var jQuery = jQuery;

(function ($) {

    var
        showContentOnload = function (jqObj, params) {
            var
                parent = jqObj.closest("nav").parent(),
                list = parent.find("nav ul"),
                items = list.find("li"),
                container = parent.find("ul.do-ui-tabs-container"),
                URLHash = location.hash,
                handle = null,
                id = null;

            container.find("li").hide();

            if (params) {
                if (params.selectTabOnload) {
                    if (URLHash) {
                        handle = items.findAnchorByHref(URLHash);
                    }
                }
            }

            if (!handle) {
                handle = items.find("a.selected");
            }

            id = handle.attr("href");
            container.find("li" + id).show();

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

        selectTabOnload = function (jqObj) {
            var
                parent = jqObj.closest(".do-ui-tabs-wrapper"),
                list = parent.find("nav ul"),
                items = list.find("li"),
                selectedDefault = items.find("a.selected"),
                URLHash = location.hash,
                URLPath,
                anchorSearch;

            if (URLHash) {
                selectTab(list.findAnchorByHref(URLHash));
            } else {
                URLPath = location.pathname.match(/[a-z\/_-]+[a-z]+/);
                anchorSearch = items.findAnchorByHref(URLPath);

                if (anchorSearch.length) {
                    selectTab(anchorSearch);
                }
                // else {
                //     // testar se o href possui #, possuindo não deveria ser removido, pela lógica de carregaemento de conteúdo via ajax
                //     // if () {
                //     //     selectedDefault.removeAttr("href");
                //     // }
                // }

                selectedDefault.removeAttr("href");
                anchorSearch.removeAttr("href");
            }
        },

        showContent = function (handle) {
            var
                parentContainer = $(handle.target)
                    .closest(".do-ui-tabs-wrapper")
                        .find("ul.do-ui-tabs-container"),
                id = $(handle.target).attr("href");

            parentContainer.find("li").hide();
            parentContainer.find("li" + id).show();
        },

        selectTab = function (handle) {
            var
                URLHash = location.hash,
                parent,
                tabSelected,
                contentSelected,
                anchors;

            if (handle instanceof jQuery.Event) {
                handle = $(handle.target);
            } else {
                if (handle instanceof jQuery) {
                    handle = $(handle);
                }
            }

            parent = handle.closest("nav").parent();
            anchors = parent.find("a");
            tabSelected = parent.find("nav ul li a.selected");

            if (URLHash) {
                tabSelected.attr("href", URLHash);
            } else {
                contentSelected = parent.find("ul.do-ui-tabs-container li:visible");
                tabSelected.attr("href", "#" + contentSelected.attr("id"));
            }

            anchors.removeClass("selected");
            handle.addClass("selected");
        };

    $.controlNavTabs = function (query, params) {
        var
            jqObj = $(query),
            parent = jqObj.closest("nav").parent();

        if (parent.find("ul.do-ui-tabs-container").length) {
            showContentOnload(jqObj, params);
        }

        if (params) {
            if (params.selectTabOnload) {
                selectTabOnload(jqObj);
            }
        }

        jqObj.click(function (e) {
            selectTab(e);

            //aqui deverá vir a lógica de como carregar o conteúdo,
            // se via ajax, por exemplo
            showContent(e);
        });
    };

}(jQuery));
