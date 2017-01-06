(function () {
    $(document).ready(function () {
        var hvMenu = $('.hocvet-menu-wrap');
        $('.hocvet-menu-wrap li a').click(function (e) {
            $('.hocvet-menu-wrap li').removeClass('active');
            $(this).closest('li').addClass('active');
        });
        var listIdMenu = {};
        var idGet;
        var checkMenu = false;
        $.each($('.hocvet-menu-wrap li a'), function (e, i) {
            idGet = $(this).attr('data-id');
            if (idGet != undefined) {
                if ($('#' + idGet).length > 0) {
                    listIdMenu[idGet] = {'p': $('#' + idGet).offset().top, 'id': idGet};
                    checkMenu = true;
                }
            }
        });
        var pHeight;
        var pChoose;
        var pTop;
        $(window).scroll(function () {
            if (checkMenu) {
                pTop = $(window).scrollTop();
                $.each(listIdMenu, function (e, i) {
                    pHeight = i.p;
                    if (pHeight < pTop) {
                        pChoose = i.id;
                    }
                });
                $('.hocvet-menu-wrap li').removeClass('active');
                $('a[data-id="' + pChoose + '"]').closest('li').addClass('active');
            }
        });
    })
})(jQuery)
