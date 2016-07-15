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

                new: function (inputText, originalList, options = {}) {
                    var
                        ConstructorReference = $module.panels.autocomplete.new,
                        nodeListFound,
                        referenceNode,

                        show = function (autocompletedList, nodeListFound) {
                            nodeListFound.deflate();

                            if (inputText.value()) {
                                originalList.hide();
                                autocompletedList.each(function (li) {
                                    nodeListFound.append(li);
                                });
                                nodeListFound.show();
                            } else {
                                originalList.show();
                                nodeListFound.hide();
                            }

                            return nodeListFound.childElements();
                        },

                        create = function (referenceNode) {
                            var
                                nodeListFound = $("<ul></ul>")
                                    .addClass("originalList-built-found"),
                                marginBottom,
                                width,
                                borderBottom,
                                paddingLeft,
                                paddingRight,
                                marginLeft,
                                marginRight,
                                border;

                            if (referenceNode.instanceOf(HTMLInputElement)) {
                                marginBottom = referenceNode
                                    .css("margin-bottom");
                                width = referenceNode.width();
                                borderBottom = referenceNode
                                    .css("border-bottom");
                                paddingLeft = referenceNode.css("padding-left");
                                paddingRight = referenceNode
                                    .css("padding-right");
                                marginLeft = referenceNode.css("margin-left");
                                marginRight = referenceNode.css("margin-right");
                                border = referenceNode.css("border");

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
                                nodeListFound.insertAfter(referenceNode);
                            } else {
                                nodeListFound.insertAfter(referenceNode);
                            }

                            return nodeListFound;
                        };

                    if (!(this instanceof ConstructorReference)) {
                        return new ConstructorReference(inputText,
                            originalList, options);
                    }

                    // improves here
                    if (!originalList || originalList.constructor === Object) {
                        // debugger
                        referenceNode = inputText;
                        // if (originalList.constructor === Object) {

                        // }
                    } else {
                        referenceNode = originalList;
                    }

                    nodeListFound = create(referenceNode);

                    inputText.autocomplete(originalList, options,
                    function (found) {

                        if (!options.found
                            || !options.found instanceof Function) {
                            options.found = function () {};
                        }

                        options.found(show(found, nodeListFound));
                    });

                }

            }

        }

    });

})(esPhinx.ui);
