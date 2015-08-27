jQuery.fn.buildSearchText = function () {
    "use strict";

    var
        searchBox = null
        ,searchTextBox = null
        ,listBox = null
        ,searchBox = null
        ,optionsBox = null

        ,inputText = null
        ,wrapper = null
        ,foundsList = null
        ,optText = null
        ,searchIndex = null
        ,prevSliceTextNoSearch = null
        ,sliceFound = null
        ,remainderSliceTextNoSearch = null
        ,newOpt = null
        ,spanSliceFound = null
        ,options = null
    ;

    $(this).each(function (i, select) {
        optionsBox = $(select).closest('.custom-select').find('.options-box');

        searchBox = $('<div></div>');
        searchBox.addClass('search-box');
        searchTextBox = $('<input></input>');
        searchTextBox.attr('type', 'text');
        searchBox.append(searchTextBox);

        optionsBox.prepend(searchBox);

        searchTextBox.on('keyup', function (e) {

            inputText = $(this);
            wrapper = inputText.closest('.custom-select');
            options = wrapper.find('ul.select li');

            optionsBox = inputText.closest('.options-box');

            // cria a lista das opções e a caixa de texto, dinamicamente, e apenas após a pesquisa. Caso ela já tenha sido criada, ela não é recriada, ela é apenas limpa.
            if(wrapper.find('ul.founds-list').length === 0) {
                foundsList = $('<ul></ul>').addClass('founds-list');
                optionsBox.append(foundsList);
                foundsList.insertAfter( wrapper.find('.search-box') );
            } else {
                foundsList = optionsBox.find('.founds-list');
                foundsList.empty();
            }

            if(inputText.val() !== '') {

                options.each(function (i, option) {

                    optText = option.textContent.trim();
                    searchIndex = optText.toLowerCase().search( inputText.val().toLowerCase() );
                    if(searchIndex > -1) {
                        foundsList.show();
                        options.parent().hide();

                        prevSliceTextNoSearch = optText.slice(0, searchIndex);

                        sliceFound = optText.slice(prevSliceTextNoSearch.length, prevSliceTextNoSearch.length + inputText.val().length);

                        remainderSliceTextNoSearch = optText.slice(prevSliceTextNoSearch.length + sliceFound.length, optText.length);

                        newOpt = $('<li></li>');
                        spanSliceFound = $('<span></span>');

                        newOpt.append(prevSliceTextNoSearch);
                        newOpt.append(spanSliceFound);
                        spanSliceFound.addClass('slice-found');
                        spanSliceFound.text(sliceFound);
                        newOpt.append(remainderSliceTextNoSearch);
                        newOpt.attr( 'data-value', $(option).data('value') );

                        foundsList.prepend(newOpt);
                    }

                });

                // setActionToSelect();

            } else {
                options.parent().show();
                foundsList.hide();
            }
        });
    });

}

jQuery.fn.build = function (params) {

    var
        caption = null
        ,captionText = null
        ,listBox = null
        ,searchBox = null
        ,searchTextBox = null
        ,list = null
        ,select = null
        ,wrapper = null
    ;

    $(this).each(function (i, select) {
        select = $(select);
        select.hide();
        wrapper = $('<div></div>');
        wrapper.addClass('custom-select');
        select.parent().append(wrapper);
        wrapper.append(select);

        caption = $('<div></div>');
        captionText = $('<div></div>');
        listBox = $('<div></div>');

        list = $('<ul></ul>');

        caption.addClass('caption retracted');
        captionText.addClass('text');
        listBox.addClass('options-box');
        list.addClass('select');



        wrapper.append(caption);
        caption.append(captionText);
        wrapper.append(listBox);
        listBox.append(list);

        buildOpts(list);

        // toggle
        caption.on('click', function () {
            wrapper = $(this).closest('.custom-select');
            wrapper.find('.options-box').toggle();
            toggleCaptionClass( $(this) );
        });

        setActionToSelect(list);
    });

    return $(this);

}

var buildOpts = function (jqObj) {
    "use strict";

    var
        wrapper = jqObj.closest('.custom-select')
        ,select = wrapper.find('select')
        ,list = wrapper.find('ul.select')
        ,options = select.find('option')
        ,captionText = wrapper.find('.caption .text')
        ,option = null
        ,li = null
    ;

    options.each(function (i, tag) {
        option = $(tag);
        li = $('<li></li>');

        li.attr( 'data-value', option.attr('value') );
        li.text( option.text() );
        list.append(li);

        if( option.attr('selected') ) {
            captionText.text( option.text() );
        }
    });

}

var toggleCaptionClass = function (jqObj) {
    "use strict";
    jqObj.toggleClass('expanded', 'retracted');
}

// click out
$(document).click(function (e) {

    var
        wrapper = $('.custom-select')
        ,optionsBoxes = wrapper.find('.options-box')
        captions = wrapper.find('.caption');
    ;

    if( $(e.target).closest('.custom-select').length === 0 ) {

        if( optionsBoxes.is(':visible') ) {
            optionsBoxes.hide();
            captions.removeClass('expanded');
        }

    }

});

//select onclick
var setActionToSelect = function (jqObj) {
    "use strict";

    jqObj.find('li').on('click', function () {
        var
            wrapper = jqObj.closest('.custom-select')
            ,caption = wrapper.find('.caption')
            ,value = $(this).data('value')
            ,select = wrapper.find('select')
            ,captionText = wrapper.find('.caption .text')
            ,selected = null
        ;

        // remove selection
        select.find('option:selected').attr('selected', false);

        // select
        selected = select.find('option[value="' + value + '"]');
        selected.attr('selected', true);

        captionText.text( selected.text() );

        // esconde opções
        wrapper.find('.options-box').hide();

        toggleCaptionClass(caption);
    });
}
;