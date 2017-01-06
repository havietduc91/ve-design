var Loading;
$(document).ready(function () {
    Loading =
    {
        init: function () {
            Loading.disable();
        },
        count: 0,
        enable: function () {
            Loading.count++;
            $('body, #page-loading').addClass('locked');
        },
        disable: function () {
            Loading.count--;
            if ((Loading.count < 0) || (Loading.count == 0)) {
                Loading.count = 0;
                setTimeout(function () {
                    $('body, #page-loading').removeClass('locked');
                }, 2000);
            }
        },
        reset: function () {
            Loading.count = 0;
            setTimeout(function () {
                $('body, #page-loading').removeClass('locked');
            }, 2000);
        }
    }
    $('#page-loading').click(function () {
        Loading.reset();
    });

    Loading.init();
    // alert(123);
});
