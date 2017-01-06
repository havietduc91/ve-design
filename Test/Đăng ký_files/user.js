(function ($) {
    User = $.extend(User,
        {
            //token is an integer & can be negative,
            change_token_balance: function (money, vmoney) {
                var t = parseInt(money) + parseInt(vmoney);
                $(".token_balance").html(t);
            },
            logout_user: function () {

            },
            populate_user: function (user) {
                //user has just logged in. We don't want to refresh the page
                //in stead now we populate user info into different parts of the page & populate info into localStorage...
                //we don't need to worry about cookies as it's already been returned by the page request
                // In case we change to using web tokens completely, this will do.
                /*
                 Sand.localStorage.setItem('uid', user.id);
                 Sand.localStorage.setItem('uiid', user.iid);
                 */

                Sand.uiid = user.uiid;
                Sand.uid = user.id;

                //user link
                $(".user-profile-link").attr('href', Sand.utils.user_link(user));
                // user avatar
                if (user.avatar != '' && user.avatar != Sand.DEFAULT_AVATAR)
                    $("img.logged-in-user-avatar").attr('src', Sand.utils.user_avatar(user, 'small'));
                else
                    $("img.logged-in-user-avatar").attr('src', Sand.DEFAULT_AVATAR);
                // user name
                //Update account
                $("#menu-user-edit-link").attr('href', "/user/update?_sand_step=account&id=" + user.id);

                $(".user-profile-name").html(user.name)
                // notif count
                if (user.counter.un > 0)
                    $("#top-user-menu-right .notice-notif-count").html(user.counter.un);
                else
                    $("#top-user-menu-right .notice-notif-count").html('');
                //money
                User.change_token_balance(user.counter.money, user.counter.vmoney);
                $(".is-guest").hide();
                $(".is-logged-in").show();
            },
            populate_dynamic_info: function () {
                $(".is-guest").attr('style', 'display:none;');
                $(".is-logged-in").attr('style', 'display:none;');
                //Populate user info at top user menu
                if ($('#header').length > 0) {
                    //  if (Sand.utils.is_guest())
                    // {
                    //     $(".is-guest").show();
                    //     $(".is-logged-in").hide();
                    // }
                    // else
                    // {
                    //     $(".is-guest").hide();
                    //     $(".is-logged-in").show();
                    // }

                    if (Sand.utils.is_guest()) {
                        $(".is-guest").attr('style', '');
                        $(".is-logged-in").attr('style', 'display:none;');
                    }
                    else {
                        $(".is-guest").attr('style', 'display:none;');
                        var user = User.get_user();

                        $("<img src='" + user.avatar + "'>").load(function () {
                            $('#avatar-user-top').attr('src', user.avatar);
                        }).bind('error', function () {
                            $('#avatar-user-top').attr('src', Sand.DEFAULT_AVATA);
                        });
                        $(".is-logged-in").attr('style', '');
                    }
                } else {
                    if (Sand.utils.is_guest()) {
                        $(".is-guest").show();
                        $(".is-logged-in").hide();
                    }
                    else {
                        $(".is-guest").hide();
                        $(".is-logged-in").show();
                    }
                }
                User.render_menu_user();
            },
            get_user: function () {
                var iid = Sand.cookie.getCookie('uiid');
                var name = Sand.cookie.getCookie('uname');
                var avatar = Sand.configs.STATIC_CDN + '/avatar/' + iid + '.jpg';
                return {iid: iid, name: name, avatar: avatar};
            },
            answer_invite_course: function ($el, json, params) {
                if (typeof params == 'undefined') {
                    var redirect = 1;
                } else {
                    var redirect = 0;
                }
                if (json.success && redirect) {
                    if (json.result.anwser == 'accept') {
                        window.location = json.result.link;
                    } else {
                        window.location = '/';
                    }
                }
            },
            user_invite_course: function ($el, json, params) {
                Sand.load_templates([
                    'sitex|pagination',
                    'user|user_invite_courses'
                ], function () {
                    if (json.type == 'waiting') {
                        json.show_action = true;
                    }
                    json.pagination = Sand.pagination($el, json, params);
                    var html = Sand.template.render(
                        Sand.get_template('user', 'user_invite_courses'),
                        json
                    );
                    Sand.set_html("#mainstage", html);
                });
            },

            set_type_bf_submit: function ($el, json, params) {
                var type = params[0];
                $("#user_invite_course_form input[name='type']").val(type);
            },

            get_params_bs: function ($el, json, params) {
                var allVals = [];
                $('#report-user-learn_result input:checkbox:checked').each(function () {
                    allVals.push({
                        'id': $(this).val(),
                        'course_iid': $(this).parent().find('input[name="course_iid"]').val(),
                        'course_name': $(this).parent().find('input[name="course_name"]').val(),
                        'user_iid': $(this).parent().find('input[name="user_iid"]').val(),
                        'created_at': $(this).parent().find('input[name="created_at"]').val(),
                    });
                });
                return {
                    success: true,
                    result: {'invites': allVals}
                };
            },
            view_detail_users_import: function ($el, json, params) {
                if (json.success) {
                    if (typeof json.template_display != 'undefined' && json.template_display) {
                        Sand.callbacks.populate_search_result($el, json, params);
                    } else {
                        Sand.ajax.ajax_request({
                            url: "/user/data/import-view",
                            data: {
                                id: json.result.id
                            },
                            success: function (json) {
                                if (json.success) {
                                    Sand.load_templates(['user|import-view'], function () {
                                        var html = Sand.template.render(
                                            Sand.get_template('user|import-view'), json);
                                        Sand.set_html('#mainstage', html, true);
                                        Sand.callbacks.init_search_form();
                                    });
                                } else {
                                    alert('Import false');
                                }
                            },
                        });
                    }
                }
            },
            get_progress_course: function ($el, json, params) {
                if (json.success) {
                    var syllabus = [];
                    for (var i in json.result) {
                        syllabus.push(json.result[i]['syllabus']);
                    }
                    setTimeout(function () {
                        Tracker.get_tracking(syllabus);
                    }, 500);
                }
            },
            render_menu_user: function (menu_active) {
                var user = User.get_user();
                Sand.load_templates(['site|menu', 'user|nav-user'], function () {
                    var data = {};
                    if (typeof user != 'undefined' && user.iid != 'undefined') {
                        data.user = user;
                    }
                    data.menu = menu_active;
                    //check if we're on the login page
                    if (Sand.page == "user/index/login") {
                        data.modal = false;
                    }
                    else
                        data.modal = true;

                    var b = Sand.url.get_parameter('b');

                    if (!b)
                        b = window.location.pathname;

                    if (b && b.indexOf('/user/login') !== 0)
                        data.back_url = b;
                    else
                        data.back_url = '';

                    if ($('.champion-account-info').length) {
                        if (typeof user.iid != 'undefined' && user.iid) {
                            $('#exam-menu-path').show();
                        }
                        var account_info = Sand.template.render(
                            Sand.get_template('user', 'nav-user'), data);
                        Sand.set_html('.champion-account-info', account_info, true);
                    } else {
                        var html = Sand.template.render(
                            Sand.get_template('site', 'menu'), data);
                        Sand.set_html('#menu_navigation', html, true);
                    }

                    if (typeof user != 'undefined' && user.iid != 'undefined' && $("#avatar-user-top").is(":visible")) {
                        Sand.ajax.ajax_request({
                            url: user.avatar,
                            type: "HEAD",
                            success: function (message, text, response) {
                                if (response.getResponseHeader('Content-Type').indexOf("image") != -1) {
                                    $("#avatar-user-top")[0].src = user.avatar;
                                }
                            }
                        });
                    }
                });

            }

        });


    if ($('#scrollToTop').length > 0) {
        if (Sand.utils.is_guest()) {
        } else {
            $('#scrollToTop .sctt-gest').hide();
            $('#scrollToTop .sctt-register').show();
        }
    }

})(jQuery)
