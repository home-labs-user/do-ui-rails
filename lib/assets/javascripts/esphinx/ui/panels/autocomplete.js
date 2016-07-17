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

                new: function (searchTextBox, originalList, options = {},
                    callback) {

                    var
                        ConstructorReference = $module.panels.autocomplete.new,
                        self = this,
                        nodeListFound,
                        referenceNode,
                        created = false,

                        show = function (autocompletedList, nodeListFound) {
                            nodeListFound.deflate();

                            if (searchTextBox.value()) {
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
                                border,

                                targetWasListFound = function (target) {
                                    if (!target
                                        .is(nodeListFound.childElements())
                                        && !target.is(referenceNode)) {
                                        return true;
                                    }
                                    return false;
                                };

                            if (referenceNode.instanceOf(HTMLInputElement)) {
                                // if options.multiSelection
                                $(document).on("mouseup", function (e) {
                                    var
                                        selection = document.getSelection(),
                                        focused = document.getSelection()
                                            .focusNode,
                                        target = $(e.target);

                                    if (focused.constructor === Text) {
                                        focused = focused.parentElement;
                                    }

                                    // debugger
                                    if (targetWasListFound(target)) {
                                        nodeListFound.hide();
                                    }

                                });

                                // solution, listening tab
                                // relatedTarget still doesn't work in FF
                                // referenceNode.on("blur", function (e) {
                                //     var
                                //         selection = document.getSelection();
                                //     debugger
                                //     // focused = document.getSelection().focusNode
                                //     // self.hide();
                                // });

                                referenceNode.on("focus", function () {
                                    if (nodeListFound.childElements().any()) {
                                        nodeListFound.show();
                                    }
                                });

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
                        return new ConstructorReference(searchTextBox,
                            originalList, options, callback);
                    }

                    if (originalList.constructor === Object) {
                        referenceNode = searchTextBox;
                        callback = options;
                        options = undefined;
                    } else {
                        referenceNode = originalList;
                    }

                    this.hide = function () {
                        nodeListFound.hide();
                    }

                    searchTextBox.autocomplete(originalList, options,
                    function (found) {
                        // talvez seja melhor remover e setar o create para false caso !this.value()
                        if (!created) {
                            created = true;
                            nodeListFound = create(referenceNode);
                        }

                        if (!callback || !callback instanceof Function) {
                            callback = function () {};
                        }

                        callback.call(self, show(found, nodeListFound)
                            , searchTextBox);
                    });

                }

            }

        }

    });

})(esPhinx.ui);
