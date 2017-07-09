var
    esPhinx,
    Constructor,
    Extender;


(function($, $module) {
    "use strict";

    var
        CSS_CLASS = "esphinx ui",
        CSS_CLASS_QUERY = "." + CSS_CLASS.replace(/ +/g, ".");


    $module.extend({
        selectors: {Select: {}}
    });

    Extender.new($module.selectors.Select, true, {
        new: function(select, options) {
            var
                ConstructorReference = $module.selectors.Select.new,
                wrapper = $("<div></div>"),
                caption = $("<div></div>"),
                optionsPanel = $("<div></div>"),
                searchTextBox = $("<input></input>"),
                abstractSelect = $("<ul></ul>"),
                abstractOptions = [],
                captionText = $("<div></div>"),
                selectElement = $(select),
                optionElements = selectElement.find("option"),

                resolveArguments = function(options) {
                    if(!options) {
                        options = {};
                    }

                    if(!options.developmentMode ||
                       typeof options.developmentMode != "boolean") {
                        options.developmentMode = false;
                    }
                },

                selected = function(select) {
                    return $(select).find("option:checked");
                },

                toggleCaptionClass = function(caption) {
                    caption.toggleClass("expanded-arrow", "retracted-arrow");
                },

                reattachFoundListEventListener = function(abstractOptions) {
                    abstractOptions.forEach(function(abstractOption) {
                        $(abstractOption.element()).off("click");
                        $(abstractOption.element()).on("click", function() {
                            abstractOption.select();
                        });
                    });
                },

                composeOptions = function(optionElements) {
                    $(optionElements).each(function(option) {
                        option = Option.new({
                            option: option,
                            select: selectElement,
                            caption: caption,
                            captionText: captionText,
                            optionsPanel: optionsPanel,
                            abstractSelect: abstractSelect
                        });

                        abstractOptions.push(option);
                    });

                    reattachFoundListEventListener(abstractOptions);
                    abstractOptions = [];
                },

                compose = function() {
                    if (!options.developmentMode) {
                        selectElement.hide();
                    }

                    wrapper.insertAfter(selectElement);
                    captionText.text(selected(selectElement).text());
                    caption.append(captionText);
                    wrapper.prepend(caption);
                    wrapper.append(optionsPanel);
                    optionsPanel.append(abstractSelect);

                    var

                        composeSearchTextBox = function() {
                            searchTextBox.attribute("type", "text");
                            optionsPanel.prepend(searchTextBox);

                            $.ui.panels.autocomplete.new(searchTextBox,
                                                         abstractSelect,
                                                         options.autocomplete,
                                function(found) {
                                    composeOptions(found);
                                }
                            );
                        };

                    wrapper.addClass(CSS_CLASS + " select");
                    caption.addClass("caption retracted-arrow");
                    optionsPanel.addClass("options-panel");
                    captionText.addClass("text");

                    // toggle on click on caption
                    caption.on("click", function() {
                        optionsPanel.toggle();
                        toggleCaptionClass($(this));
                    });

                    if (typeof options.searchTextBox == "boolean" &&
                        options.searchTextBox) {
                        composeSearchTextBox();
                    }

                    composeOptions(optionElements);
                },

                attachClickFromOutsideEventListener = function() {
                    var
                        wrapper = $(CSS_CLASS_QUERY + ".select"),
                        optionsPanels = wrapper.find(".options-panel"),
                        captions = wrapper.find(".caption");

                    $(window.document).on("click", function(e) {

                        if (!$(e.target).parent(CSS_CLASS_QUERY + ".select")
                            .some()) {
                            if (optionsPanels.visible()) {
                                optionsPanels.hide();
                                captions.removeClass("expanded-arrow");
                                captions.addClass("retracted-arrow");
                            }
                        }
                    });
                },

                addOptions = function(select, optionElements) {
                    $(optionElements).each(function(optionElement) {
                        select.append(optionElement);
                    });
                },

                replaceSelectOptions = function(select, optionElements) {
                    select.clean();
                    addOptions(select, $(optionElements));
                },

                Option = {
                    new: function(data) {
                        var
                            option,
                            abstractOption,
                            ConstructorReference = Option.new,
                            select = $(data.select),

                            buildAbstractOption = function(li, option) {
                                li = $(li);
                                option = $(option);
                                li.text(option.text());
                                li.attribute("data-value", option
                                             .attribute("value"));
                            },

                            append = function(abstractOption) {
                                if (abstractOption.tagName() != "option") {
                                    data.abstractSelect.append(abstractOption);
                                }
                            };

                        if (!(this instanceof ConstructorReference)) {
                            return new ConstructorReference(data);
                        }

                        if ($(data.option).tagName() == "option") {
                            option = $(data.option);
                            abstractOption = $("<li></li>");
                            buildAbstractOption(abstractOption, option);
                            append(abstractOption);
                        } else {
                            abstractOption = $(data.option);
                            option = select.find("option[value='" +
                                      abstractOption.data("value") + "']");
                        }

                        this.select = function() {
                            $(data.captionText).text($(abstractOption)
                                                     .textContent());
                            select.find("option:checked").unselect();
                            option.select();
                            $(data.optionsPanel).hide();
                            toggleCaptionClass(data.caption);
                        };

                        this.element = function() {
                            return abstractOption;
                        };
                    }
                };

            if (!(this instanceof ConstructorReference)) {
                return new ConstructorReference(select, options);
            }

            resolveArguments(options);
            select = $(select);
            compose();
            attachClickFromOutsideEventListener();

            this.addOptions = function(optionElements) {
                addOptions(select, optionElements);
                composeOptions(optionElements);
            };

            this.replaceOptions = function(optionElements) {
                abstractSelect.clean();
                replaceSelectOptions(select, optionElements);
                composeOptions(optionElements);
            };

            return this;
        }
    });

}(esPhinx, esPhinx.ui));
