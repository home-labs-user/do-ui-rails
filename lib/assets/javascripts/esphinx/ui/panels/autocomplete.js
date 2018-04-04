var
    esPhinx;


(function ($, $module) {
    "use strict";

    var
        CSS_CLASS = "esphinx ui",
        CSS_CLASS_QUERY = "." + CSS_CLASS.replace(/ +/g, ".");

    $module.extend({
        panels: { autocomplete: {} }
    });

    $.Extender.extend($module.panels.autocomplete, true, {
        // new: function(searchTextBox, originalList, options = {}, callback) {
        new: function (searchTextBox, originalList, options, callback) {
            var
                nodeListFound,
                referenceElement,
                ConstructorReference = $module.panels.autocomplete.new,
                self = this,
                created = false,

                compose = function (compositionList, node) {

                    var
                        copy = $(node).clone(),

                        iteratorBlock = function (v) {
                            copy.append(v);
                        };

                    compositionList.forEach(iteratorBlock);

                    return copy;
                },

                extractSlice = function (word, map) {
                    return word.slice(
                        map.wordSliceIndex,
                        map.wordSliceIndex + map.researchedSlice.length
                    );
                },

                composeMatch = function (data, spanMap) {
                    var
                        leftUnitName,
                        rightUnitName,
                        sliceFound,
                        span,
                        compositionList = [],

                        iteratorBlock = function (word, i) {
                            var
                                map;

                            if (data.mapping.hasOwnProperty(i)) {
                                map = data.mapping[i];
                                span = spanMap[i];

                                sliceFound = extractSlice(word, map);
                                leftUnitName = word.slice(0,
                                    map.wordSliceIndex);
                                rightUnitName = word.slice(
                                    leftUnitName.length +
                                    map.researchedSlice.length,
                                    word.length);

                                if (leftUnitName.filled()) {
                                    compositionList.push(window.document
                                        .createTextNode(leftUnitName));
                                }

                                compositionList.push(span.asNode());

                                if (rightUnitName.filled()) {
                                    compositionList.push(window.document
                                        .createTextNode(rightUnitName));
                                }
                            } else {
                                compositionList.push(window.document
                                    .createTextNode(word));
                            }

                        };

                    if (data.wordList) {
                        data.wordList.spaceOut().forEach(iteratorBlock);
                    }

                    return compositionList;
                },

                spanize = function (data) {

                    var
                        spanizedMap = {},

                        iteratorBlock = function (i) {
                            var
                                map = data.mapping[i],
                                spanizedSliceFound = $(
                                    extractSlice(data.wordList[i], map).span()
                                );

                            spanizedSliceFound.addClass(CSS_CLASS +
                                " slice-found");

                            spanizedMap[i] = spanizedSliceFound;
                        };

                    if (data.mapping) {
                        Object.keys(data.mapping).forEach(iteratorBlock);
                    }

                    return spanizedMap;
                },

                resolveResponse = function (found) {
                    var
                        composed,
                        text,
                        resolved = $(),

                        callback = function (data, i) {
                            text = $(data.element).text().trim();
                            // debugger
                            composed = composeMatch(data, spanize(data));
                            resolved.concat(true, compose(composed,
                                data.element));
                        };

                    found.forEach(callback);

                    return resolved;
                },

                show = function (autocompletedList) {
                    var
                        callback = function (li) {
                            nodeListFound.append(li);
                        };

                    nodeListFound.clean();

                    if (searchTextBox.value()) {
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

                create = function (referenceElement) {
                    var
                        nodeListFound = $("<ol></ol>")
                            .addClass(CSS_CLASS + " list-built-found"),
                        width,
                        borderBottom,
                        border,
                        marginBottom,

                        hitTarget = function (target) {
                            return target.is(nodeListFound.childElements()) ||
                                target.is(referenceElement);
                        };

                    if (referenceElement.isA(window.HTMLInputElement)) {

                        referenceElement.on("focus", function () {
                            if (nodeListFound.childElements().some()) {
                                nodeListFound.show();
                            }
                        });

                        referenceElement.on("blur", function (e) {
                            if (e.relatedTarget) {
                                if (!$(e.relatedTarget).is(nodeListFound)) {
                                    self.hide();
                                }
                            }

                        });

                        // clicking outside the panel
                        $(window.document).on("mouseup", function (e) {
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
                        // nodeListFound.css("margin-top", `${-marginBottom} px`);

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
                return new ConstructorReference(searchTextBox,
                    originalList,
                    options,
                    callback);
            }

            if (Object.belongsToClass(originalList, Object)) {
                referenceElement = searchTextBox;
                callback = options;
                options = originalList;
            } else {
                referenceElement = originalList;
            }

            searchTextBox.autocomplete(originalList, options,
                function (found) {

                    var
                        resolvedResponse;

                    if (!created) {
                        created = true;

                        nodeListFound = create(referenceElement);
                    }

                    if (typeof callback !== "function") {
                        callback = function () { };
                    }

                    resolvedResponse = resolveResponse(found);
                    callback.call(self, show(resolvedResponse));
                });

            this.hide = function () {
                nodeListFound.hide();
            };

        }
    });

})(esPhinx, esPhinx.ui);
