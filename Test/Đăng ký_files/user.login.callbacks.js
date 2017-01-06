/** User login / register / logout callbacks **/
$(document).ready(function () {

    Sand['callbacks'] = $.extend(
        Sand['callbacks'],
        {
            /*** User login & register ******/
            as_register: function ($form, json, params) {
                if (json.success) {
                    User.populate_user(json.result);
                    window.location.href = "/user/register-success";
                }
            },
            as_register_update: function ($form, json, params) {
                if (json.success) {
                    User.populate_user(json.result);
                    window.location.href = "/user/register-update-information?type=add";
                } else {
                    if (json.err_code === 13) {//duplicated user
                        Sand.load_templates(['modal|duplicated-users'], function () {
                            var html = Sand.template.render(Sand.get_template('modal', 'duplicated-users'), json);   
                            Sand.set_html("#sand-modal-body", html);

                            $('#sand-modal .modal-header').hide();
                            $('#sand-modal .modal-dialog').addClass('duplicated-users');
                            $('#sand-modal').modal('show');

                            Champion.bindClickEvents();
                        });
                    } else {
                        Sand.callbacks.alert_message($form, json, params);
                    }
                }
            },
            as_register_success: function ($form, json, params) {
                if (json.success) {
                    window.location.href = "/user/register-success?_sand_step=user_information";
                }
            },
            as_login: function ($form, json, params) {
                if (json.success) {
                    var back = Sand.url.get_parameter('b');
                    if (back != "null") {
                        window.location.href = back;
                        return;
                    }
                    if (Sand.page == 'user/index/login' || Sand.page == 'user/index/register'
                        ||
                        Sand.page == 'site/index/landing'
                    ) {
                        window.location.href = '/';
                    } else {
                        //most likely user logged in via ajax
                        User.populate_user(json.result);
                        $("#ajaxModal").modal('hide');
                        location.reload();
                    }
                }
            },
            as_logout: function ($a, data, params) {
                //TODO: reset user's localStorage and shit...
            }
        }
    );
});
