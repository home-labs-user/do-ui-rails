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
                ConstructorReference = $module.panels.autocomplete.new,
                self = this,
                created = false,

                composeName = function (composedArr, node) {
                    var
                        copy = $(node).clone(),

                        iteratorBlock = function (v) {
                            copy.append(v);
                        };

                    composedArr.forEach(iteratorBlock);

                    return copy;
                },

                // composeMatch = function (spanizedList, nodeText, wordList) {
                composeMatch = function (data, spanizedList) {
                    var
                        leftUnitName,
                        rightUnitName,
                        searchIndex,
                        sliceFound,
                        span,
                        composedArr = [],

                        iteratorBlock = function (value, i) {
                            if (spanizedList.hasOwnProperty(i)) {
                                span = spanizedList[i];
                                sliceFound = span.text();
                                searchIndex = value.search(sliceFound);
                                leftUnitName = value.slice(0, searchIndex);
                                rightUnitName = value
                                    .slice(searchIndex + sliceFound.length,
                                        value.length);

                                if (leftUnitName.filled()) {
                                    composedArr.push(window.document
                                        .createTextNode(leftUnitName));
                                } else {
                                    span.text(span.text());
                                }

                                composedArr.push(span.asNode());

                                if (rightUnitName.filled()) {
                                    composedArr.push(window.document
                                        .createTextNode(rightUnitName));
                                }
                            } else {
                                composedArr.push(window.document
                                    .createTextNode(value));
                            }

                        };

                    wordList.spaceOut().forEach(iteratorBlock);

                    debugger
                    return composedArr;
                },

                // spanize = function (map) {
                spanize = function (data) {

                    var
                        spanizedList = [],

                        // iteratorBlock = function (i) {
                        iteratorBlock = function (map) {
                            // debugger
                            var
                                spanizedSliceFound = $(map.researchedSlice.span());
                            // spanizedSliceFound = $(mapped[i].span());
                            spanizedSliceFound.addClass(CSS_CLASS + " slice-found");

                            // data.

                            // mapped[i] = spanizedSliceFound;
                            spanizedList.push(spanizedSliceFound);
                        };

                        // mapped = map;

                    // Object.keys(map).forEach(iteratorBlock);
                    // debugger
                    data.mapping.forEach(iteratorBlock);
                    // Object.keys(map).forEach(iteratorBlock);

                    // return map;
                    return spanizedList;
                },

                // resolveResponse = function (found, maps) {
                resolveResponse = function(found) {
                    var
                        composed,
                        text,
                        // nodeTextAsArr,
                        spanizedList,
                        resolved = $(),

                        callback = function(data, i) {
                            // nodeText = $(node).text().trim();
                            text = $(data.element).text().trim();
                            // nodeTextAsArr = nodeText.split(" ");
                            // mapped = spanize(maps[i]);
                            spanizedList = spanize(data);
                            // debugger
                            // composed = composeMatch(spanizedList, text,
                            //     nodeTextAsArr);
                            composed = composeMatch(data, spanizedList);
                            // resolved.concat(true, composeName(composed, node));
                        };

                    // found.each(callback);
                    found.forEach(callback);

                    return resolved;
                },

                show = function (autocompletedList) {
                    var
                        callback = function (li) {
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
                };

            if (!(this instanceof ConstructorReference)) {
                return new ConstructorReference(searchTextBox, originalList,
                                                options, callback);
            }

            if (Object.belongToClass(originalList, Object)) {
                referenceElement = searchTextBox;
                callback = options;
                options = originalList;
            } else {
                referenceElement = originalList;
            }

            searchTextBox.autocomplete(originalList, options,
                // function (found, mapped) {
                function(found) {

                var
                    resolvedResponse;

                if (!created) {
                    created = true;

                    nodeListFound = create(referenceElement);
                }

                if (typeof callback == "function") {
                    callback = function() {};
                }
                debugger
                // resolvedResponse = resolveResponse(found, mapped);
                resolvedResponse = resolveResponse(found);
                callback.call(self, show(resolvedResponse));
            });

            this.hide = function() {
                nodeListFound.hide();
            };

        }
    });

})(esPhinx, esPhinx.ui);
