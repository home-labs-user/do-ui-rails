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

                new: function (inputText, originalList, options = {},
                    callback) {

                    var
                        ConstructorReference = $module.panels.autocomplete.new,
                        nodeListFound,
                        referenceNode,
                        created = false,

                        show = function (autocompletedList, nodeListFound) {
                            nodeListFound.deflate();

                            if (inputText.value()) {
                                if (originalList instanceof $) {
                                    originalList.hide();
                                }
                                autocompletedList.each(function (li) {
                                    nodeListFound.append(li);
                                });
                                nodeListFound.show();
                            } else {
                                if (originalList instanceof $) {
                                    originalList.show();
                                }
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
                            originalList, options, callback);
                    }

                    if (originalList.constructor === Object) {
                        referenceNode = inputText;
                        callback = options;
                        options = undefined;
                    } else {
                        referenceNode = originalList;
                    }

                    inputText.autocomplete(originalList, options,
                    function (found) {
                        // debugger
                        // talvez seja melhor remover caso !this.value()
                        if (!created) {
                            created = true;
                            nodeListFound = create(referenceNode);
                        }

                        if (!callback || !callback instanceof Function) {
                            callback = function () {};
                        }

                        callback(show(found, nodeListFound));
                    });

                }

            }

        }

    });

})(esPhinx.ui);
