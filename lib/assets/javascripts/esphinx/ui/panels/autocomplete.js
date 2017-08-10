var
    esPhinx;


(function($, $module) {
    "use strict";

    var
        CSS_CLASS = "esphinx ui",
        CSS_CLASS_QUERY = "." + CSS_CLASS.replace(/ +/g, ".");

    $module.extend({
        panels: {autocomplete: {}}
    });

    $.Extender.extend($module.panels.autocomplete, true, {
        // new: function(searchTextBox, originalList, options = {}, callback) {
        new: function(searchTextBox, originalList, options, callback) {
            var
                nodeListFound,
                referenceElement,
                spanizedSliceFound,
                mapped,
                ConstructorReference = $module.panels.autocomplete.new,
                self = this,
                created = false,

                iteratorblock = function(i) {
                    spanizedSliceFound = $(mapped[i].span());
                    spanizedSliceFound.addClass(CSS_CLASS + " slice-found");

                    mapped[i] = spanizedSliceFound;
                },

                spanize = function(map) {
                    mapped = map;

                    Object.keys(map).forEach(iteratorblock);

                    return map;
                },

                composeMatch = function(mapped, nodeText, nodeTextAsArr) {
                    var
                        leftUnitName,
                        rightUnitName,
                        searchIndex,
                        sliceFound,
                        span,
                        composedArr = [],

                        iteratorblock = function(value, i) {
                            if (mapped.hasOwnProperty(i)) {
                                span = mapped[i];
                                sliceFound = span.text();
                                searchIndex = value.search(sliceFound);
                                leftUnitName = value.slice(0, searchIndex);
                                rightUnitName = value
                                    .slice(searchIndex + sliceFound.length,
                                           value.length);

                                if (!leftUnitName.isEmpty()) {
                                    composedArr.push(window.document
                                        .createTextNode(leftUnitName));
                                } else {
                                    span.text(span.text());
                                }

                                composedArr.push(span.asNode());

                                if (!rightUnitName.isEmpty()) {
                                    composedArr.push(window.document
                                        .createTextNode(rightUnitName));
                                }
                            } else {
                                composedArr.push(window.document
                                                 .createTextNode(value));
                            }

                        };

                    nodeTextAsArr.spaceOut().forEach(iteratorblock);

                    return composedArr;
                },

                resolveResponse = function(found, maps) {
                    var
                        composed,
                        nodeText,
                        nodeTextAsArr,
                        mapped,
                        resolved = $(),

                        callback = function(node, i) {
                            nodeText = $(node).text().trim();
                            nodeTextAsArr = nodeText.split(" ");
                            mapped = spanize(maps[i]);
                            composed = composeMatch(mapped, nodeText,
                                                    nodeTextAsArr);
                            resolved.concat(true, composeName(composed, node));
                        };

                    found.each(callback);

                    return resolved;
                },

                composeName = function(composedArr, node) {
                    var
                        copy = $(node).clone(),

                        iteratorblock = function(v) {
                            copy.append(v);
                        };

                    composedArr.forEach(iteratorblock);

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

                    if (referenceElement.isA(window.HTMLInputElement)) {

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

                            // debugger
                            if (!target.isA(window.HTMLInputElement) &&
                                !target.isA(window.HTMLLIElement)) {
                                target = target.parent("ol" + CSS_CLASS_QUERY +
                                            ".list-built-found li");
                            }

                            if (!hitTarget(target)) {
                                self.hide();
                            } else if (target
                                       .isA(window.HTMLLIElement)) {
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
                    var
                        callback = function(li) {
                            nodeListFound.append(li);
                        };

                    $(nodeListFound).clean();

                    if (searchTextBox.value()) {
                        if (originalList instanceof $) {
                            originalList.hide();
                        }

                        autocompletedList.each(callback);

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

            if (Object.areFromClass(originalList, Object)) {
                referenceElement = searchTextBox;
                callback = options;
                options = originalList;
            } else {
                referenceElement = originalList;
            }

            searchTextBox.autocomplete(originalList, options,
                                       function(found, mapped) {
                var
                    resolvedResponse;

                if (!created) {
                    created = true;

                    nodeListFound = create(referenceElement);
                }

                if (typeof callback == "function") {
                    callback = function() {};
                }

                resolvedResponse = resolveResponse(found, mapped);
                callback.call(self, show(resolvedResponse));
            });

            this.hide = function() {
                nodeListFound.hide();
            };

        }
    });

})(esPhinx, esPhinx.ui);
