var jQuery = jQuery;

(function ($) {
    "use strict";
    
	$.fn.autocomplete = function (jqObj, callback) {
        
        var
            found = [],
            self = $(this),
            domObjText,
            searchIndex,
            prevSliceTextNoSearch,
            sliceFound,
            remainderSliceTextNoSearch,
            spanSliceFound,
            copyng;
        
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
        callback($(found));
    };
 }(jQuery));
