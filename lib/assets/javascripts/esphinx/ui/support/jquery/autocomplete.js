//= require esphinx/support/jquery
//= require esphinx/support/ajax

var
    jQuery,
    Ajax;

const
    MODULE_CSS = 'esphinx-ui';


(function ($) {
    "use strict";

    $.prototype.autocomplete = function (obj, args, callback) {
        var
            found = [],
            self = $(this),
            domObjText,
            searchIndex,
            remainingLeftUnsought,
            remainingRightUnsought,
            sliceFound,
            spanSliceFound,
            copy,
            jqObj,
            amountChar,
            tagName,
            ajax = Ajax,

            spanize = function (obj, remainingLeftUnsought, sliceFound, remainingRightUnsought) {
                var
                    spanSliceFound;

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

            resolveAnswer = function (obj, order) {
                var
                    arrDomObjText;

                if (!order) {
                    order = "asc";
                }
                order = order.toLocaleLowerCase();

                found = [];
                tagName = obj.prop("tagName").toLowerCase();
                if (tagName === "li") {
                    obj.sortByTextContent(order).each(function (i, domObj) {
                        domObjText = domObj.textContent.trim();
                        arrDomObjText = self.val().trim().split(' ');

                        // as palavras não precisam mais baterem iguais, mas se ele não encontrar todas digitas num único texto, então não serve
                        // talvez o processo de spanizar deva ser feito num tempo futuro
                        for (i in arrDomObjText) {
                            if (arrDomObjText.hasOwnProperty(i)) {
                                searchIndex = domObjText.toLowerCase()
                                    // .search(self.val().toLowerCase());
                                    .search(arrDomObjText[i].toLowerCase());
                                if (searchIndex !== -1) {
                                    // remainingLeftUnsought = domObjText
                                    remainingLeftUnsought = arrDomObjText[i]
                                        .slice(0, searchIndex);

                                    // sliceFound = domObjText.slice(remainingLeftUnsought
                                    sliceFound = arrDomObjText[i].slice(
                                        remainingLeftUnsought.length,
                                        remainingLeftUnsought.length +
                                        self.val().length
                                    );

                                    // remainingRightUnsought = domObjText
                                    remainingRightUnsought = arrDomObjText[i]
                                        .slice(remainingLeftUnsought.length +
                                            // sliceFound.length, domObjText.length);
                                            sliceFound.length, arrDomObjText[i].length);

                                    spanSliceFound = $("<span></span>");

                                    // debugger
                                    // ele não pode fazer clone toda vez

                                    // copy = $(domObj.cloneNode());
                                    // copy.append(remainingLeftUnsought);
                                    // copy.append(spanSliceFound);
                                    // spanSliceFound.addClass(MODULE_CSS + "-slice-found");
                                    // spanSliceFound.text(sliceFound);
                                    // copy.append(remainingRightUnsought);

                                    // found.push(copy.get(0));
                                }
                            }
                            arrDomObjText = []
                        }
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
