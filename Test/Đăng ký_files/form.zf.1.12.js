Sand.form = Sand.form || {};

$(document).ready(function () {
    Sand.form.redraw_captcha = function ($el) {
        if ($el.find('.captcha-input').size() > 0) {
            $el.find('.captcha-input').parent().find('img')[0].click();
        }
    };

    //a few functions
    Sand.form.show_zf_element = function (elNames) {
        var tmp = elNames.split(',');
        for (i in tmp) {
            var elName = tmp[i];
            $("#" + elName + "-element").show();
            $("#" + elName + "-label").show();
            if (!$("#" + elName).hasClass('isEditor'))
                $("#" + elName).show();
        }
    };

    Sand.form.hide_zf_element = function (elNames) {
        var tmp = elNames.split(',');
        for (i in tmp) {
            var elName = tmp[i];
            $("#" + elName + "-element").hide();
            $("#" + elName + "-label").hide();
            $("#" + elName).hide();
        }
    };

    Sand.form.toggle_zf_element = function (elNames) {
        var tmp = elNames.split(',');
        for (i in tmp) {
            var elName = tmp[i];
            if ($("#" + elName + "-element").is(":visible"))
                hide_zf_element(elName);
            else
                show_zf_element(elName);
        }
    };
});
