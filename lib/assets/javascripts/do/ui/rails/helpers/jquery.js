var
    jQuery = jQuery,
    DO = DO;

(function ($) {
    "use strict";

	$.fn.autocomplete = function (params, callback) {

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
            ajax,
            xhr;

        if (params instanceof jQuery) {
            params.each(function (i, domObj) {

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

                    found.unshift(copyng);
                }
            });

            callback($(found));
        } else if (params instanceof Object) {
            ajax = DO.ajax;

            xhr = ajax.get({
                url: params.url,
                urlParams: { format: params.format},
                readyStateChange: function (xhr) {
                    callback(xhr);
                }
            }).done(function (r) {
                callback(r);
            });
        }


    };
}(jQuery));
