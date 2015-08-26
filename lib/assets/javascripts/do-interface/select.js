$(function () {
    'use strict';

    // prepare onload
    if( $('.custom-select').length > 0 ) {
        init();
    }

});

var buildOpts = function () {
    var
        wrapper = $('.custom-select')
        ,select = wrapper.find('select')
        ,list = wrapper.find('ul.custom-select-list')
        ,selectOptions = select.find('option')
        ,captionText = wrapper.find('.caption .text')
    ;

    selectOptions.each(function (i, tag) {
        var
            jqObj = $(tag)
            ,li = $('<li></li>')
        ;

        li.attr( 'data-value', jqObj.attr('value') );
        li.text( jqObj.text() );
        list.append(li);

        if( jqObj.attr('selected') ) {
            captionText.text( jqObj.text() );
        }
    });

}

// transformar em fn do jquery
var init = function () {

    $('.custom-select').each(function () {
        var
            select = $(this).find('select')

            ,caption = $('<div></div>')
            ,captionText = $('<div></div>')
            ,items = $('<div></div>')
            ,searchBox = $('<div></div>')
            ,searchTextBox = $('<input></input>')
            ,list = $('<ul></ul>')
        ;

        select.hide();

        searchBox.addClass('search-box');
        caption.addClass('caption retracted');
        captionText.addClass('text');
        items.addClass('options-box');
        list.addClass('custom-select-list');

        searchTextBox.attr('type', 'text');

        $(this).append(caption);
        caption.append(captionText);
        $(this).append(items);
        items.append(searchBox);
        searchBox.append(searchTextBox);
        items.append(list);

        buildOpts();

        setActionToSelect();
    });

    // toggle
    $('.custom-select .caption').on('click', function () {
        $(this).parent().find('.options-box').toggle();
        toggleCaptionClass();
    });

    // find and build options
    $('.custom-select input[type=text]').on('keyup', function (e) {
        var
            inputText = $(this)
            ,wrapper = inputText.closest('.custom-select')
            ,foundsList = null
            ,foundsOptions = null
            ,options = wrapper.find('ul.custom-select-list li')
            ,optText = null
            ,searchIndex = null
            ,prevSliceTextNoSearch = null
            ,sliceFound = null
            ,remainderSliceTextNoSearch = null
        ;

        if(wrapper.find('ul.founds-list').length === 0) {
            foundsList = $('<ul></ul>').addClass('founds-list');
            foundsList.insertAfter( wrapper.find('.search-box') );
        } else {
            foundsList = wrapper.find('ul.founds-list');
            foundsList.empty();
        }

        foundsOptions = foundsList.find('li');

        if(inputText.val() !== '') {

            options.each(function (i, item) {

                optText = item.textContent.trim();
                searchIndex = optText.toLowerCase().search( inputText.val().toLowerCase() );
                if(searchIndex > -1) {
                    foundsList.show();
                    options.parent().hide();

                    prevSliceTextNoSearch = optText.slice(0, searchIndex);
                    sliceFound = optText.slice(prevSliceTextNoSearch.length, prevSliceTextNoSearch.length + inputText.val().length);
                    remainderSliceTextNoSearch = optText.slice(prevSliceTextNoSearch.length + sliceFound.length, optText.length);

                    var
                        newOpt = $('<li></li>')
                        ,spanSliceFound = $('<span></span>')
                    ;

                    newOpt.append(prevSliceTextNoSearch);
                    newOpt.append(spanSliceFound);
                    spanSliceFound.addClass('slice-found');
                    spanSliceFound.text(sliceFound);
                    newOpt.append(remainderSliceTextNoSearch);

                    newOpt.attr( 'data-value', $(item).data('value') );

                    if(foundsOptions.length > 0) {
                        foundsOptions.each(function (i, addedLi) {
                            if(addedLi.textContent === optText) {
                                $(addedLi).replaceWith(newOpt);
                            } else {
                                foundsList.prepend(newOpt);
                            }
                        });
                    } else {
                        foundsList.prepend(newOpt);
                    }

                }

            });

            setActionToSelect();

        } else {
            options.parent().show();
            foundsList.hide();
        }
    });

}

//select onclick
var setActionToSelect = function () {

    $('.custom-select li').on('click', function () {
        var
            wrapper = $(this).closest('.custom-select')
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

        // set caption
        captionText.text( selected.text() );

        // esconde opções
        wrapper.find('.options-box').hide();

        toggleCaptionClass();
    });
}

var toggleCaptionClass = function () {
    $('.custom-select .caption').toggleClass('expanded', 'retracted');
}

// click out
$(document).click(function (e) {
    var
        optionsBox = $('.custom-select .options-box');

    if( $(e.target).closest('.custom-select').length === 0 ) {

        if( optionsBox.is(':visible') ) {
            optionsBox.hide();
            toggleCaptionClass();
        }

    }

});
