// verificar se o segundo parâmetro é instância de function

var
    jQuery = jQuery,
    DO = DO;

(function ($) {
    "use strict";

	$.fn.extend({
        /*
         * @obj = {}
        */
        autocomplete: function (obj, params, callback) {
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
                ajax,
                xhr,
                amountChar;

            // para fazer clone, testar se é uma coleção de lis, caso não seja, criar para devolver na coleção
            // permitir envio, junto ao callback um hash contento a chave order: e limit:
            if (obj instanceof jQuery) {
                jqObj = obj;

                self.on("keyup", function (e) {

                    jqObj.each(function (i, domObj) {

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
                            spanSliceFound.addClass("do-ui-slice-found");
                            spanSliceFound.text(sliceFound);
                            copyng.append(remainderSliceTextNoSearch);

                            // fazer push ao invés de unshift, tendo em vista não testar a cada iteração
                            found.push(copyng);
                        }
                    });

                    // testar order aqui

                    if (self.val()) {
                        callback(e, found);
                    } else {
                        callback(e, []);
                    }

                    found = [];
                });
            } else if (obj instanceof Object) {
                if (!obj.afterAmountChar) {
                    amountChar = 1;
                } else {
                    amountChar = obj.afterAmountChar;
                }
                self.on("keyup", function (e) {
                    if (self.val().length === amountChar) {
                        ajax = DO.ajax;
                        obj.query(e, function (q) {
                            ajax.get({
                                url: obj.url,
                                query: q,
                                readyStateChange: function (xhr) {
                                    $(e.target).off("keyup");
                                    $(e.target).on("keypress", function (e) {
                                        e.preventDefault();
                                        if (obj.process) {
                                            obj.process(xhr);
                                        }
                                    });
                                }
                            })
                            .done(function (a) {
                                $(e.target).off("keypress");
                                if (params instanceof Function) {
                                    self.autocomplete($(a), obj, params);
                                }
                            });
                        });
                    }
                });
            }
        }

    });

}(jQuery));
