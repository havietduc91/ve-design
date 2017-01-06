Sand.localStorage = Sand.localStorage || {};
Sand.localStorage = {
    setItem: function (k, v, jsonified) {
        if (jsonified)
            v = JSON.stringify(v);
        if (localStorage) {
            localStorage.setItem(Sand.configs.COOKIE_PREFIX + k, v);
        }
    },
    getItem: function (k, fromCookie, jsonified) {
        var ret ;
        var prefixedKey = Sand.configs.COOKIE_PREFIX + k;
        if (localStorage) {
            if (localStorage.getItem(prefixedKey))
                ret = localStorage.getItem(prefixedKey);
        }
        if (fromCookie)
            ret = Sand.cookie.getCookie(k);
        if (jsonified && ret)
        {
            try {
                ret = $.parseJSON(ret);
            }
            catch (e)
            {
                ret = undefined;
            }

        }
        return ret;
    },
    removeItem: function (k) {
        if (localStorage) {
            localStorage.removeItem(Sand.configs.COOKIE_PREFIX + k);
        }
    },
    localizeCookie: function (k) {
        //store this key value to localStorage
        //and remove it from cookie
        var v = Sand.cookie.getCookie(k);
        if (typeof v !== 'undefined') {
            Sand.localStorage.setItem(k, v);
            Sand.utils.deleteCookie(k);
        }
    },
    localizeCookies: function (k) {
        if (!localStorage)
            return;

        if (typeof k == 'object') {
            $.each(k, function (i, v) {
                Sand.localStorage.localizeCookie(v);
            });
        }
        else
            Sand.localStorage.localizeCookie(k);
    },
};
