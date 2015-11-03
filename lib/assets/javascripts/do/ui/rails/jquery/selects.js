(function ($) {
    "use strict";

    var

        buildOpts = function (jqObj) {
            var
                wrapper = jqObj.closest(".do-ui-select"),
                select = wrapper.find("select"),
                list = wrapper.find("ul.do-ui-list"),
                options = select.find("option"),
                captionText = wrapper.find(".do-ui-caption-box .do-ui-caption-text"),
                option,
                li;

            options.each(function (i, tag) {
                option = $(tag);
                li = $("<li></li>");

                li.attr("data-value", option.attr("value"));
                li.text(option.text());
                list.append(li);

                if (option.attr("selected")) {
                    captionText.text(option.text());
                }
            });

        },

        toggleCaptionClass = function (jqObj) {
            jqObj.toggleClass("do-ui-arrow-expanded", "do-ui-arrow-retracted");
        },

        //select onclick
        setActionToSelect = function (jqObj) {

            jqObj.find("li").on("click", function () {
                var
                    wrapper = jqObj.closest(".do-ui-select"),
                    caption = wrapper.find(".do-ui-caption-box"),
                    value = $(this).data("value"),
                    select = wrapper.find("select"),
                    captionText = wrapper.find(".do-ui-caption-box .do-ui-caption-text"),
                    selected;

                // remove selection
                select.find("option:selected")
                    .attr("selected", false);

                // select
                selected = select.find("option[value='" + value + "']");
                selected.attr("selected", true);

                captionText.text(selected.text());

                // esconde opções
                wrapper.find(".do-ui-options-box").hide();

                toggleCaptionClass(caption);
            });
        },

        buildOptsWithSearch = function (jqObj) {
            var
                searchBox,
                searchTextBox,
                optionsBox,
                target,
                foundsList,
                options;

            jqObj.each(function (i, select) {
                optionsBox = $(select).closest(".do-ui-select")
                    .find(".do-ui-options-box");

                searchBox = $("<div></div>");
                searchBox.addClass("do-ui-search-box");
                searchTextBox = $("<input></input>");
                searchTextBox.attr("type", "text");
                searchBox.append(searchTextBox);

                optionsBox.prepend(searchBox);
                options = optionsBox.find("ul.do-ui-list li");

                searchTextBox.autocomplete(options, function (e, found) {
                    
                    // target
                    target = $(e.target);
                    optionsBox = target.closest(".do-ui-options-box");
                    options = optionsBox.find("ul.do-ui-list li");
                    
                    if (optionsBox.find("ul.do-ui-list-built-found").length) {
                        foundsList = optionsBox.find(".do-ui-list-built-found");
                        foundsList.empty();
                    } else {
                        foundsList = $("<ul></ul>")
                            .addClass("do-ui-list-built-found");
                        optionsBox.append(foundsList);
                    }
                    
                    if (target.val()) {
                        options.parent().hide();
                        $(found).each(function (i, li) {
                            foundsList.append(li);
                        });
                        foundsList.show();
                        
                        setActionToSelect(foundsList);

                    } else {
                        options.parent().show();
                        foundsList.hide();
                    }
                    
                });
                
            });
                

            
        };
    
    $.fn.buildOptions = function (params) {

        var
            caption,
            captionText,
            listBox,
            list,
            wrapper;

        // imitar esta parte para as abas
        $(this).each(function (i, select) {
            select = $(select);
            select.hide();
            wrapper = $("<div></div>");
            wrapper.addClass("do-ui-select");
            select.parent().append(wrapper);
            wrapper.append(select);

            caption = $("<div></div>");
            captionText = $("<div></div>");
            listBox = $("<div></div>");

            list = $("<ul></ul>");

            caption.addClass("do-ui-caption-box do-ui-arrow-retracted");
            captionText.addClass("do-ui-caption-text");
            listBox.addClass("do-ui-options-box");
            list.addClass("do-ui-list");

            wrapper.append(caption);
            caption.append(captionText);
            wrapper.append(listBox);
            listBox.append(list);

            buildOpts(list);

            // toggle
            caption.on("click", function () {
                wrapper = $(this).closest(".do-ui-select");
                wrapper.find(".do-ui-options-box").toggle();
                toggleCaptionClass($(this));
            });

            setActionToSelect(list);
        });

        if (params) {
            if (params.enableSearch) {
                buildOptsWithSearch($(this));
            }
        }

        return $(this);

    };

    // click out
    $(document).on("click", function (e) {

        var
            wrapper = $(".do-ui-select"),
            optionsBoxes = wrapper.find(".do-ui-options-box"),
            captions = wrapper.find(".do-ui-caption-box");

        if (!$(e.target).closest(".do-ui-select").length) {

            if (optionsBoxes.is(":visible")) {
                optionsBoxes.hide();
                captions.removeClass("do-ui-arrow-expanded");
            }

        }

    });

}(jQuery));
