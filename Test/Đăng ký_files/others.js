//TODO: Move those functions inside Sand.utils

//with Array and objects
var remove_dupes, size_of, remove_by_val;
//Array.prototype.removeByVal

//DOM
var jSwap;

//Cookie & localStorage
var setLocalStorageCookie, getLocalStorageCookie;

//Others
var display_digital_countdown;

size_of = function (obj) {
    var size = 0;
    var k;
    for (k in obj) {
        if (obj.hasOwnProperty(k)) size++;
    }
    return size;
};


$(document).ready(function () {

    t = function (str) {
        if (typeof Translations != 'undefined' && typeof Translations[str] != 'undefined')
            return Translations[str];
        else
            return str;
    };


    jSwap = function ($el1, $el2) {
        var el2_copy = $el2.clone(true);
        var el1_copy = $el1.clone(true);
        $el1.replaceWith(el2_copy);
        $el2.replaceWith(el1_copy);
    };


});


function digitalTimeToSecond(date) {
    var timeArray = date.split(':');
    var min = parseInt(timeArray[0]);
    var second = parseInt(timeArray[1]);
    var time = min * 60 + second;

    return time;
}

//display a number of seconds into format mm:ss
//for example taken_time = 90
//return '01:30'
display_digital_countdown = function (taken_time) {
    var mins = Math.floor(taken_time / 60);
    var secs = taken_time - mins * 60;
    if (secs < 10)
        secs = '0' + secs.toString();
    if (mins < 10)
        mins = '0' + mins.toString();

    tt = mins + ":" + secs;
    return tt;
};


//check if localStorage is supported. If yes save value into localStorage
//else save it into cookie
setLocalStorageCookie = function (c_name, value, exdays) {
    if (localStorage) {
        localStorage.setItem(c_name, value);
    }
    else {
        setCookie(c_name, value);
    }
};

getLocalStorageCookie = function (c_name) {
    if (localStorage) {
        return localStorage.getItem(c_name);
    }
    else {
        return getCookie(c_name);
    }
};

Sand.utils = {
    log: function () {
        if (Sand.configs.APPLICATION_ENV.indexOf('development') != -1) {
           // console.log.apply(console, arguments);
        }
    },
    get_icon: function (iname) {
        var iconLib = Sand.configs.iconLib || 'glyphicon';
        if (iconLib == 'glyphicon' && iname == 'spinner')
            iname = 'refresh';

        if (Sand.utils.icon_map) {
            iname = Sand.utils.icon_map(iconLib, iname);
        }
        if (iconLib == 'glyphicon' && iname == 'spinner')
            return iconLib + " " + iconLib + '-' + iname;
        else if (iconLib == 'themeva')
            return "icon-" + iname + " iconfont";
        else if (iconLib == 'fa')
            return "fa fa-" + iname;
        else
            return 'icon icon-' + iname;

    },
    gen_icon: function (iname, extra_class) {
        var i = Sand.utils.get_icon(iname);
        var kl = extra_class ? ' ' + extra_class : '';
        return "<i class='" + i + kl + "'></i>";
    },
    node_link: function (nodetype, v) //copy of node_link in site.php
    {
        if (v.type == 'dictionary') {
            if (typeof v.type_dict == 'undefined') {
                v.type_dict = 'en-vn';
            }

            //if (v.school == 've')
            return '/dict/' + v.type_dict + '/' + v.dict_slug + '.html';
            /*
             else
             return '/concept/' + v.school + '/' + v.type_dict + '/' + v.dict_slug + '.html';
             */
        }
        else if (nodetype == 'concept') {
            //if (v.school == 've')
            return '/concept/' + v.subject + '/' + v.slug + '.html';
            /*
             else
             return '/concept/' + v.school + '/' + v.subject + '/' + v.slug + '.html';
             */
        }
    },

    icon_class: function (type) {
        ret = 'glyphicon glyphicon-ok';
        if (type == 'concept')
            ret = "glyphicon glyphicon-tag";
        else if (type == 'idiom')
            ret = "glyphicon glyphicon-quote-right";
        else if (type == 'course')
            ret = "glyphicon glyphicon-certificate";
        else if (type == 'dictionary')
            ret = "glyphicon glyphicon-book";
        return ret;
    },
    is_guest: function () {
        var uid = Sand.utils.get_uid();
        if (uid == 0)
            return true;
        else
            return false;
    },
    get_uid: function () {
        //get from localstorage. If not found -> get from Cookie
        var uid = Sand.localStorage.getItem('uid', true);
        if (!uid)
            uid = 0;
        return uid;

    },
    get_uiid: function () {
        //get from localstorage. If not found -> get from Cookie
        var uid = Sand.localStorage.getItem('uiid', true);
        if (!uid)
            uid = 0;
        return uid;
    },
    generate_loading_html: function () {
        return Sand.utils.generate_loading_text();
    },
    generate_loading_text: function (withIcon) {
        var ret = "Loading...";
        if (withIcon)
            ret = Sand.utils.gen_icon('spinner') + " " + ret;
        return ret;
    },
    generate_loading_icon: function () {
        ret = Sand.utils.gen_icon('spinner');
        return ret;
    },
    is_mobile: function () {
        if (navigator.userAgent.match(/Android/i)
            || navigator.userAgent.match(/webOS/i)
            || navigator.userAgent.match(/iPhone/i)
            || navigator.userAgent.match(/iPad/i)
            || navigator.userAgent.match(/iPod/i)
            || navigator.userAgent.match(/BlackBerry/i)
            || navigator.userAgent.match(/Windows Phone/i)
        ) {
            return true;
        }
        else {
            return false;
        }
    }
};

