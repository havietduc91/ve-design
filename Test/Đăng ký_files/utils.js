$(document).ready(function () {
    Sand.utils = $.extend(Sand.utils, {
        init_timeago: function () {
            $(".timeago").timeago({
                refreshMillis: 10000,
                allowFuture: true,
                strings: {
                    prefixAgo: null,
                    prefixFromNow: null,
                    suffixAgo: Sand.translator.translate("ago"),
                    suffixFromNow: Sand.translator.translate("from now"),
                    seconds: Sand.translator.translate("%d seconds"),
                    minute: Sand.translator.translate("about a minute"),
                    minutes: Sand.translator.translate("%d minutes"),
                    hour: Sand.translator.translate("about an hour"),
                    hours: Sand.translator.translate("%d hours"),
                    day: Sand.translator.translate("a day"),
                    days: Sand.translator.translate("%d days"),
                    month: Sand.translator.translate("about a month"),
                    months: Sand.translator.translate("%d months"),
                    year: Sand.translator.translate("about a year"),
                    years: Sand.translator.translate("%d years"),
                    wordSeparator: " ",
                    numbers: []
                }
            });
        },
        animate_picture: function (objToAnimate) {
            if (objToAnimate.length > 0) {
                var $obj = objToAnimate;
            } else {
                var $obj = $(objToAnimate);
            }

            $obj.animate({
                'opacity': '0.5'
            }, 300, function () {
                $(this).animate({
                    'opacity': '1'
                }, 1000);
            });
        },
        //str is 01:10, this func returns 70
        parse_duration_from_digital_clock_string: function (str) {
            var arr = str.split(':');
            if (arr.length == 3) {
                return 3600 * parseInt(arr[0]) + 60 * parseInt(arr[1]) + parseInt(arr[2]);
            }
            else if (arr.length == 2) {
                return 60 * parseInt(arr[0]) + parseInt(arr[1]);
            }
            else
                return parseInt(arr[0]);
        },
        prefix_zero: function (t) {
            if (parseInt(t) < 10)
                return '0' + t;
            return t;
        },
        convert_time: function (time) {
            var d = new Date(time);
            return d.toLocaleString();
        },
        //if dur == 70, return 01:10
        parse_digital_clock_string_from_duration: function (duration) {
            var dur = parseInt(duration);
            var hours = Math.floor(dur / 3600);
            dur = dur - 3600 * hours;
            var minutes = Math.floor(dur / 60);
            dur = dur - 60 * minutes;
            var seconds = dur;

            hours = Sand.utils.prefix_zero(hours);
            minutes = Sand.utils.prefix_zero(minutes);
            seconds = Sand.utils.prefix_zero(seconds);

            if (hours == 0)
                return minutes + ":" + seconds;
            else
                return hours + ":" + minutes + ":" + seconds;
        },
        get_jquery_cache_obj: function (id) {
            if (typeof Sand.jqueryCache[id] != 'undefined')
                return Sand.jqueryCache[id];
            else {
                Sand.jqueryCache[id] = $(id);
                return Sand.jqueryCache[id];
            }
        },
        cache: {
            set: function (key, val) {
                Sand._cache[key] = val;
            },
            get: function (key) {
                if (typeof Sand._cache[key] != 'undefined')
                    return Sand._cache[key];
                else
                    return undefined;
            }
        },
        get_static_mp3_path: function () {
            return Sand.configs.ASSETS_CDN + 'mp3/';
        },
        clean_answer: function (t) {
            b = $.trim(t);
            //remove all the br
            regex = /<br(\s)?(\/)?>/g;
            while (b.match(regex)) {
                b = b.replace(regex, ' ');
            }
            // remove doulbe spaces
            b = $.trim(b.replace(/\s{2,}/g, ' '));
            return b;
        },
        /*************************************USER related*********************************/
        user_avatar: function (user, avaSize) {
            var uiid;
            if (!user || typeof user.iid == 'undefined')
                uiid = Sand.localStorage.getItem('uiid', true);
            else
                uiid = user.iid;
            if (uiid == 0) {
                return Sand.DEFAULT_AVATAR;
            }
            else {
                avaSize = avaSize || 'small';
                return Sand.STATIC_CDN + '/avatar/' + avaSize + '/' + uiid + '.jpg';
            }
        },
        user_link: function (user) {
            var uiid;
            if (user && user.iid)
                uiid = user.iid;
            else
                uiid = Sand.localStorage.getItem('uiid', true /* from cookie as well*/);

            if (uiid == 0)
                return '/';
            else
                return '/user/' + uiid;
        },
        take_link: function (ciid, liid, l_slug, take_id) {
            return "/t/c/" + ciid + "/lesson/" + liid + "/v/" + l_slug + "/view-take/" + take_id + ".html";
            //return "/take/view?id=" + take_id;
        },
        play_youtube_by_yt_id: function ($url, vid) {
            var vid = Sand.string.getYoutubeIdFromUrl(vid);
            width = $url.attr('data-yt-width') || 420;
            height = $url.attr('data-yt-height') || 315;
            var targetDiv = $url.attr('data-target') || '#preview-video';
            if (vid != '' && $(targetDiv).size() > 0) {
                var str = Sand.youtube.get_embed_code(vid, width, height);

                var close = "<div><a class='btn btn-sm btn-default pull-right' data-sand-fake=1 data-sand-bs=\"set_html('" + targetDiv + "', '')\">close X</a></div>";
                str = close + str;
                $(targetDiv).html(str).show();
            }
        }
    });
});

function l(a) {
    if (Sand.configs.APPLICATION_ENV == 'development') {
        console.log(a);
    }
}
