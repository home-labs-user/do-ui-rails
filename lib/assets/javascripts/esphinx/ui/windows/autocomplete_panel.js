"use strict";

var
    esPhinx,
    Constructor;

(function ($module) {

    const
        CSS_CLASS = "esphinx ui",
        CSS_CLASS_QUERY = "." + CSS_CLASS.replace(/ +/g, ".");

    $module.extend({

        windows: {

            autocompletePanel: {

                new: function (inputText, autocompletedList) {
                    var
                        Class = Constructor.build($module.windows
                            .autocompletePanel.new, arguments),
                        self = this,
                        $ = esPhinx,
                        target,
                        optionsBox,
                        searchBox,
                        searchTextBox,
                        options,
                        foundsList;


                    if (!(this instanceof Class)) {
                        return new Class();
                    }

                    autocompletedList.each(function (select) {
                        options = optionsBox.find("ul.list li");

                        inputText.autocomplete(options, args.search,
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
                                    .find(".ist-built-found");
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

                }

            }

        }

    });

})(esPhinx.ui);
