//= require jquery

"use strict";

var
    jQuery;

(function ($) {

    $.prototype.buildOptions = function (args) {

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
                wrapper = jqObj.closest(".esphinx-ui-select");
                select = wrapper.find("select");
                list = wrapper.find("ul.esphinx-ui-list");
                options = select.find("option");
                captionText = wrapper.find(".esphinx-ui-caption-box .esphinx-ui-caption-text");

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
                jqObj.toggleClass("esphinx-ui-arrow-expanded", "esphinx-ui-arrow-retracted");
            },

            //select onclick
            setActionToSelect = function (jqObj) {

                jqObj.find("li").on("click", function () {
                    wrapper = jqObj.closest(".esphinx-ui-select");
                    caption = wrapper.find(".esphinx-ui-caption-box");
                    value = $(this).data("value");
                    select = wrapper.find("select");
                    captionText = wrapper.find(".esphinx-ui-caption-box .esphinx-ui-caption-text");

                    // remove selection
                    select.find("option:selected")
                        .attr("selected", false);

                    // select
                    selected = select.find("option[value='" + value + "']");
                    selected.attr("selected", true);

                    captionText.text(selected.text());

                    // esconde opções
                    wrapper.find(".esphinx-ui-options-box").hide();

                    toggleCaptionClass(caption);
                });
            },

            buildOptsWithSearch = function (jqObj) {

                jqObj.each(function (i, select) {
                    optionsBox = $(select).closest(".esphinx-ui-select")
                        .find(".esphinx-ui-options-box");

                    searchBox = $("<div></div>");
                    searchBox.addClass("esphinx-ui-search-box");
                    searchTextBox = $("<input></input>");
                    searchTextBox.attr("type", "text");
                    searchBox.append(searchTextBox);

                    optionsBox.prepend(searchBox);
                    options = optionsBox.find("ul.esphinx-ui-list li");

                    searchTextBox.autocomplete(options, args.search, function (e, found) {

                        // target
                        target = $(e.target);
                        optionsBox = target.closest(".esphinx-ui-options-box");
                        options = optionsBox.find("ul.esphinx-ui-list li");

                        if (optionsBox.find("ul.esphinx-ui-list-built-found").length) {
                            foundsList = optionsBox.find(".esphinx-ui-list-built-found");
                            foundsList.empty();
                        } else {
                            foundsList = $("<ul></ul>")
                                .addClass("esphinx-ui-list-built-found");
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
            wrapper = $(".esphinx-ui-select");
            optionsBoxes = wrapper.find(".esphinx-ui-options-box");
            captions = wrapper.find(".esphinx-ui-caption-box");

            if (!$(e.target).closest(".esphinx-ui-select").length) {

                if (optionsBoxes.is(":visible")) {
                    optionsBoxes.hide();
                    captions.removeClass("esphinx-ui-arrow-expanded");
                }

            }

        });

        // imitar esta parte para as abas
        $(this).each(function (i, select) {
            select = $(select);
            select.hide();
            wrapper = $("<div></div>");
            wrapper.addClass("esphinx-ui-select");
            select.parent().append(wrapper);
            wrapper.append(select);

            caption = $("<div></div>");
            captionText = $("<div></div>");
            listBox = $("<div></div>");

            list = $("<ul></ul>");

            caption.addClass("esphinx-ui-caption-box esphinx-ui-arrow-retracted");
            captionText.addClass("esphinx-ui-caption-text");
            listBox.addClass("esphinx-ui-options-box");
            list.addClass("esphinx-ui-list");

            wrapper.append(caption);
            caption.append(captionText);
            wrapper.append(listBox);
            listBox.append(list);

            buildOpts(list);

            // toggle
            caption.on("click", function () {
                wrapper = $(this).closest(".esphinx-ui-select");
                wrapper.find(".esphinx-ui-options-box").toggle();
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
