/****************Declaration list of common functions **********************/
Edx.is_landing = function () {
    if (Sand.page == 'course/index/categories'
        || Sand.page == 'site/index/dashboard'
        || Sand.page == 'site/index/landing'
        || Sand.page == 'course/index/index'
    ) return true;
    return false;
}

//GOOGLE SEARCH
var googleSearchIframeName = "cse-search-results";
var googleSearchFormName = "cse-search-box";
var googleSearchFrameWidth = 100;
var googleSearchDomain = "www.google.com.vn";
var googleSearchPath = "/cse";
$(document).ready(function () {
    $(document).on('click', '.render-video', function () {
        var data_play = $(this).attr('data-play');//Neu == 1 thi lấy luôn video id từ element này
        if (typeof data_play !== 'undefined' && data_play !== '') {
            var yt_vid = $(this).attr('data-yt-vid');
            Sand.utils.play_youtube_by_yt_id($(this), yt_vid);
        } else {
            var $object = $(this).closest('.one-token');
            if ($object.length > 0) {
                //do nothing
            } else {
                var $object = $(this).closest('.timeline');
            }
            if ($(this).attr('data-target')) {
                var tmp = $(this).attr('data-target');
                var input_type = $(this).attr('data-input-type');
                if (typeof input_type != 'undefined' &&
                    input_type == 'select') {
                    $object.find("select.youtube[name='" + tmp + "']").trigger('change');
                } else {
                    $object.find(".youtube[name='" + tmp + "']").trigger('change');
                }
            }
        }
    });

    $(document).on('change', '.start-time, .end-time', function () {
        var $wrap = $(this).closest('.timeline');
        if ($wrap.size() == 0)
            $wrap = $(this).closest('form');
        var stt = digitalTimeToSecond($wrap.find("input[name='st']").val());
        var ett = digitalTimeToSecond($wrap.find("input[name='et']").val());
        var ttText = display_digital_countdown(ett - stt);
        $wrap.find("input[name='tt']").val(ttText);
    });

    /******************Bootstrap plugins **************************/

    /* TODO: move this into avatar. plugin */
    $(document).on("change", ".avatar.sand-attachments", function () {
        $singleAvatar = $(this).closest('.single-avatar-wrapper').find('.single-avatar');

        $singleAvatar.find('img').attr('src', $(this).val());
    })


    //payment
    //recharge success for the 2 forms: bk recharge card and home-grown recharge card

    $("a.recharge_again").click(function (e) {
        $wrapper = $(this).closest('div.gateway-wrapper');
        $wrapper.find('form').show();
        $wrapper.find('div.recharge_success').hide();
    });


    //youtube upload video with a previewer. used in update video form only
    $("html").on('change', "input.youtube, select.youtube", function (e) {
        var $url = $(this);
        $form = $url.closest('form');
        var vid = Sand.string.getYoutubeIdFromUrl($url.val());

        width = $url.attr('data-yt-width') || 420;
        height = $url.attr('data-yt-height') || 315;

        var targetDiv = $url.attr('data-target') || '#preview-video';
        if (vid != '' && $(targetDiv).size() > 0) {
            var str = Sand.youtube.get_embed_code(vid, width, height);
            $(targetDiv).html(str);
        }
        if ($url.attr('data-contract'))
            $url.val(vid);
        $form.find('.youtube-vid').val(vid);
    });

    // learn sco
    $(document).on('click', '.modalButton', function (e) {
        var src = $(this).attr('data-src');
        var width = $(this).attr('data-width') || window.innerWidth;
        var height = $(this).attr('data-height') || window.innerHeight;

        var allowfullscreen = $(this).attr('data-video-fullscreen');
        // stampiamo i nostri dati nell'iframe
        if (Sand.utils.is_mobile()) {
            $('#myModal button.close').trigger('click');
            window.open(src, '_blank');
        } else {
            $("#myModal iframe").attr({
                'src': src,
                'height': height,
                'width': width,
                'allowfullscreen': ''
            });
        }
    });

    $(document).on('hidden.bs.modal', '#myModal', function () {
        $(this).find('iframe').html("");
        $(this).find('iframe').attr("src", "");
    });

    $(document).on('click', '#window-close', function () {
        if (Sand.utils.is_mobile()) {
            window.close();
        } else {
            $('#myModal button.close').trigger('click');
        }
    });


});


function init_fb() {
    (function (d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s);
        js.id = id;
        js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&appId=" + Sand.FB_APP_ID + "&version=v2.0";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
}

function init_ga() {
    (function (i, s, o, g, r, a, m) {
        i['GoogleAnalyticsObject'] = r;
        i[r] = i[r] || function () {
                (i[r].q = i[r].q || []).push(arguments)
            }, i[r].l = 1 * new Date();
        a = s.createElement(o),
            m = s.getElementsByTagName(o)[0];
        a.async = 1;
        a.src = g;
        m.parentNode.insertBefore(a, m)
    })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

    ga('create', Sand.GA_ID, 'auto');
    ga('send', 'pageview');
}