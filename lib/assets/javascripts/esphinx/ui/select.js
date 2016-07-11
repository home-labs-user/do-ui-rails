// require jquery/min/2.2.0
// require jquery
// require ./autocomplete

var
    jQuery;

(function ($) {
    "use strict";

    // transformar em objeto js seguindo o modelo de tooltip
    // $.prototype.abstractSelect = function (args) {
    // $.prototype.abstractSelect = function (args) {

    $.extend({

        prototype: {

            abstractSelect: function (args) {
                var
                    self = this,
                    caption,
                    captionText,
                    listBox,
                    list,
                    select,
                    wrapper,

                    build = function (collection) {
                        wrapper = collection.parent(".esphinx.ui.select");
                        select = wrapper.find("select");
                        list = wrapper.find("ul.esphinx.ui.list");

                        var
                            options = select.find("option"),
                            captionText = wrapper
                                .find(".esphinx.ui.caption-box .caption-text"),
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
                            wrapper = collection.parent(".esphinx.ui.select");
                            caption = wrapper.find(".esphinx.ui .caption-box");
                            value = $(this).data("value");
                            select = wrapper.find("select");
                            captionText = wrapper
                                .find(".esphinx.ui .caption-box .caption-text");

                            // remove selection
                            select.find("option:checked")
                                .attr("checked", false);

                            // select
                            selected = select.find("option[value='" + value + "']");
                            selected.attr("checked", true);

                            captionText.text(selected.text());

                            // hide options
                            wrapper.find(".esphinx.ui .options-box").hide();

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
                            optionsBox = $(select).parent(".esphinx.ui.select")
                                .find(".esphinx.ui .options-box");

                            searchBox = $("<div></div>");
                            searchBox.addClass("esphinx ui search-box");
                            searchTextBox = $("<input></input>");
                            searchTextBox.attr("type", "text");
                            searchBox.append(searchTextBox);

                            optionsBox.prepend(searchBox);
                            options = optionsBox.find("ul.esphinx.ui.list li");

                            // lógica para AutocompletePanel.new AQUI
                            searchTextBox.autocomplete(options, args.search,
                                function (found) {
                                    // target
                                    target = this;
                                    optionsBox = target
                                        .parent(".esphinx.ui .options-box");
                                    options = optionsBox
                                        .find("ul.esphinx.ui.list li");

                                    if (optionsBox
                                        .find("ul.esphinx.ui.list-built-found")
                                        .length) {
                                        foundsList = optionsBox
                                            .find(".esphinx.ui.list-built-found");
                                        foundsList.deflate();
                                    } else {
                                        foundsList = $("<ul></ul>")
                                            .addClass("esphinx ui list-built-found");
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
                        wrapper = $(".esphinx.ui.select"),
                        optionsBoxes = wrapper.find(".esphinx.ui.options-box"),
                        captions = wrapper.find(".esphinx.ui.caption-box");

                    if (!$(e.target).parent(".esphinx.ui.select").count()) {

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
                    wrapper.addClass("esphinx ui select");
                    select.parent().append(wrapper);
                    wrapper.append(select);

                    caption = $("<div></div>");
                    captionText = $("<div></div>");
                    listBox = $("<div></div>");

                    list = $("<ul></ul>");

                    caption.addClass("esphinx ui caption-box arrow-retracted");
                    captionText.addClass("esphinx ui caption-text");
                    listBox.addClass("esphinx ui options-box");
                    list.addClass("esphinx ui list");

                    wrapper.append(caption);
                    caption.append(captionText);
                    wrapper.append(listBox);
                    listBox.append(list);

                    build(list);

                    // toggle
                    caption.on("click", function () {
                        wrapper = $(this).parent(".esphinx.ui.select");
                        wrapper.find(".esphinx.ui .options-box").toggle();
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
