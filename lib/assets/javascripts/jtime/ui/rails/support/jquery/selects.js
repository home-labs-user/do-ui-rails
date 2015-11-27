(function ($) {
    "use strict";

    $.fn.buildOptions = function (args) {

        var
            caption,
            captionText,
            listBox,
            list,
            wrapper,
            select,
            options,
            option,
            li,
            value,
            selected,
            optionsBox,
            searchBox,
            searchTextBox,
            target,
            foundsList,
            optionsBoxes,
            captions,

            buildOpts = function (jqObj) {
                wrapper = jqObj.closest(".jtime-ui-select");
                select = wrapper.find("select");
                list = wrapper.find("ul.jtime-ui-list");
                options = select.find("option");
                captionText = wrapper.find(".jtime-ui-caption-box .jtime-ui-caption-text");

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
                jqObj.toggleClass("jtime-ui-arrow-expanded", "jtime-ui-arrow-retracted");
            },

            //select onclick
            setActionToSelect = function (jqObj) {

                jqObj.find("li").on("click", function () {
                    wrapper = jqObj.closest(".jtime-ui-select");
                    caption = wrapper.find(".jtime-ui-caption-box");
                    value = $(this).data("value");
                    select = wrapper.find("select");
                    captionText = wrapper.find(".jtime-ui-caption-box .jtime-ui-caption-text");

                    // remove selection
                    select.find("option:selected")
                        .attr("selected", false);

                    // select
                    selected = select.find("option[value='" + value + "']");
                    selected.attr("selected", true);

                    captionText.text(selected.text());

                    // esconde opções
                    wrapper.find(".jtime-ui-options-box").hide();

                    toggleCaptionClass(caption);
                });
            },

            buildOptsWithSearch = function (jqObj) {

                jqObj.each(function (i, select) {
                    optionsBox = $(select).closest(".jtime-ui-select")
                        .find(".jtime-ui-options-box");

                    searchBox = $("<div></div>");
                    searchBox.addClass("jtime-ui-search-box");
                    searchTextBox = $("<input></input>");
                    searchTextBox.attr("type", "text");
                    searchBox.append(searchTextBox);

                    optionsBox.prepend(searchBox);
                    options = optionsBox.find("ul.jtime-ui-list li");

                    searchTextBox.autocomplete(options, args.search, function (e, found) {

                        // target
                        target = $(e.target);
                        optionsBox = target.closest(".jtime-ui-options-box");
                        options = optionsBox.find("ul.jtime-ui-list li");

                        if (optionsBox.find("ul.jtime-ui-list-built-found").length) {
                            foundsList = optionsBox.find(".jtime-ui-list-built-found");
                            foundsList.empty();
                        } else {
                            foundsList = $("<ul></ul>")
                                .addClass("jtime-ui-list-built-found");
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

        // click out
        $(document).on("click", function (e) {
            wrapper = $(".jtime-ui-select");
            optionsBoxes = wrapper.find(".jtime-ui-options-box");
            captions = wrapper.find(".jtime-ui-caption-box");

            if (!$(e.target).closest(".jtime-ui-select").length) {

                if (optionsBoxes.is(":visible")) {
                    optionsBoxes.hide();
                    captions.removeClass("jtime-ui-arrow-expanded");
                }

            }

        });

        // imitar esta parte para as abas
        $(this).each(function (i, select) {
            select = $(select);
            select.hide();
            wrapper = $("<div></div>");
            wrapper.addClass("jtime-ui-select");
            select.parent().append(wrapper);
            wrapper.append(select);

            caption = $("<div></div>");
            captionText = $("<div></div>");
            listBox = $("<div></div>");

            list = $("<ul></ul>");

            caption.addClass("jtime-ui-caption-box jtime-ui-arrow-retracted");
            captionText.addClass("jtime-ui-caption-text");
            listBox.addClass("jtime-ui-options-box");
            list.addClass("jtime-ui-list");

            wrapper.append(caption);
            caption.append(captionText);
            wrapper.append(listBox);
            listBox.append(list);

            buildOpts(list);

            // toggle
            caption.on("click", function () {
                wrapper = $(this).closest(".jtime-ui-select");
                wrapper.find(".jtime-ui-options-box").toggle();
                toggleCaptionClass($(this));
            });

            setActionToSelect(list);
        });

        if (args) {
            if (args.search) {
                buildOptsWithSearch($(this));
            }
        }

        return $(this);

    };

})(jQuery);
