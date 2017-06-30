var
    esPhinx,
    Extensor;


(function($, $module) {
    "use strict";

    var
        CSS_CLASS = "esphinx ui",
        CSS_CLASS_QUERY = "." + CSS_CLASS.replace(/ +/g, ".");

    $module.extend({
        panels: {autocomplete: {}}
    });

    Extensor.new($module.panels.autocomplete, true, {
        new: function(searchTextBox, originalList, options, callback) {
        // new: function(searchTextBox, originalList, options = {}, callback) {
            var
                ConstructorReference = $module.panels.autocomplete.new,
                self = this,
                nodeListFound,
                referenceElement,
                created = false,

                spanize = function(mapped) {
                    var
                        spanizedSliceFound;

                    Object.keys(mapped).forEach(function(i) {
                        spanizedSliceFound = $(mapped[i].span());
                        spanizedSliceFound.addClass(CSS_CLASS + " slice-found");

                        mapped[i] = spanizedSliceFound;
                    });

                    return mapped;
                },

                composeMatch = function(mapped, nodeText, nodeTextAsArr) {
                    var
                        leftUnitName,
                        rightUnitName,
                        searchIndex,
                        sliceFound,
                        span,
                        composedArr = [];

                    nodeTextAsArr.spaceOut().forEach(function(value, i) {
                        if (mapped.hasOwnProperty(i)) {
                            span = mapped[i];
                            sliceFound = span.text();
                            searchIndex = value.search(sliceFound);
                            leftUnitName = value.slice(0, searchIndex);
                            rightUnitName = value
                                .slice(searchIndex + sliceFound.length,
                                       value.length);

                            if (!leftUnitName.empty()) {
                                composedArr.push(window.document
                                    .createTextNode(leftUnitName));
                            } else {
                                span.text(span.text());
                            }

                            composedArr.push(span.asNode());

                            if (!rightUnitName.empty()) {
                                composedArr.push(window.document
                                    .createTextNode(rightUnitName));
                            }
                        } else {
                            composedArr.push(window.document
                                             .createTextNode(value));
                        }

                    });

                    return composedArr;
                },

                resolveAnswer = function(found, maps) {
                    var
                        resolved = $(),
                        composed,
                        nodeText,
                        nodeTextAsArr,
                        mapped;

                    found.each(function(node, i) {
                        nodeText = $(node).text().trim();
                        nodeTextAsArr = nodeText.split(" ");
                        mapped = spanize(maps[i]);
                        composed = composeMatch(mapped, nodeText,
                                                nodeTextAsArr);
                        resolved.concat(true, composeName(composed,
                                                          node));
                    });

                    return resolved;
                },

                composeName = function(composedArr, node) {
                    var
                        copy = $(node).clone();

                    composedArr.forEach(function(v) {
                        copy.append(v);
                    });

                    return copy;
                },

                create = function(referenceElement) {
                    var
                        nodeListFound = $("<ol></ol>")
                            .addClass(CSS_CLASS + " list-built-found"),
                        width,
                        borderBottom,
                        border,
                        marginBottom,

                        hitTarget = function(target) {
                            return target.is(nodeListFound.childElements()) ||
                                target.is(referenceElement);
                        };

                    if (referenceElement.instanceOf(window.HTMLInputElement)) {

                        referenceElement.on("focus", function() {
                            if (nodeListFound.childElements().some()) {
                                nodeListFound.show();
                            }
                        });

                        referenceElement.on("blur", function(e) {
                            if (e.relatedTarget) {
                                if (!$(e.relatedTarget).is(nodeListFound)) {
                                    self.hide();
                                }
                            }

                         });

                        // clicking outside the panel
                        $(window.document).on("mouseup", function(e) {
                            var
                                target = $(e.target);

                            if (!target.instanceOf(window.HTMLInputElement) &&
                                !target.instanceOf(window.HTMLLIElement)) {
                                target = target.parent("ol" + CSS_CLASS_QUERY +
                                            ".list-built-found li");
                            }

                            if (!hitTarget(target)) {
                                self.hide();
                            } else if (target
                                       .instanceOf(window.HTMLLIElement)) {
                                if (target.hasClass("selected")) {
                                    target.removeClass("selected");
                                } else {
                                    target.addClass("selected");
                                }
                            }

                        });

                        marginBottom = referenceElement.css("margin-bottom");
                        width = referenceElement.width();
                        borderBottom = referenceElement.css("border-bottom");
                        border = referenceElement.css("border");

                        nodeListFound.css("margin-top", -marginBottom + "px");

                        // only after set width, otherwise doesn't can get your border
                        nodeListFound.insertAfter(referenceElement);
                        if (width) {
                            nodeListFound.css("position", "absolute");
                            // nodeListFound.width(width);
                            nodeListFound.css("min-width", width);
                        }

                        nodeListFound.show();
                    } else {
                        nodeListFound.insertAfter(referenceElement);
                    }

                    return nodeListFound;
                },

                show = function(autocompletedList) {
                    $(nodeListFound).clean();

                    if (searchTextBox.value()) {
                        if (originalList instanceof $) {
                            originalList.hide();
                        }

                        autocompletedList.each(function(li) {
                            nodeListFound.append(li);
                        });

                        if (nodeListFound.childElements().some()) {
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
                return new ConstructorReference(searchTextBox, originalList,
                                                options, callback);
            }

            if (Object.getPrototypeOf(originalList) ==
                Object.getPrototypeOf({})) {
                referenceElement = searchTextBox;
                callback = options;
                options = originalList;
            } else {
                referenceElement = originalList;
            }

            searchTextBox.autocomplete(originalList, options,
                                       function(found, mapped) {
                var
                    resolvedAnswer;

                if (!created) {
                    created = true;

                    nodeListFound = create(referenceElement);
                }

                if (!callback || !(callback instanceof Function)) {
                    callback = function() {};
                }

                resolvedAnswer = resolveAnswer(found, mapped);
                callback.call(self, show(resolvedAnswer));
            });

            this.hide = function() {
                nodeListFound.hide();
            };

        }
    });

})(esPhinx, esPhinx.ui);
