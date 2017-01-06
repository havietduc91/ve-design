$(document).ready(function () {
    PrivateCourses = {
        init: function () {
            Sand.load_templates([
                'course|default_item',
                'course|private_item',
                'course|private_item_gest',
                'course|mycourse_gest'
            ], function () {
                PrivateCourses.load_private_courses();
            });
        },
        load_private_courses: function () {
            if ($('.course-category').length > 0) {
                $('.course-category').eq(0).trigger('click');
            }
        },
        check_user_is_guest: function ($el, json, params) {
            if (Sand.utils.is_guest()) {
                var html = Sand.get_template('course', 'private_item_gest');
                Sand.set_html('#hocvet-courses_result', html, true);
                return false;
            }
        }
    };

    if (Sand.page == 'site/index/private' ||
        Sand.page == 'site/index/public' ||
        Sand.page == 'site/index/dashboard' ||
        Sand.page == 'site/index/learning' ||
        Sand.page == 'site/index/xpeak-default' ||
        Sand.page == 'site/index/xpeak-phonetics'
    ) {
        PrivateCourses.init();
    }
});
