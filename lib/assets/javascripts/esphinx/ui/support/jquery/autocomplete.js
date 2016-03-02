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

            // spanize = function (obj, remainingLeftUnsought, sliceFound, remainingRightUnsought) {
            //     var

            // },

            resolveAnswer = function (obj, order) {
                var
                    countFound = 0,
                    hashSpanized = {},
                    found = [],
                    arrTextBoxContent = [],
                    copy,
                    arrDomObjText,
                    index,
                    remainingFullTextUnit,
                    unitName,
                    leftUnitName,
                    rightUnitName,
                    domObjText,
                    searchIndex,
                    sliceFound,
                    remainingLeftUnsought,
                    spanizedSliceFound,
                    tagName,
                    tempArr,
                    tempI,
                    i;

                if (!order) {
                    order = "asc";
                }
                order = order.toLocaleLowerCase();

                tagName = obj.prop("tagName").toLowerCase();
                if (tagName === "li") {
                    obj.sortByTextContent(order).each(function (i, domObj) {
                        domObjText = domObj.textContent.trim();
                        arrTextBoxContent = self.val().toLowerCase().trim()
                            .split(" ");
                        arrDomObjText = domObjText.split(" ");
                        copy = $(domObj.cloneNode());
                        tempArr = arrDomObjText.copyWithin();

                        // dance:
                        for (i in arrTextBoxContent) {
                            if (arrTextBoxContent.hasOwnProperty(i)) {

                                // Iterar com o for in (para fazer break) e quando encontrar (com o serach) num item fazer shift para removê-lo do array para que na próxima iteração ele não seja testado.

                                searchIndex = domObjText.toLowerCase()
                                    .search(arrTextBoxContent[i].toLowerCase()
                                        .trim());

                                if (searchIndex !== -1) {
                                    tempI = 0;
                                    // usar while já que esse segundo não tem break
                                    while (true) {
                                        // está ultrapassando o limite do array
                                        searchIndex = tempArr[tempI]
                                            .toLowerCase().trim()
                                                .search(arrTextBoxContent[i]
                                                    .trim());
                                        if (searchIndex !== -1) {
                                            countFound += 1;
                                            tempArr.shift();
                                            tempI += 1;
                                            console.log();
                                            // remainingLeftUnsought = domObjText
                                            //     .slice(0, searchIndex);

                                            // sliceFound = domObjText.slice(
                                            //     remainingLeftUnsought.length,
                                            //     remainingLeftUnsought.length +
                                            //     arrTextBoxContent[i].length
                                            // );

                                            // spanizedSliceFound = $("<span></span>");
                                            // spanizedSliceFound
                                            //     .addClass(MODULE_CSS + "-slice-found");

                                            // console.log('');
                                            // spanizedSliceFound.text(sliceFound);

                                            // hashSpanized[searchIndex] = spanizedSliceFound;
                                        }

                                        if (!tempArr.length) {
                                            break;
                                        }
                                    }
                                } else {
                                    break;
                                }

                            }
                        }

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

                        //         index = arrDomObjText
                        //             .indexOf(unitName);

                        //         if (leftUnitName.present()) {
                        //             arrDomObjText[index] = leftUnitName;
                        //             index += 1;
                        //             arrDomObjText
                        //                 .splice(index, 0,
                        //                     spanizedSliceFound.get(0));
                        //             index += 1;
                        //         } else {
                        //             arrDomObjText[index] = spanizedSliceFound
                        //                 .get(0);
                        //             index += 1;
                        //         }

                        //         if (rightUnitName.present()) {
                        //             arrDomObjText
                        //                 .splice(index, 0,
                        //                     rightUnitName);
                        //         }

                        //     });
                        //     console.log('')
                        //     // descobrir jeito de inserir espaços
                        //     // arrDomObjText.forEach(function (value) {
                        //     //     console.log('')
                        //     //     copy.append(value);
                        //     // });
                        //     // found.push(copy.get(0));
                        // }

                        tempArr = [];
                        arrTextBoxContent = [];
                        countFound = 0;
                        hashSpanized = {};
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
