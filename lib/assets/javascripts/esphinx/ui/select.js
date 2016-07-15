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
                    bindFoundsListEventListener = function (collection) {
                        var
                            value,
                            selected;

                        collection.find("li").on("click", function () {
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
                            optionsPanel,
                            searchTextBox,
                            list,
                            items,
                            nodeListFound,
                            panel,
                            panels = [];

                        collection.each(function (select) {
                            optionsPanel = $(select)
                                .parent(CSS_CLASS_QUERY + ".select")
                                .find(".options-panel");

                            searchTextBox = $("<input></input>");
                            searchTextBox.attr("type", "text");

                            optionsPanel.prepend(searchTextBox);

                            list = optionsPanel.find("ul.list");
                            items = list.find("li");

                            panels.push({
                                handler: searchTextBox,
                                instance: $.ui.panels.autocomplete
                                .new(searchTextBox, list),
                                items: items
                            });

                        });

                        panels.forEach(function (map) {
                            map.handler.autocomplete(map.items, args.search,
                                function (found) {
                                nodeListFound = map.instance.show(found);
                                bindFoundsListEventListener(nodeListFound);
                            });
                        });

                    };

                // click out
                $(document).on("click", function (e) {
                    var
                        wrapper = $(CSS_CLASS_QUERY + ".select"),
                        optionsPanels = wrapper.find(".options-panel"),
                        captions = wrapper.find(".caption");

                    if (!$(e.target).parent(CSS_CLASS_QUERY + ".select")
                        .any()) {
                        if (optionsPanels.visible()) {
                            optionsPanels.hide();
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
                        wrapper = $(this).parent(CSS_CLASS_QUERY + ".select");
                        wrapper.find(".options-panel").toggle();
                        toggleCaptionClass($(this));
                    });

                    bindFoundsListEventListener(list);
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
