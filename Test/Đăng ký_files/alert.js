$(document).ready(function () {
    Sand.alert = Sand.alert || {};
    Sand.alert.alert_error = function (msg, dur /* 3000 = 3 seconds*/) {
        if (typeof dur == 'undefined')
            dur = 3000;
        if (typeof $().toastmessage != 'undefined') {
            $().toastmessage(
                'showToast',
                {
                    text: msg,
                    sticky: false,
                    position: 'top-right',
                    type: 'error',
                    inEffectDuration: 200,
                    stayTime: dur
                }
            );
        }
    };

    Sand.alert.alert_success = function (msg, dur) {
        if (typeof dur == 'undefined')
            dur = 3000;
        if (typeof $().toastmessage != 'undefined') {

            $().toastmessage(
                'showToast',
                {
                    text: msg,
                    sticky: false,
                    position: 'top-right',
                    type: 'success',
                    inEffectDuration: 200,
                    stayTime: dur
                });
        }
        else {
            Sand.utils.log("toastmessage is not there");
        }
    };

});
