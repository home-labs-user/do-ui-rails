var
    esPhinx,
    Constructor,
    Extensor;


(function($, $module) {
    "use strict";

    const
        CSS_CLASS = "esphinx ui",
        CSS_CLASS_QUERY = "." + CSS_CLASS.replace(/ +/g, ".");


    $module.extend({
        selectors: {Select: {}}
    });

    Extensor.new($module.selectors.Select, true, {
        new: function(select, options) {
            var
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
                            option,
                            abstractOption,
                            ConstructionClass = Option.new,
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

                        if (!(this instanceof ConstructionClass)) {
                            return new (Constructor.new(ConstructionClass,
                                                        arguments))();
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

                decorateOptions = function(optionElements) {
                    optionElements.each(function(option) {
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

                decorate = function() {
                    // hide concrete select element
                    // selectElement.hide();

                    wrapper.insertAfter(selectElement);
                    captionText.text(selected(selectElement).text());
                    caption.append(captionText);
                    wrapper.prepend(caption);
                    wrapper.append(optionsPanel);
                    optionsPanel.append(abstractSelect);

                    var

                        decorateSearchTextBox = function() {
                            searchTextBox.attribute("type", "text");
                            optionsPanel.prepend(searchTextBox);

                            $.ui.panels.autocomplete.new(searchTextBox,
                                                         abstractSelect, {
                                order: options.order
                            }, function(found) {
                                decorateOptions(found);
                            });

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
                        decorateSearchTextBox();
                    }

                    decorateOptions(optionElements);
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
                };

            if (!(this instanceof ConstructionClass.new)) {
                return new ConstructionClass.new($(select), options);
            }

            decorate();

            attachClickFromOutsideEventListener();

            this.on = function(eventName, capture, callback) {
                $(select).on(eventName, capture, callback);

                return this;
            };

            this.off = function(eventName, capture, callback) {
                $(select).off(eventName, capture, callback);

                return this;
            };

            this.addOptions = function(optionElements) {
                decorateOptions(optionElements);

                // $(optionNodes).each(function(option) {

                // });
            };

            return this;
        }
    });

}(esPhinx, esPhinx.ui));
