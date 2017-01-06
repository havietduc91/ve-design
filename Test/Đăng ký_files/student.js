var Student;
(function ($) {
    Student = $.extend(Student,
        {

            modify_data: function ($el, json, params) {
                if (json.success) {
                    if (typeof params != 'undefined') {
                        if (params[0] == 'add_member') {
                            json.add_member = 1;
                        } else {
                            json.category = params[0];
                        }
                    }
                }
                return json;
            },

            add_users_to_category: function (category, userIids, drawResult) {
                data = {
                    object: 'user',
                    oid: userIids,
                    subject: 'category',
                    sid: category.iid,
                    type: category.type,
                    rt: 1
                }
                Sand.ajax.ajax_request({
                    url: "/api/v1/site/add-relation",
                    dataType: 'json',
                    data: data,
                    success: function (json) {

                    },
                    error: function () {

                    }
                });
            },
            /*
            check_agree_to_policy: function ($el, json, params) {
                console.log($el.find("input[name=check-policy]"));
                var check = $el.find("input[name=check-policy]").is(":checked");
                if (check) {
                    $el.find('.text-policy').css({
                        border: '10px solid #E8E8E8'
                    });
                    return {success: true};
                } else {
                    $el.find('.text-policy').css({
                        border: '3px solid red'
                    });
                    return {success: false};
                }
            },
            */
            bindClickEvents: function () {
                $(document).on('click', '.add_user_to_category', function (e) {
                    var category = {};
                    category.iid = $('#school_form_search_students_result').data('iid');
                    category.type = $('#school_form_search_students_result').data('type');
                    Student.add_users_to_category(category, [$(this).data('iid')], $(this).data('result'));
                });

                $(document).on('click', '#add_users_to_category', function (e) {
                    var $table = $(this).parents('#school_form_search_students_result').find('table tbody');
                    var studentIids = [];
                    var drawResult = $(this).data('result');
                    $table.find('input.check-item:checked').each(function (i, e) {
                        var iid = $(this).data('iid');
                        studentIids.push(iid);
                    });
                    var category = {};
                    category.iid = $('#school_form_search_students_result').data('iid');
                    category.type = $('#school_form_search_students_result').data('type');
                    Student.add_users_to_category(category, studentIids, drawResult);
                });
            },
        });
    Student.bindClickEvents();
})(jQuery)
