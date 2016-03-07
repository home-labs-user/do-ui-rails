//= require esphinx/support/jquery
//= require esphinx/support/ajax
//= require esphinx/support/string
//= require esphinx/support/array

"use strict";

var
    jQuery,
    Ajax;

const
    MODULE_CSS = "esphinx-ui";

(function ($) {

    $.prototype.autocomplete = function (obj, args, callback) {
        var
            self = $(this),
            ajax = Ajax,
            hashSpanized,
            amountChar,
            domContentArr,
            // domContent,
            // matchFoundArr,

            matches = function (textBoxContentArr, contentArr) {
                // var
                //     i = 0;
                //     // count = 0,

                // while (true) {
                //     if (domContentArr.indexOf(textBoxContentArr[i])) {
                //         // count += 1;
                //         i += 1;
                //     }

                //     if (i === domContentArr.length ||
                //         (i + 1) === textBoxContentArr.length) {
                //         break;
                //     }

                // }

                // // if (count === textBoxContentArr.length) {
                // if (i === textBoxContentArr.length) {
                //     return domContentArr;
                // }
            },

            map = function (textBoxContentArr, domObj) {
                var
                    count = 0,
                    tempI = 0,
                    tempArr,
                    searchIndex,
                    i,
                    tempSearchIndex,
                    tempI,
                    index,
                    matchArr,
                    domContent;


                domContent = domObj.textContent.toLowerCase().trim();
                // domContentArr = domContent.split(" ");
                domContentArr = domContent.toLowerCase().trim().split(" ");
                // debugger
                if (matches(textBoxContentArr, domContentArray)) {
                    hashSpanized = {};
                    // spacingWords(domContentArr);
                    tempArr = domContentArr.copy();
                    // matchArr = spacingWords(matchArr);
                    // matchFoundArr = domContentArr.copy();


                    // tempArr = domContentArr.copy();

                    for (i in textBoxContentArr) {
                        if (textBoxContentArr.hasOwnProperty(i)) {

                            // searchIndex = domContent
                            //     .search(textBoxContentArr[i].toLowerCase()
                            //         .trim());

                            // if (searchIndex !== -1) {
                            //     tempI = 0;

                                // count += 1;
                                // index = domContentArr
                                //     .indexOf(tempArr[tempI]);
                                // hashSpanized[index] = spanize(textBoxContentArr[i]);
                                // tempArr.delete(tempI);

                                while (true) {
                                    if (tempArr.length) {
                                        tempSearchIndex = tempArr[tempI]
                                            .toLowerCase().trim().search(
                                                textBoxContentArr[i]
                                                    .trim());

                                        if (tempSearchIndex !== -1) {
                                            count += 1;
                                            index = domContentArr
                                                .indexOf(tempArr[tempI]);
                                            hashSpanized[index] = spanize(textBoxContentArr[i]);

                                            tempArr.delete(tempI);
                                        } else {
                                            tempI += 1;
                                        }
                                    }

                                    if (tempArr.length === tempI) {
                                        break;
                                    }
                                }
                            // }
                            // else {
                            //     break;
                            // }

                        }
                    }

                    return hashSpanized;
                }
                // if (count >= textBoxContentArr.length) {
                //     matchFoundArr = domContentArr.copy();
                //     return hashSpanized;
                // }

                return false;
            },

            composeMatch = function (hashSpanized) {
                var
                    composedArr = [],
                    leftUnitName,
                    rightUnitName,
                    searchIndex,
                    sliceFound,
                    itemAsLower,
                    domObj;

                spacingWords(domContentArr).eachAttrs(function (value, i) {
                    if (hashSpanized.hasOwnProperty(i)) {
                        domObj = hashSpanized[i].get(0);
                        itemAsLower = value.toLowerCase();
                        sliceFound = domObj.textContent;
                        searchIndex = itemAsLower.search(sliceFound);
                        leftUnitName = itemAsLower.slice(0, searchIndex);
                        rightUnitName = itemAsLower.slice(searchIndex + sliceFound.length, itemAsLower.length);

                        if (leftUnitName.present()) {
                            composedArr.push(capitalizeIf(leftUnitName));
                        } else {
                            domObj.textContent = capitalizeIf(domObj
                                .textContent);
                        }

                        composedArr.push(domObj);

                        if (rightUnitName.present()) {
                            composedArr.push(rightUnitName);
                        }
                    } else {
                        composedArr.push(value);
                    }

                });

                return composedArr;
            },

            composeName = function (composedArr, domObj) {
                var
                    copy = $(domObj.cloneNode());

                composedArr.forEach(function (v) {
                    copy.append(v);
                });

                return copy;
            },

            capitalizeIf = function (str) {
                var
                    searchIndex;

                searchIndex = domContent.toLowerCase().trim().search(str);

                if (![searchIndex-1].present) {
                    return str.capitalize();
                } else {
                    return str;
                }
            },

            spanize = function (sliceFound) {
                var
                    spanizedSliceFound;

                spanizedSliceFound = $("<span></span>");
                spanizedSliceFound
                    .addClass(MODULE_CSS + "-slice-found");

                spanizedSliceFound.text(sliceFound);

                return spanizedSliceFound;
            },

            resolveAnswer = function (obj, order) {
                var
                    found = [],
                    tagName,
                    mapped,
                    composed;

                if (!order) {
                    order = "asc";
                }
                order = order.toLocaleLowerCase();

                tagName = obj.prop("tagName").toLowerCase();

                if (tagName === "li") {
                    obj.sortByTextContent(order).each(function (i, domObj) {
                        mapped = map(self.val().toLowerCase().trim()
                    .split(" "), domObj);
                        if (mapped) {
                            composed = composeMatch(mapped);
                            found.push(composeName(composed, domObj));
                        }

                    });
                }

                // caso necessário, usar recursividade para reenviar formatado
                // como li
                return $(found);
            },

            // wordOfName = function (key) {
            //     return domContent.copyUntil(" ", key, true);
            // },

            spacingWords = function (arr) {
                var
                    i = 0,
                    content = domContent.toLowerCase().trim(),
                    lastName = domContentArr[domContentArr.length -1]
                        .toLowerCase(),
                    lastNameIndex = content.search(lastName),
                    copy = arr.copy();

                while (true) {
                    if (i < copy.length -1) {
                        copy[i] = copy[i] + " ";
                        i += 1;
                    } else {
                        if (content.search(copy[i].toLowerCase()) !==
                            lastNameIndex) {
                            copy[i] = copy[i] + " ";
                        }
                        break;
                    }
                }

                return copy;

            },

            resolveAmountChar = function () {
                if (args.afterAmountChar) {
                    amountChar = args.afterAmountChar;
                } else {
                    amountChar = 1;
                }
            },

            unsetKeyUpEvent = function () {
                self.off("keyup");
            },

            offlineSearch = function () {
                unsetKeyUpEvent();
                resolveAmountChar();

                self.on("keyup", function (e) {

                    if (self.val()) {
                        if (self.val().length >= amountChar) {
                            callback(resolveAnswer(obj, args.order), e);
                        }
                    } else {
                        callback([], e);
                    }
                });
            },

            remoteSearch = function () {
                var
                    jqObj;

                unsetKeyUpEvent();
                resolveAmountChar();

                self.on("keyup", function (e) {
                    if (self.val().length === amountChar) {
                        args.remote.query(e, function (q) {
                            ajax({
                                url: args.remote.url,
                                params: q
                            })
                            .processing(function (xhr) {
                                if (args.remote.processing) {
                                    args.remote.processing(xhr, e);
                                }
                                $(e.target).on("keypress", function (e) {
                                    e.preventDefault();
                                });
                            })
                            .done(function (a) {
                                $(e.target).off("keypress");
                                jqObj = $(a).find("li");
                                callback(resolveAnswer(jqObj, args.order), e);
                                if (jqObj.length) {
                                    self.autocomplete(jqObj, args, callback);
                                }
                            });
                        });
                    }
                });
            };

        // init
        if (obj instanceof jQuery) {
            offlineSearch();
        } else if (obj instanceof Object) {
            callback = args;
            args = obj;

            remoteSearch();
        }
    };

})(jQuery);
