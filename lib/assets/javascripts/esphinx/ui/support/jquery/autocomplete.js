//= require jquery
//= require esphinx/support/jquery
//= require esphinx/support/ajax

"use strict";

var
    jQuery;

(function ($) {

    $.prototype.autocomplete = function (obj, args, callback) {
        var
            found = [],
            self = $(this),
            domObjText,
            searchIndex,
            prevSliceTextNoSearch,
            sliceFound,
            remainderSliceTextNoSearch,
            spanSliceFound,
            copyng,
            jqObj,
            amountChar,
            tagName,

            respondTo = function (obj, order) {
                if (!order) {
                    order = "asc";
                }
                order = order.toLocaleLowerCase();

                found = [];
                tagName = obj.prop("tagName").toLowerCase();
                if (tagName === "li") {
                    obj.sortByTextContent(order).each(function (i, domObj) {
                        domObjText = domObj.textContent.trim();
                        searchIndex = domObjText.toLowerCase()
                            .search(self.val().toLowerCase());
                        if (searchIndex > -1) {

                            prevSliceTextNoSearch = domObjText
                                .slice(0, searchIndex);

                            sliceFound = domObjText.slice(prevSliceTextNoSearch
                                .length, prevSliceTextNoSearch.length +
                                    self.val().length);

                            remainderSliceTextNoSearch = domObjText
                                .slice(prevSliceTextNoSearch.length +
                                    sliceFound.length, domObjText.length);

                            spanSliceFound = $("<span></span>");

                            copyng = $(domObj.cloneNode());
                            copyng.append(prevSliceTextNoSearch);
                            copyng.append(spanSliceFound);
                            spanSliceFound.addClass("esphinx-ui-slice-found");
                            spanSliceFound.text(sliceFound);
                            copyng.append(remainderSliceTextNoSearch);

                            found.push(copyng.get(0));
                        }
                    });
                } // caso necessário, usar recursividade para reenviar formatado como li
                return $(found);
            };

        // debugger
        if (obj instanceof jQuery) {
            if (args.afterAmountChar) {
                amountChar = args.afterAmountChar;
            } else {
                amountChar = 1;
            }

            self.on("keyup", function (e) {
                if (self.val()) {
                    if (self.val().length >= amountChar) {
                        callback(respondTo(obj, args.order), e);
                    }
                } else {
                    callback([], e);
                }
            });
        } else if (obj instanceof Object) {
            // debugger
            callback = args;
            args = obj;

            if (args.afterAmountChar) {
                amountChar = args.afterAmountChar;
            } else {
                amountChar = 1;
            }

            // a consulta deve ser renovada se tudo que estiver na caixa de texto for apagado
            self.on("keyup", function (e) {
                if (self.val().length === amountChar) {
                    args.remote.query(e, function (q) {
                        Ajax({
                            url: args.remote.url,
                            params: q
                        })
                        .processing(function (xhr) {
                            if (args.remote.processing) {
                                args.remote.processing(xhr, e);
                            }
                            $(e.target).on("keypress", function (e) {
                                console.log("bla");
                                e.preventDefault();
                            });
                        })
                        .done(function (a) {
                            $(e.target).off("keypress");
                            jqObj = $(a).find("li");
                            callback(respondTo(jqObj, args.order), e);
                            self.off("keyup");
                            if (jqObj.length) {
                                self.autocomplete(jqObj, args, callback);
                            }
                        });
                    });
                }
            });
        }
    };

})(jQuery);
