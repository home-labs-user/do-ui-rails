var
    jQuery = jQuery,
    DO = DO;

(function ($) {
    "use strict";

	$.fn.extend({
        /*
         * @params = {url, sendData, process}
        */
        autocomplete: function (params, callback) {
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
                xhr,
                jqObj,
                obj = {};

            if (params instanceof jQuery) {
                jqObj = params;

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

                            found.unshift(copyng);
                        }
                    });
                    
                    if (callback) {
                        if (callback instanceof Function) {
                            callback(e, found);
                        }
                    }
                    found = [];
                });
            } else if (params instanceof Object) {
                self.on("keypress", function (e) {
                    params.initRemoteQuery(e, function(a) {                       
                        if (a instanceof jQuery) {
                            self.off("keypress");
                            self.autocomplete(a, callback);                            
                        }
                    });
                });
            }
        }

    });

}(jQuery));
