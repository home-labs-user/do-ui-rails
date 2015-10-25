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
            xhr,
            jqObj;

        if (params instanceof jQuery) {
            jqObj = params;

            self.on("keyup", function (e) {
                jqObj.each(function (i, domObj) {
                    // overvar essa linha
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
                // talvez será interessante testar se callback é typeof function
                callback($(found), e);
                found = [];
            });
                        
        // isso é só uma ponte para o objeto ajax
        // fazer uma consulta no banco pela primeira letra, e parsear os que vierem para serem tratados pelo autocomplete do script
        } //else if (params instanceof Object) {
            /*// usar recursividade aqui
            $("input").on "keypress", (e) ->    
                self = $(this)
                ajax = DO.ajax
                evt = e

                if self.val().length == 1
                    e.preventDefault()            

                    # fazer a consulta inicial por determinada quantidade de caracteres
                xhr = ajax.get
                    url: "/ajax/autocomplete"
                    sendData: q: self.val()
                    readyStateChange: (xhr) ->
                        console.log "Content-Type: #{xhr.getResponseHeader('Content-Type')}"

                .done (r) ->
                    console.log r

                    self.off "keypress"

                    self.on "keyup", (e) ->
                        console.log e.keyCode
                        
            ajax = DO.ajax;

            if (!params.format) {
                params.format = "html";
            }
            
            if (!params.readyStateChange) {
                params.readyStateChange = null;
            }
            
            xhr = ajax.get({
                url: params.url,
                urlParams: { format: params.format},
                readyStateChange: params.readyStateChange
            }).done(function (r) {
                callback(r);
            });*/
        //}


    };
    
}(jQuery));
