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
            amountChar,

            composeMatch = function (mapped, content, domContentArr) {
                var
                    composedArr = [],
                    leftUnitName,
                    rightUnitName,
                    searchIndex,
                    sliceFound,
                    itemAsLower,
                    domObj;

                domContentArr.spaceOut().capitalize()
                    .eachAttrs(function (value, i) {
                    if (mapped.hasOwnProperty(i)) {
                        domObj = mapped[i].get(0);
                        itemAsLower = value.toLowerCase();
                        sliceFound = domObj.textContent;
                        searchIndex = itemAsLower.search(sliceFound);
                        leftUnitName = itemAsLower.slice(0, searchIndex);
                        rightUnitName = itemAsLower.slice(searchIndex + sliceFound.length, itemAsLower.length);

                        if (leftUnitName.present()) {
                            composedArr.push(capitalizeIf(leftUnitName, content));
                        } else {
                            domObj.textContent = capitalizeIf(domObj
                                .textContent, content);
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

            matches = function (textBoxContentArr, textContent) {
                var
                    i = 0,
                    count = 0,
                    searchIndex;

                while (true) {
                    searchIndex = textContent.search(textBoxContentArr[i]);
                    if (searchIndex !== -1) {
                        count += 1;
                    }

                    i += 1;
                    if (i === textBoxContentArr.length) {
                        break;
                    }

                }

                if (count === textBoxContentArr.length) {
                    return true;
                }

                return false;
            },

            map = function (textBoxObj, content, domContentArr) {
                var
                    textBoxContentArr = textBoxObj.val().toLowerCase().trim()
                        .split(" "),
                    tempI = 0,
                    tempArr,
                    searchIndex,
                    index,
                    mapped = {};

                if (matches(textBoxContentArr, content)) {
                    tempArr = domContentArr.copy();
                    textBoxContentArr.forEach(function (value) {
                        tempI = 0;

                        while (true) {
                            if (tempArr.length) {
                                searchIndex = tempArr[tempI].toLowerCase()
                                    .trim().search(value.trim());
                                if (searchIndex !== -1) {
                                    index = domContentArr
                                        .indexOf(tempArr[tempI]);
                                    mapped[index] = spanize(value);
                                    tempArr.delete(tempI);
                                } else {
                                    tempI += 1;
                                }
                            }

                            if (tempArr.length === tempI) {
                                break;
                            }
                        }
                    });

                    return mapped;
                }

                return false;
            },

            composeName = function (composedArr, domObj) {
                var
                    copy = $(domObj.cloneNode());

                composedArr.forEach(function (v) {
                    copy.append(v);
                });

                return copy;
            },

            capitalizeIf = function (word, content) {
                var
                    searchIndex;

                searchIndex = content.toLowerCase().trim().search(word);

                if (![searchIndex-1].present) {
                    return word.capitalize();
                } else {
                    return word;
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
                    composed,
                    domContent,
                    domContentArr;

                if (!order) {
                    order = "asc";
                }
                order = order.toLocaleLowerCase();

                tagName = obj.prop("tagName").toLowerCase();

                if (tagName === "li") {
                    obj.sortByTextContent(order).each(function (i, domObj) {
                        domContent = domObj.textContent.toLowerCase().trim();
                        domContentArr = domContent.split(" ");
                        mapped = map(self, domContent, domContentArr);
                        if (mapped) {
                            composed = composeMatch(mapped, domContent,
                                domContentArr);
                            found.push(composeName(composed, domObj));
                        }

                    });
                }

                // caso necessário, usar recursividade para reenviar formatado
                // como li
                return $(found);
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
