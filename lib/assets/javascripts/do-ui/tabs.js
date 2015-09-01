var selectTab = function (handle, className) {
    var anchors = $("nav ul.tabs li a");
    anchors.removeClass(className);
    handle.addClass(className);
}

var showContentOnClick = function (e) {
    var
        list = $("nav ul.tabs")
        ,items = list.find("li")
        ,container = $("ul.tabs-container")
        id = $(e.target).attr('href')
    ;
    container.find("li").hide()
    container.find("li" + id).show();
}

window.tabsInit = function (className) {
    selectTabOnload(className);

    $("nav ul.tabs li a").click( function (e) {
        selectTab($(this), className);
        //aqui vem a lógica de como carregar o conteúdo, se via ajax, por exemplo
        showContentOnClick(e);
    });

}
;