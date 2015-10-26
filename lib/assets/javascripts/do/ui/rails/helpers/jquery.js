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
                callback(e, $(found));
                found = [];
            });
                        
        // isso é só uma ponte para o objeto ajax
        // fazer uma consulta no banco pela primeira letra, e parsear os que vierem para serem tratados pelo autocomplete do script
        } else if (params instanceof Object) {
            // usar recursividade aqui, juntamente com singleton para salvar o objetos
            // caso não fique tão legível, pode-se fazer um outro método só para fazer query e depois usar o método autocomplete
            // tentar usar tudo em autocomplete é importante por causa do controle dos eventos
            // outra coisa que pode ser usada é um método específico "done" para ser usado somente em requisições remotas. Ele deverá
            // carregar os metodos processados nos eventos keypress, e poderá através de um método callback, recursivamente chamar-se
            // a si para processar o que outrora o servidor enviou
            ajax = DO.ajax;
            
            self.on("keypress", function (e) {

                if (self.val().length === 1) {
                    e.preventDefault();

                    // fazer a consulta inicial por determinada quantidade de caracteres
                    xhr = ajax.get({
                        url: "/ajax/autocomplete",
                        sendData: {
                            q: self.val()
                        },
                        readyStateChange: function (xhr) {
                            //console.log("Content-Type: #{xhr.getResponseHeader('Content-Type')}");
                        }

                    }).done(function (r) {
                        self.off("keypress");
                        callback(e, $(r));
                    });
                    
                // o if deve estar aqui ou no carai do metodo que chama isso aqui?
                } /*else if (self.val().length > 1) {
                    //self.autocomplete(, function (e, found) {
                        
                    //});
                }*/
            });

        }

}(jQuery));