$(document).ready(function () {
    Sand.utils.populate_dynamic_array = function ($input, options) {
        var splitter = $input.attr('data-splitter');
        var textVal = options.join(splitter);

        if ($input.prop('tagName') == 'TEXTAREA')
            $input.html(textVal);
        else
            $input.val(textVal);
    };

    //This function can be overwritten
    Sand.utils.show_ajax_loading = function () {
        if (typeof NProgress != 'undefined')
            NProgress.set(0.9);
        else {
            var t = Sand.utils.generate_loading_html();
            if ($("#sand-ajax-loading").size() == 0) {
                var html = "<div id='sand-ajax-loading' style='border:1px solid red;background-color:#D9EDF7;position:fixed;left:5px;bottom:5px;'>" + t + "</div>";
                $('body').append(html);
            }
            $("#sand-ajax-loading").show();
        }
    };

    Sand.utils.hide_ajax_loading = function () {
        if (typeof NProgress != 'undefined') {
            NProgress.done();
            NProgress.remove();
        }
        else
            $("#sand-ajax-loading").hide();
    };

    Sand.utils.create_modal = function (sel) {
        return '<div id="' + sel + '" class="modal fade" tabindex="-1" role="dialog" ' +
            'aria-labelledby="ajaxModalLabel" aria-hidden="true" style="display: none;">  ' +
            '<div class="modal-dialog"> <div class="modal-content">' +
            '<div class="modal-header"> ' +
            '<span class="close" data-dismiss="modal">x</span>' +
            '<h4 class="modal-title sand-title"></h4>' +
            '</div>' +
            '<div class="modal-body sand-body">' +
            '</div>' +
            ' </div>' +
            ' </div>' +
            '</div>';
    },

        Sand.utils.get_ancestor = function ($el, params) {
            var level = 0;
            if (typeof params !== undefined) {
                if (typeof params === 'string' || typeof params === 'number') {
                    level = params;
                }
                else if (params[0])
                    level = params[0];
            }

            if (isNaN(level)) {
                return $el.closest(level);
            }
            else
                level = parseInt(level);

            while (level > 0) {
                $el = $el.parent();
                level--;
            }
            return $el;
        };
});

if (!Date.now) {
    Date.now = function () {
        return new Date().getTime();
    }
}
