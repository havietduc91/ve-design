Sand.translator = Sand.translator || {};
Sand.translator = {
    translate: function (str, mode, params) {
        var ret = '';
        //TODO: make a proper translate function here

        if (typeof Sand.translations != 'undefined' && typeof Sand.translations[str] != 'undefined')
            ret = Sand.translations[str];
        else
            ret = str.replace('_', ' ');
        mode = mode || 1;
        if (mode == 1)
            return Sand.string.capitalise_first_letter(ret);
        else if (mode == 2) //capitalize all words
            return Sand.string.capitalise_title_case(ret);
        else if (mode == 3)
            return ret.toUpperCase();
        else
            return ret;
    }
};

