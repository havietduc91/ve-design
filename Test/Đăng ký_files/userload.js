$(document).ready(function () {
    UserLoad = {
        info: {},
        is_dashboard: function () {
            return Sand.page == 'site/index/dashboard' || Sand.page == 'user/index/user-invite-courses';
        },
        init: function () {
            Sand.load_templates([
                'user|banner',
                'sitex|pagination',
                'sitex|search-results',
            ], function () {
                // alert('f*ch');
                UserLoad.reload_banner();

            });
        },
        load_info: function (callback) {
            Sand.ajax.ajax_request({
                url: '/user/api/info',
                success: function (json) {
                    if (json.success) {
                        UserLoad.info = json.result;
                    }
                    callback();
                }
            });
        },
        reload_banner: function () {
            if ($('#user-banner').length > 0) {
                //Loading.enable();
                UserLoad.load_info(function () {
                    UserLoad.load_balance(function (data) {
                        if (typeof data != 'undefined' && data['success']) {
                            $.extend(UserLoad.info, data['result']);
                            // UserLoad.info['money'] = data['result']['money'];
                        }
                        var html = Sand.template.render(
                            Sand.get_template('user', 'banner'),
                            UserLoad.info);
                        $('#user-banner').html(html);
                    });
                    //Loading.disable();
                });
            }
        },
        load_balance: function (callback) {
            Sand.ajax.ajax_request({
                url: "/user/balance",
                dataType: 'json',
                success: function (json) {
                    callback(json);
                },
                error: function () {
                    callback();
                }
            });
        }
    };

    //TODO Only load if we're in dashboard
    if (UserLoad.is_dashboard()) {
        UserLoad.init();
    }
});

