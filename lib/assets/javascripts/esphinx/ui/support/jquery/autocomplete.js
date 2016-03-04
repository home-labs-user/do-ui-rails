//= require esphinx/support/jquery
//= require esphinx/support/ajax
//= require esphinx/support/string

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
            arrDomObjText,
            domObjText,

            composeName = function () {

            },

            spanize = function (sliceFound) {
                var
                    spanizedSliceFound;
                    // remainingFullTextUnit,
                    // remainingLeftUnsought,
                    // remainingRightUnsought;
                    // unitName,
                    // leftUnitName,
                    // rightUnitName,

                // remainingLeftUnsought = text.copyUntil(" ", index)

                spanizedSliceFound = $("<span></span>");
                spanizedSliceFound
                    .addClass(MODULE_CSS + "-slice-found");

                spanizedSliceFound.text(sliceFound);

                return spanizedSliceFound;
            },

            composeMatch = function () {
                // if (countFound === arrTextBoxContent.length) {
                //     // composeMatch
                //     hashSpanized.eachAttrs(function (value, key) {
                //         unitName = domObjText
                //             .copyUntil(" ", key, true);
                //         leftUnitName = domObjText
                //             .leftCopyUntil(" ", key -1);
                //         rightUnitName = domObjText
                //             .copyUntil(" ", key + spanizedSliceFound
                //                 .get(0).textContent.length);

                //         i = arrDomObjText
                //             .indexOf(unitName);

                //         if (leftUnitName.present()) {
                //             arrDomObjText[i] = leftUnitName;
                //             i += 1;
                //             arrDomObjText
                //                 .splice(i, 0,
                //                     spanizedSliceFound.get(0));
                //             i += 1;
                //         } else {
                //             arrDomObjText[i] = spanizedSliceFound
                //                 .get(0);
                //             i += 1;
                //         }

                //         if (rightUnitName.present()) {
                //             arrDomObjText
                //                 .splice(i, 0,
                //                     rightUnitName);
                //         }
                //     });
            },

            decomposeName = function (domObj, textBox) {
                var
                    textBoxContent = textBox.val(),
                    arrTextBoxContent = textBoxContent.toLowerCase().trim()
                        .split(" "),
                    hashSpanized = {},
                    tempArr,
                    searchIndex,
                    tempSearchIndex,
                    i,
                    tempI,
                    unitName,
                    index;

                domObjText = domObj.textContent.trim();
                arrDomObjText = domObjText.split(" ");
                tempArr = arrDomObjText.copy();

                for (i in arrTextBoxContent) {
                    if (arrTextBoxContent.hasOwnProperty(i)) {

                        searchIndex = domObjText.toLowerCase()
                            .search(arrTextBoxContent[i].toLowerCase()
                                .trim());

                        if (searchIndex !== -1) {
                            tempI = 0;
                            while (true) {
                                if (tempArr.length) {
                                    tempSearchIndex = tempArr[tempI]
                                        .toLowerCase().trim().search(
                                            arrTextBoxContent[i]
                                                .trim());

                                    if (tempSearchIndex !== -1) {
                                        tempArr.delete(tempI);

                                        unitName = domObjText.copyUntil(" ", searchIndex, true)

                                        index = arrDomObjText
                                            .indexOf(unitName);

                                        hashSpanized[index] = spanize(arrTextBoxContent[i]);
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

                if (hashSpanized.size() === arrTextBoxContent.length) {
                    return hashSpanized;
                }
            },

            resolveAnswer = function (obj, order) {
                var
                    found = [],
                    copy,
                    tagName,
                    decomposed;

                if (!order) {
                    order = "asc";
                }
                order = order.toLocaleLowerCase();

                tagName = obj.prop("tagName").toLowerCase();
                if (tagName === "li") {
                    obj.sortByTextContent(order).each(function (i, domObj) {
                        decomposed = decomposeName(domObj, self);
                        // composeName();
                        // saporra está adicionando somente um no hash, Por quê?
                        console.log();

                        // copy = $(domObj.cloneNode());

                        // composeName
                        //     console.log('')
                        //     // descobrir jeito de inserir espaços
                        //     // arrDomObjText.forEach(function (value) {
                        //     //     console.log('')
                        //     //     copy.append(value);
                        //     // });
                        //     // found.push(copy.get(0));
                        // }
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
