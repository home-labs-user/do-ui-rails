//= require jquery
//= require esphinx/support/jquery
//= require esphinx/support/ajax

"use strict";

var
    jQuery,
    Ajax;

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
            ajax = Ajax,

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
            },

            localSearch = function () {

                unsetKeyUpEvent();

                resolveAmountChar();

                self.on("keyup", function (e) {
                    // debugger
                    if (self.val()) {
                        if (self.val().length >= amountChar) {
                            callback(resolveAnswer(obj, args.order), e);
                        }
                    } else {
                        // ver se essa linha é necessária
                        callback([], e);
                        remoteSearch();
                    }
                });
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

        // init
        if (obj instanceof jQuery) {
            localSearch();
        } else if (obj instanceof Object) {
            callback = args;
            args = obj;

            remoteSearch();
        }
    };

})(jQuery);
