var flgSecondary = 0;
var flgHigh = 0;
function secondary() {
    if (flgHigh == 1) {
        $("#secondary").addClass('viewed');
        $("#high").removeClass('viewed');
        $(".secondary-school").removeClass('secondary-school-hide');
        $(".high-school").removeClass('high-school-show');
        flgHigh--;
    }
}
function high() {
    if (flgHigh == 0) {
        $("#secondary").removeClass('viewed');
        $("#high").addClass('viewed');
        $(".secondary-school").addClass('secondary-school-hide');
        $(".high-school").addClass('high-school-show');
        flgHigh++;
    }
}
$(document).ready(function () {
    $("#owl-demo").owlCarousel({

        navigation: true,
        slideSpeed: 300,
        paginationSpeed: 400,
        singleItem: true

        // "singleItem:true" is a shortcut for:
        // items : 1,
        // itemsDesktop : false,
        // itemsDesktopSmall : false,
        // itemsTablet: false,
        // itemsMobile : false

    });
});
$(function () {
    $('.crsl-items').carousel({
        visible: 4,
        itemMinWidth: 275,
        itemEqualHeight: 400,
        itemMargin: 20,
    });

    $("a[href=#]").on('click', function (e) {
        e.preventDefault();
    });
});

jQuery(document).ready(function ($) {

    $('#myCarousel').carousel({
        interval: 5000
    });

    $('#carousel-text').html($('#slide-content-0').html());

    //Handles the carousel thumbnails
    $('[id^=carousel-selector-]').click(function () {
        var id_selector = $(this).attr("id");
        var id = id_selector.substr(id_selector.length - 1);
        var id = parseInt(id);
        $('#myCarousel').carousel(id);
    });

    // When the carousel slides, auto update the text
    $('#myCarousel').on('slid', function (e) {
        var id = $('.item.active').data('slide-number');
        $('#carousel-text').html($('#slide-content-' + id).html());
    });
});