//= require esphinx/support/jquery
//= require esphinx/support/ajax

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
            //         spanSliceFound;

            // },

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

            resolveAnswer = function (obj, order) {
                var
                    countFound = 0,
                    hashSpanized = {},
                    found = [],
                    arrTextBoxContent = [],
                    copy,
                    arrDomObjText,
                    index,
                    textContent,
                    domObjText,
                    searchIndex,
                    sliceFound,
                    remainingLeftUnsought,
                    spanizedSliceFound,
                    tagName;

                if (!order) {
                    order = "asc";
                }
                order = order.toLocaleLowerCase();

                tagName = obj.prop("tagName").toLowerCase();
                if (tagName === "li") {
                    obj.sortByTextContent(order).each(function (i, domObj) {
                        domObjText = domObj.textContent.trim();
                        arrTextBoxContent = self.val().trim().split(" ");
                        arrDomObjText = domObjText.split(" ");
                        copy = $(domObj.cloneNode());

                        for (i in arrTextBoxContent) {
                            if (arrTextBoxContent.hasOwnProperty(i)) {
                                searchIndex = domObjText.toLowerCase()
                                    .search(arrTextBoxContent[i].toLowerCase());
                                if (searchIndex !== -1) {
                                    countFound += 1;

                                    remainingLeftUnsought = domObjText
                                        .slice(0, searchIndex);

                                    sliceFound = domObjText.slice(
                                        remainingLeftUnsought.length,
                                        remainingLeftUnsought.length +
                                        arrTextBoxContent[i].length
                                    );

                                    spanizedSliceFound = $("<span></span>");
                                    spanizedSliceFound
                                        .addClass(MODULE_CSS + "-slice-found");
                                    spanizedSliceFound.text(sliceFound);

                                    hashSpanized[searchIndex] = spanizedSliceFound;
                                } else {
                                    break;
                                }
                            }
                        }

                        if (countFound === arrTextBoxContent.length) {
                            // composeMatch
                            hashSpanized.eachAttrs(function (value, key) {
                                textContent = domObjText.slice(key, domObjText.length).split(" ")[0].trim();
                                index = arrDomObjText
                                    .indexOf(textContent);
                                arrDomObjText[index] = value.get(0);
                            });

                            // removeRemainingRigth
                            arrDomObjText.reverse();
                            while (true) {
                                if (!(arrDomObjText[0] instanceof HTMLElement)) {
                                    arrDomObjText.shift();
                                } else {
                                    break;
                                }
                            }
                            arrDomObjText.reverse();
                            arrDomObjText.push(domObjText
                                .slice(searchIndex + arrDomObjText.last()
                                    .textContent.length, domObjText.length));

                            console.log('');
                            // iterar, fazer append e depois push
                            // copy.append();

                            // found.push(copy.get(0));
                        }

                        arrTextBoxContent = [];
                        countFound = 0;
                        hashSpanized = {};
                    });
                }

                // caso necessário, usar recursividade para reenviar formatado
                // como li
                return $(found);
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
