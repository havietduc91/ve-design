//cookie will prefix with COOKIE_PREFIX;
setCookie = function (c_name, value, exdays) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + exdays);
    var c_value = escape(value) + ((exdays == null) ? "" : "; expires=" + exdate.toUTCString());
    c_value = c_value + ";path=/";
    document.cookie = c_name + "=" + c_value;
};


getCookie = function (c_name) {
    var i, x, y, ARRcookies = document.cookie.split(";");
    for (i = 0; i < ARRcookies.length; i++) {
        x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
        y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
        x = x.replace(/^\s+|\s+$/g, "");
        if (x == c_name) {
            return unescape(y);
        }
    }
};


Sand.cookie = Sand.cookie || {};
Sand.cookie = {
    setCookie: function (k, v, exdays) {
        return setCookie(Sand.configs.COOKIE_PREFIX + k, v, exdays);
    },

    getCookie: function (k) {
        return getCookie(Sand.configs.COOKIE_PREFIX + k);
    },
    deleteCookie: function (k) {
        var prefixedKey = Sand.configs.COOKIE_PREFIX + k;
        document.cookie = prefixedKey + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    },
};

