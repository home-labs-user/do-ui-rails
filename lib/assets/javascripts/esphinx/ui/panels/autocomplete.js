"use strict";

var
    esPhinx,
    Constructor;

(function ($module) {

    const
        CSS_CLASS = "esphinx ui",
        CSS_CLASS_QUERY = "." + CSS_CLASS.replace(/ +/g, ".");

    var
        $ = esPhinx;

    $module.extend({

        panels: {

            autocomplete: {

                new: function (inputText, list, nodeReference) {
                    var
                        ConstructorReference = $module.panels.autocomplete.new,
                        nodeListFound,

                        create = function (nodeReference) {
                            var
                                nodeListFound = $("<ul></ul>")
                                    .addClass("list-built-found"),
                                marginBottom,
                                width,
                                borderBottom,
                                paddingLeft,
                                paddingRight,
                                marginLeft,
                                marginRight,
                                border;

                            marginBottom = nodeReference.css("margin-bottom");
                            width = nodeReference.width();
                            borderBottom = nodeReference.css("border-bottom");
                            paddingLeft = nodeReference.css("padding-left");
                            paddingRight = nodeReference.css("padding-right");
                            marginLeft = nodeReference.css("margin-left");
                            marginRight = nodeReference.css("margin-right");
                            border = nodeReference.css("border");

                            if (nodeReference.instanceOf(HTMLInputElement)) {
                                nodeListFound
                                    .css("margin-top", -marginBottom + "px");
                                nodeListFound
                                    .css("padding-left", paddingLeft + "px");
                                nodeListFound
                                    .css("padding-right", paddingRight + "px");
                                nodeListFound
                                    .css("margin-left", marginLeft + "px");
                                nodeListFound
                                    .css("margin-right", marginRight + "px");
                                if (width) {
                                    nodeListFound.css("position", "absolute");
                                    nodeListFound.width(width);
                                }
                                nodeListFound.insertAfter(nodeReference);
                            } else {
                                nodeListFound.insertAfter(nodeReference);
                            }

                            return nodeListFound;
                        };

                    if (!(this instanceof ConstructorReference)) {
                        return new ConstructorReference(inputText, list,
                            nodeReference);
                    }

                    if (!nodeReference) {
                        nodeReference = inputText;
                    }

                    nodeListFound = create(nodeReference);

                    this.show = function (autocompletedList) {
                        nodeListFound.deflate();

                        if (inputText.value()) {
                            list.hide();
                            autocompletedList.each(function (li) {
                                nodeListFound.append(li);
                            });
                            nodeListFound.show();
                        } else {
                            list.show();
                            nodeListFound.hide();
                        }

                        return nodeListFound;
                    }

                }

            }

        }

    });

})(esPhinx.ui);
