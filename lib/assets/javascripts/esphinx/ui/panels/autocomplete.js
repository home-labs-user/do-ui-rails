"use strict";

var
    esPhinx,
    Constructor;

(function ($module) {

    const
        CSS_CLASS = "esphinx ui",
        CSS_CLASS_QUERY = "." + CSS_CLASS.replace(/ +/g, ".");

    $module.extend({

        panels: {

            autocomplete: {

                new: function (inputText, autocompletedList) {
                    var
                        ConstructorReference = $module.panels.autocomplete.new,
                        self = this,
                        $ = esPhinx,
                        optionsPanel = inputText.parent(".options-panel"),

                        show = function (inputText, autocompletedList,
                            optionsPanel) {
                            var
                                options = optionsPanel.find("ul.list li"),
                                foundsList = this.foundsList;

                            foundsList.deflate();

                            if (inputText.value()) {
                                options.parent().hide();
                                autocompletedList.each(function (li) {
                                    foundsList.append(li);
                                });
                                foundsList.show();

                                // setActionToSelect(foundsList);

                            } else {
                                options.parent().show();
                                foundsList.hide();
                            }
                        },

                        create = function (optionsPanel) {
                            var
                                foundsList = $("<ul></ul>")
                                    .addClass("list-built-found");

                            optionsPanel.append(foundsList);

                            return foundsList;
                        };

                    if (!(this instanceof ConstructorReference)) {
                        self = Singleton
                            .exists(ConstructorReference, arguments);
                        if (!self) {
                            return ConstructorReference.instance(arguments);
                        } else {
                            show.call(self, inputText, autocompletedList,
                                optionsPanel);
                        }
                    } else {
                        this.foundsList = create(optionsPanel);
                        show.call(this, inputText, autocompletedList
                            , optionsPanel);
                    }

                    return self;
                }

            }

        }

    });

})(esPhinx.ui);
