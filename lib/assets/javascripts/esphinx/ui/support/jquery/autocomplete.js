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
            amountChar,
            ajax = Ajax,
            domContent,
            domContentArr,

            wordOfName = function (key) {
                return domContent.copyUntil(" ", key, true);
            },

            spacingWords = function (arr) {
                var
                    i = 0;

                while (true) {
                    if (i < arr.length -1) {
                        arr[i] = arr[i] + " ";
                        i += 1;
                    } else {
                        break;
                    }
                }

            },

            hasRightSpace = function (str) {
                var
                    searchIndex,
                    unitName,
                    last;

                if (str instanceof HTMLElement) {
                    searchIndex = domContent.toLowerCase().trim()
                        .search(str.textContent.toLowerCase());
                    last = searchIndex + str.textContent.length;
                    unitName = wordOfName(searchIndex).toLowerCase();
                    // if (str.textContent === unitName &&
                    //     domContent[last] === " ") {
                    if (domContent[last] === " ") {
                        return true;
                    }
                } else {
                    searchIndex = domContent.toLowerCase().trim()
                        .search(str.toLowerCase());
                    last = searchIndex + str.length;
                    unitName = wordOfName(searchIndex).toLowerCase();
                    if (domContent[last] === " " ||
                        str.toLowerCase() === unitName) {
                    // if (domContent[last] === " " ||
                    //     (str.toLowerCase() === unitName && last !== domContent.length)) {
                        return true;
                    }
                }

                return false;
            },

            composeName = function (composedArr, domObj) {
                var
                    copy = $(domObj.cloneNode()),
                    content;

                composedArr.forEach(function (v) {
                    copy.append(v);

                    // if (hasRightSpace(v)) {
                    //     copy.append(" ");
                    // }
                });

                return copy;
            },

            capitalizeIf = function (str) {
                var
                    searchIndex;

                searchIndex = domContent.toLowerCase().trim().search(str);

                if ([searchIndex-1].present) {
                    return str.capitalize();
                } else {
                    return str;
                }
            },

            composeMatch = function (hash) {
                var
                    composedArr = domContentArr.copy(),
                    unitName,
                    leftUnitName,
                    rightUnitName,
                    i;

                hash.eachAttrs(function (value, key) {
                    value = value.get(0);
                    unitName = wordOfName(key);
                    leftUnitName = domContent.leftCopyUntil(" ", key -1);
                    rightUnitName = domContent.copyUntil(" ", key + value
                        .textContent.length);

                    i = composedArr.indexOf(unitName);

                    value.textContent = capitalizeIf(value.textContent);
                    // implementar rotina para inserir espaço
                    if (leftUnitName.present()) {
                        composedArr[i] = capitalizeIf(leftUnitName);
                        i += 1;
                        composedArr.splice(i, 0, value);
                        i += 1;
                    } else {
                        composedArr[i] = value;
                        i += 1;
                    }

                    if (rightUnitName.present()) {
                        composedArr.splice(i, 0, rightUnitName);
                    }
                });

                return composedArr;
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

            map = function (domObj, textBox) {
                var
                    textBoxContent = textBox.val(),
                    textBoxContentArr = textBoxContent.toLowerCase().trim()
                        .split(" "),
                    hashSpanized = {},
                    tempArr,
                    searchIndex,
                    i,
                    tempSearchIndex,
                    tempI,
                    unitName,
                    index;

                domContent = domObj.textContent.trim();
                domContentArr = domContent.split(" ");
                spacingWords(domContentArr);
                tempArr = domContentArr.copy();

                for (i in textBoxContentArr) {
                    if (textBoxContentArr.hasOwnProperty(i)) {

                        searchIndex = domContent.toLowerCase()
                            .search(textBoxContentArr[i].toLowerCase()
                                .trim());

                        if (searchIndex !== -1) {
                            tempI = 0;
                            while (true) {
                                if (tempArr.length) {
                                    tempSearchIndex = tempArr[tempI]
                                        .toLowerCase().trim().search(
                                            textBoxContentArr[i]
                                                .trim());

                                    if (tempSearchIndex !== -1) {
                                        tempArr.delete(tempI);

                                        unitName = domContent.copyUntil(" ", searchIndex, true);

                                        index = domContentArr
                                            .indexOf(unitName);

                                        // para mapear mais de um deve-se informar um array de índices e fazer um novo indexOf para o array
                                        // hashSpanized[index] = spanize(textBoxContentArr[i]);

                                        hashSpanized[searchIndex] = spanize(textBoxContentArr[i]);
                                    } else {
                                        tempI += 1;
                                    }
                                }

                                if (tempArr.length === tempI) {
                                    break;
                                }
                            }
                        } else {
                            break;
                        }

                    }
                }

                if (hashSpanized.size() === textBoxContentArr.length) {
                    return hashSpanized;
                }

                return false;
            },

            resolveAnswer = function (obj, order) {
                var
                    found = [],
                    tagName,
                    decomposed,
                    composed;

                if (!order) {
                    order = "asc";
                }
                order = order.toLocaleLowerCase();

                tagName = obj.prop("tagName").toLowerCase();
                if (tagName === "li") {
                    obj.sortByTextContent(order).each(function (i, domObj) {
                        decomposed = map(domObj, self);
                        if (decomposed) {
                            composed = composeMatch(decomposed);
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
