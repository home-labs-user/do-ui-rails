var jQuery = jQuery;

(function ($) {
    "use strict";

    $.fn.buildSelectOptions = function (params) {

        var
            caption,
            captionText,
            listBox,
            list,
            wrapper;

        $(this).each(function (undefined, select) {
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
            if (params.search) {
                buildOptsWithSearch($(this));
            }
        }

        return $(this);

    };

    var

        buildOpts = function (jqObj) {
            var
                wrapper = jqObj.closest(".do-ui-select"),
                select = wrapper.find("select"),
                list = wrapper.find("ul.do-ui-list"),
                options = select.find("option"),
                captionText = wrapper
                    .find(".do-ui-caption-box .do-ui-caption-text"),
                option,
                li;

            options.each(function (undefined, tag) {
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
                    captionText = wrapper
                        .find(".do-ui-caption-box .do-ui-caption-text"),
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
                inputText,
                foundsList,
                optText,
                searchIndex,
                prevSliceTextNoSearch,
                sliceFound,
                remainderSliceTextNoSearch,
                newOpt,
                spanSliceFound,
                options;

            jqObj.each(function (undefined, select) {
                optionsBox = $(select).closest(".do-ui-select")
                    .find(".do-ui-options-box");

                searchBox = $("<div></div>");
                searchBox.addClass("do-ui-search-box");
                searchTextBox = $("<input></input>");
                searchTextBox.attr("type", "text");
                searchBox.append(searchTextBox);

                optionsBox.prepend(searchBox);

                searchTextBox.on("keyup", function () {

                    // target
                    inputText = $(this);
                    optionsBox = inputText.closest(".do-ui-options-box");
                    options = optionsBox.find("ul.do-ui-list li");

                    // cria a lista das opções e a caixa de texto,
                    // dinamicamente, e apenas após a pesquisa.
                    // Caso ela já tenha sido criada, ela não é recriada,
                    // ela é apenas limpa.
                    if (optionsBox.find("ul.do-ui-list-built-found").length) {
                        foundsList = optionsBox.find(".do-ui-list-built-found");
                        foundsList.empty();
                    } else {
                        foundsList = $("<ul></ul>")
                            .addClass("do-ui-list-built-found");
                        optionsBox.append(foundsList);
                    }

                    // if (inputText.val() !== "") {
                    if (inputText.val()) {

                        options.each(function (undefined, option) {

                            optText = option.textContent.trim();
                            searchIndex = optText.toLowerCase()
                                .search(inputText.val().toLowerCase());
                            if (searchIndex > -1) {
                                foundsList.show();
                                options.parent().hide();

                                prevSliceTextNoSearch = optText
                                    .slice(0, searchIndex);

                                sliceFound = optText.slice(prevSliceTextNoSearch
                                    .length, prevSliceTextNoSearch.length +
                                        inputText.val().length);

                                remainderSliceTextNoSearch = optText
                                    .slice(prevSliceTextNoSearch.length +
                                        sliceFound.length, optText.length);

                                newOpt = $("<li></li>");
                                spanSliceFound = $("<span></span>");

                                newOpt.append(prevSliceTextNoSearch);
                                newOpt.append(spanSliceFound);
                                spanSliceFound.addClass("do-ui-slice-found");
                                spanSliceFound.text(sliceFound);
                                newOpt.append(remainderSliceTextNoSearch);
                                newOpt.attr("data-value", $(option)
                                    .data("value"));

                                foundsList.prepend(newOpt);
                            }

                        });

                        setActionToSelect(foundsList);

                    } else {
                        options.parent().show();
                        foundsList.hide();
                    }
                });
            });
        };

    // click out
    $(document).click(function (e) {

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
