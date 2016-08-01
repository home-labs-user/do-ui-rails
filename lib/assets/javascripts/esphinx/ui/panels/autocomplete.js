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

                        spanize = function (mapped) {
                            var
                                spanizedSliceFound;

                            Object.keys(mapped).forEach(function (i) {
                                spanizedSliceFound = $("<span></span>");
                                spanizedSliceFound
                                    .addClass(CSS_CLASS + " slice-found");
                                spanizedSliceFound.text(mapped[i]);
                                mapped[i] = spanizedSliceFound;
                            });

                            return mapped;
                        },

                        resolveAnswer = function (found, maps) {
                            var
                                resolved = $(),
                                composed,
                                tagName = found.tagName().toLowerCase(),
                                nodeText,
                                nodeTextAsArr,
                                mapped;

                            found.each(function (node, i) {
                                nodeText = $(node).text().toLowerCase().trim();
                                nodeTextAsArr = nodeText.split(" ");
                                mapped = spanize(maps[i]);
                                composed = composeMatch(mapped, nodeText,
                                    nodeTextAsArr);
                                resolved.concat(true, composeName(composed,
                                    node));
                            });

                            return resolved;
                        },

                        composeMatch = function (mapped, nodeText,
                            nodeTextAsArr) {
                            var
                                composedArr = [],
                                leftUnitName,
                                rightUnitName,
                                searchIndex,
                                sliceFound,
                                itemAsLower,
                                span;

                            nodeTextAsArr.spaceOut().capitalize()
                            .forEach(function (value, i) {
                                if (mapped.hasOwnProperty(i)) {
                                    span = mapped[i];
                                    itemAsLower = value.toLowerCase();
                                    sliceFound = span.text();
                                    searchIndex = itemAsLower
                                        .search(sliceFound);
                                    leftUnitName = itemAsLower
                                        .slice(0, searchIndex);
                                    rightUnitName = itemAsLower
                                        .slice(searchIndex + sliceFound.length,
                                        itemAsLower.length);

                                    if (!leftUnitName.empty()) {
                                        composedArr
                                            .push(capitalizeIf(leftUnitName,
                                            nodeText));
                                    } else {
                                        span.text(capitalizeIf(span.text(),
                                            nodeText));
                                    }

                                    composedArr.push(span.asNode());

                                    if (!rightUnitName.empty()) {
                                        composedArr.push(rightUnitName);
                                    }
                                } else {
                                    composedArr.push(value);
                                }

                            });

                            return composedArr;
                        },

                        capitalizeIf = function (word, nodeText) {
                            var
                                searchIndex;

                            searchIndex = nodeText.toLowerCase().trim()
                                .search(word);

                            if (searchIndex >= 0) {
                                return word.capitalize();
                            } else {
                                return word;
                            }
                        },

                        composeName = function (composedArr, node) {
                            var
                                copy = $(node).clone();

                            composedArr.forEach(function (v) {
                                copy.append(v);
                            });

                            return copy;
                        },

                        create = function (referenceNode) {
                            var
                                nodeListFound = $("<ol></ol>")
                                    .addClass(CSS_CLASS + " list-built-found")
                                        .hide(),
                                width,
                                borderBottom,
                                paddingLeft,
                                paddingRight,
                                border,
                                marginBottom,

                                hitTarget = function (target) {
                                    if (target
                                        .is(nodeListFound.childElements())
                                        || target.is(referenceNode)) {
                                        return true;
                                    }
                                    return false;
                                };

                            $(document).on("mouseup", function (e) {
                                var
                                    target = $(e.target);

                                if (!target.instanceOf(HTMLInputElement)
                                    && !target.constructorIs(HTMLLIElement)) {
                                    target = target
                                        .parent("ol" + CSS_CLASS_QUERY
                                        + ".list-built-found li");
                                }

                                if (!hitTarget(target)) {
                                    self.hide();
                                } else if (target
                                    .constructorIs(HTMLLIElement)) {
                                    if (target.hasClass("selected")) {
                                        target.removeClass("selected");
                                    } else {
                                        target.addClass("selected");
                                    }
                                }

                            });

                            if (referenceNode.instanceOf(HTMLInputElement)) {

                                // referenceNode.on("blur", function (e) {
                                //     var
                                //         selection = document.getSelection(),
                                //         focused = document.getSelection()
                                //             .focusNode;

                                //     if (!focused.instanceOf(HTMLInputElement)
                                //     && !focused.constructorIs(HTMLLIElement)) {
                                //         focused = focused
                                //             .parent("ol" + CSS_CLASS_QUERY
                                //             + ".list-built-found li");
                                //     }
                                //     // relatedTarget still doesn't work in FF
                                //     // self.hide();
                                // });

                                referenceNode.on("keydown", function (e) {
                                    if (e.key === "Tab") {
                                        self.hide();
                                    }
                                });

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
                                border = referenceNode.css("border");

                                nodeListFound
                                    .css("margin-top", -marginBottom + "px");
                                nodeListFound
                                    .css("padding-left", paddingLeft + "px");
                                nodeListFound
                                    .css("padding-right", paddingRight + "px");

                                // only after set width, otherwise doesn't can get your border
                                nodeListFound.insertAfter(referenceNode);
                                if (width) {
                                    nodeListFound.css("position", "absolute");
                                    nodeListFound.width(width);
                                }
                                nodeListFound.show();
                            } else {
                                nodeListFound.insertAfter(referenceNode);
                            }

                            return nodeListFound;
                        },

                        show = function (autocompletedList) {
                            nodeListFound.deflate();

                            if (searchTextBox.value()) {
                                if (originalList instanceof $) {
                                    originalList.hide();
                                }
                                // debugger
                                // whats criteria?
                                autocompletedList.each(function (li) {
                                    nodeListFound.append(li);
                                });

                                if (nodeListFound.childElements().any()) {
                                    nodeListFound.show();
                                } else {
                                    nodeListFound.hide();
                                }
                            } else {
                                if (originalList instanceof $) {
                                    originalList.show();
                                }
                                self.hide();
                            }

                            return nodeListFound.childElements();
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
                    function (found, mapped) {
                        var
                            resolvedAnswer;

                        if (!created) {
                            created = true;

                            nodeListFound = create(referenceNode);
                        }

                        if (!callback || !callback instanceof Function) {
                            callback = function () {};
                        }

                        resolvedAnswer = resolveAnswer(found, mapped);
                        callback.call(self, show(resolvedAnswer));
                    });

                }

            }

        }

    });

})(esPhinx.ui);
