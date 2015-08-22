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
        ,list = wrapper.find('.custom-select-list')
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
            ,options = $('<div></div>')
            ,searchBox = $('<div></div>')
            ,searchTextBox = $('<input></input>')
            ,list = $('<ul></ul>')
        ;

        select.hide();

        searchBox.addClass('search-box');
        caption.addClass('caption retracted');
        captionText.addClass('text');
        options.addClass('options');
        list.addClass('custom-select-list');

        searchTextBox.attr('type', 'text');

        $(this).append(caption);
        caption.append(captionText);
        $(this).append(options);
        options.append(searchBox);
        searchBox.append(searchTextBox);
        options.append(list);

        buildOpts();

        setActionToSelect();
    });

    // toggle
    $('.custom-select .caption').on('click', function () {
        $(this).parent().find('.options').toggle();
        toggleCaptionClass();
    });

    // find
    $('.custom-select input[type=text]').on('keyup', function (e) {
        var
            inputText = $(this)
            ,wrapper = inputText.closest('.custom-select')
            ,resultList = null
            ,resultOptions = null
            ,options = wrapper.find('ul.custom-select-list li')
            ,liText = null
            ,search = null
            ,previousText = null
            ,found = null
            ,subsequentText = null
        ;

        if(wrapper.find('ul.search-result-list').length === 0) {
            resultList = $('<ul></ul>').addClass('search-result-list');
            resultList.insertAfter( wrapper.find('.search-box') );
        } else {
            resultList = wrapper.find('ul.search-result-list');
            resultList.empty();
        }

        resultOptions = resultList.find('li');

        if (inputText.val() !== '') {

            options.each(function (i, li) {
                liText = li.textContent.trim();

                search = liText.toLowerCase().search( inputText.val().toLowerCase() );
                if (search > -1) {
                    resultList.show();
                    options.parent().hide();

                    previousText = liText.slice(0, search);
                    found = liText.slice(previousText.length, previousText.length + inputText.val().length);
                    subsequentText = liText.slice(previousText.length + found.length, liText.length);

                    var
                        newLi = $('<li>' + previousText + '<span class=slice-found>' + found + '</span>' + subsequentText + '</li>');

                    newLi.attr( 'data-value', $(li).data('value') );

                    if (resultOptions.length > 0) {
                        resultOptions.each(function (i, addedLi) {
                            if (addedLi.textContent === liText) {
                                $(addedLi).replaceWith(newLi);
                            } else {
                                resultList.prepend(newLi);
                            }
                        });
                    } else {
                        resultList.prepend(newLi);
                    }

                }

            });

            setActionToSelect();

        } else {
            options.parent().show();
            resultList.hide();
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
        wrapper.find('.options').hide();

        toggleCaptionClass();
    });
}

var toggleCaptionClass = function () {
    // o problema está aqui
    $('.custom-select .caption').toggleClass('expanded', 'retracted');

    // if( $('.custom-select .caption').is( ".retracted" ) ) {
    //     $('.custom-select .caption').removeClass( "retracted" );
    //     $('.custom-select .caption').addClass( "expanded" );
    // } else {
    //     $('.custom-select .caption').removeClass( "expanded" );
    //     $('.custom-select .caption').addClass( "retracted" );
    // }
}

// click out
$(document).click(function (e) {
    var
        options = $('.custom-select .options');

    if( $(e.target).closest('.custom-select').length === 0 ) {

        if( options.is(':visible') ) {
            options.hide();
            toggleCaptionClass();
        }

    }

});
