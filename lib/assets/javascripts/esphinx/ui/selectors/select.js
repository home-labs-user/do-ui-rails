var
    esPhinx;


(function ($module) {
    "use strict";

    const
        CSS_CLASS = "esphinx ui",
        CSS_CLASS_QUERY = "." + CSS_CLASS.replace(/ +/g, ".");


    $module.extend({

        selectors: {

            Select: {

                new: function (select, options) {
                    var
                        optionsList,
                        captionText,
                        $ = esPhinx,
                        ConstructionClass = $module.selectors.Select,
                        wrapper = $("<div></div>"),
                        caption = $("<div></div>"),
                        optionsPanel = $("<div></div>"),
                        searchTextBox = $("<input></input>"),
                        abstractSelect = $("<ul></ul>"),
                        abstractOptions = [],
                        captionText = $("<div></div>"),
                        selectElement = $(select),
                        optionElements = selectElement.find("option"),

                        Option = {
                            new: function(data) {
                                var
                                    ConstructionClass = Option,
                                    option,
                                    abstractOption,

                                    buildAbstractOption = function (li,
                                                                    option) {

                                        li = $(li);
                                        option = $(option);
                                        li.text(option.text());
                                        li.attribute("data-value", option
                                                     .attribute("value"));
                                    },

                                    select = function(abstractOption, option) {
                                        option.select();

                                        // TODO for abstractOption
                                    };

                                if (!(this instanceof ConstructionClass.new)) {
                                    return new ConstructionClass.new(data);
                                }


                                if ($(data.option).tagName() == "option") {
                                    option = $(data.option);
                                    abstractOption = $("<li></li>");
                                    buildAbstractOption(abstractOption, option);
                                } else {
                                    abstractOption = data.option;
                                }

                                this.append = function() {
                                    if (abstractOption.tagName() != "option") {
                                        data.abstractSelect
                                            .append(abstractOption);
                                    }
                                };

                                this.select = function() {
                                    $(data.captionText).text(option
                                                             .textContent());
                                    $(data.select).find("option:checked")
                                        .unselect();
                                    // option.select();
                                    select(abstractOption, option);
                                    $(data.optionsPanel).hide();
                                    toggleCaptionClass(data.caption);
                                };

                                this.element = function() {
                                    return abstractOption;
                                };
                            },

                            buildFor: function() {
                                // return Object.new
                            }
                        },

                        selected = function(select) {
                            return $(select).find("option:checked");
                        },

                        toggleCaptionClass = function (caption) {
                            caption.toggleClass("arrow-expanded",
                                "arrow-retracted");
                        },

                        decorate = function() {
                            // selectElement.hide();

                            wrapper.insertAfter(selectElement);
                            captionText.text(selected(selectElement).text());
                            caption.append(captionText);
                            wrapper.prepend(caption);
                            wrapper.append(optionsPanel);
                            optionsPanel.append(abstractSelect);

                            var
                                bindFoundListEventListener = function(
                                    abstractOptions) {
                                    abstractOptions
                                        .forEach(function(abstractOption) {
                                        $(abstractOption.element()).on("click",
                                            function() {
                                            abstractOption.select();
                                        });
                                    });
                                },

                                decorateOptions = function(optionElements) {
                                    var
                                        option;

                                    optionElements.each(function(option) {
                                        option = Option.new({
                                            option: option,
                                            select: selectElement,
                                            caption: caption,
                                            captionText: captionText,
                                            optionsPanel: optionsPanel,
                                            abstractSelect: abstractSelect
                                        });

                                        option.append();

                                        abstractOptions.push(option);

                                    });

                                    bindFoundListEventListener(abstractOptions);
                                },

                                decorateSearchTextBox = function() {
                                    searchTextBox.attribute("type", "text");
                                    optionsPanel.prepend(searchTextBox);

                                    $.ui.panels.autocomplete
                                        .new(searchTextBox, abstractSelect, {
                                        order: options.order
                                    }, function (found) {
                                        // montar a partir disto
                                        // found.asArray()
                                        // bindFoundListEventListener(found
                                                                   // .asArray());

                                        debugger
                                    });

                                };

                            wrapper.addClass(CSS_CLASS + " select");
                            caption.addClass("caption arrow-retracted");
                            optionsPanel.addClass("options-panel");
                            captionText.addClass("text");

                            // toggle on click on caption
                            caption.on("click", function () {
                                optionsPanel.toggle();
                                toggleCaptionClass($(this));
                            });

                            if (typeof options.searchTextBox == "boolean" &&
                                options.searchTextBox) {
                                decorateSearchTextBox();
                            }

                            decorateOptions(optionElements);
                        };

                    if (!(this instanceof ConstructionClass.new)) {
                        return new ConstructionClass
                            .new($(select), options);
                    }

                    decorate();

                    return this;
                }

            }

        }

    });

}(esPhinx.ui));
