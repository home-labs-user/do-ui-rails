// require jquery/min/2.2.0
// require jquery
// require ./autocomplete

var
    jQuery;

(function ($) {
    "use strict";

    const
        CSS_CLASS = "esphinx ui",
        CSS_CLASS_QUERY = "." + CSS_CLASS.replace(/ +/g, ".");

    $.extend({

        prototype: {

            abstractSelect: function (args) {
                var
                    self = this,
                    caption,
                    captionText,
                    listPanel,
                    list,
                    select,
                    wrapper,

                    build = function (collection) {
                        // wrapper = collection.parent(".esphinx.ui.select");
                        wrapper = collection.parent(CSS_CLASS_QUERY + ".select");
                        select = wrapper.find("select");
                        list = wrapper.find("ul.list");

                        var
                            options = select.find("option"),
                            captionText = wrapper
                                .find(".caption .text"),
                            li,
                            option;

                        options.each(function (tag) {
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

                    toggleCaptionClass = function (collection) {
                        collection.toggleClass("arrow-expanded",
                            "arrow-retracted");
                    },

                    //select onclick
                    setActionToSelect = function (collection) {
                        var
                            value,
                            selected;

                        collection.find("li").on("click", function () {
                            // wrapper = collection.parent(".esphinx.ui.select");
                            wrapper = collection
                                .parent(CSS_CLASS_QUERY + ".select");
                            caption = wrapper.find(".caption");
                            value = $(this).data("value");
                            select = wrapper.find("select");
                            captionText = wrapper
                                .find(".caption .text");

                            // remove selection
                            select.find("option:checked")
                                .unselect();

                            selected = select
                                .find("option[value='" + value + "']")
                                .select();

                            captionText.text(selected.text());

                            // hide options
                            wrapper.find(".options-panel").hide();

                            toggleCaptionClass(caption);
                        });
                    },

                    buildOptionsWithSearch = function (collection) {
                        var
                            target,
                            optionsBox,
                            searchBox,
                            searchTextBox,
                            options,
                            foundsList;

                        collection.each(function (select) {
                            // optionsBox = $(select).parent(".esphinx.ui.select")
                            optionsBox = $(select)
                                .parent(CSS_CLASS_QUERY + ".select")
                                .find(".options-panel");

                            searchBox = $("<div></div>");
                            searchBox.addClass("search-box");
                            searchTextBox = $("<input></input>");
                            searchTextBox.attr("type", "text");
                            searchBox.append(searchTextBox);

                            optionsBox.prepend(searchBox);
                            options = optionsBox.find("ul.list li");

                            searchTextBox.autocomplete(options, args.search,
                                function (found) {
                                    // target
                                    target = this;
                                    optionsBox = target
                                        .parent(".options-panel");
                                    options = optionsBox
                                        .find("ul.list li");

                                    if (optionsBox
                                        .find("ul.list-built-found")
                                        .length) {
                                        foundsList = optionsBox
                                            .find(".list-built-found");
                                        foundsList.deflate();
                                    } else {
                                        foundsList = $("<ul></ul>")
                                            .addClass("list-built-found");
                                        optionsBox.append(foundsList);
                                    }

                                    if (target.value()) {
                                        options.parent().hide();
                                        found.each(function (li) {
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
                    var
                        // wrapper = $(".esphinx.ui.select"),
                        wrapper = $(CSS_CLASS_QUERY + ".select"),
                        optionsBoxes = wrapper.find(".options-panel"),
                        captions = wrapper.find(".caption");

                    // if (!$(e.target).parent(".esphinx.ui.select").any()) {
                    if (!$(e.target).parent(CSS_CLASS_QUERY + ".select")
                        .any()) {
                        if (optionsBoxes.visible()) {
                            optionsBoxes.hide();
                            captions.removeClass("arrow-expanded");
                            captions.addClass("arrow-retracted");
                        }

                    }
                });

                $(this).each(function (select) {
                    select = $(select);
                    select.hide();
                    wrapper = $("<div></div>");
                    wrapper.addClass(CSS_CLASS + " select");
                    select.parent().append(wrapper);
                    wrapper.append(select);

                    caption = $("<div></div>");
                    captionText = $("<div></div>");
                    listPanel = $("<div></div>");

                    list = $("<ul></ul>");

                    caption.addClass("caption arrow-retracted");
                    captionText.addClass("text");
                    listPanel.addClass("options-panel");
                    list.addClass("list");

                    wrapper.append(caption);
                    caption.append(captionText);
                    wrapper.append(listPanel);
                    listPanel.append(list);

                    build(list);

                    // toggle
                    caption.on("click", function () {
                        // wrapper = $(this).parent(".esphinx.ui.select");
                        wrapper = $(this).parent(CSS_CLASS_QUERY + ".select");
                        wrapper.find(".options-panel").toggle();
                        toggleCaptionClass($(this));
                    });

                    setActionToSelect(list);
                });

                if (args) {
                    if (args.search) {
                        buildOptionsWithSearch(self);
                    }
                }

                return self;

            }

        }

    });

})(esPhinx);
