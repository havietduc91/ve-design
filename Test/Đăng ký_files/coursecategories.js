$(document).ready(function () {
    CourseCategories = {
        init: function () {
            Sand.load_templates([
                'course|item_default',
                'course|item_learn',
                'course|item_user',
                'course|item_index',
                'course|user_path'
            ], function () {
                $(document).ready(function () {
                    if ($('.course-category').length > 0) {
                        $('.course-category').eq(0).trigger('click');
                    }
                });
            });
        },

        display_items: function (html, region_id) {
            $('#' + region_id).html(html);
        }
    };

    if (Edx.is_landing()) {
        CourseCategories.init();
    }

    Sand.callbacks.load_slider_plugin = function ($el, json, params) {
        setTimeout(function () {
            if (typeof $(".feature-slider").owlCarousel != 'undefined') {
                $(".feature-slider").owlCarousel({
                    autoPlay: 10000,
                    items: 4,
                    itemsDesktop: [1199, 4],
                    itemsDesktopSmall: [979, 3],
                    itemsTablet: [768, 2],
                    itemsTabletSmall: [600, 1],
                    slideSpeed: 300,
                    navigation: true,
                    pagination: false,
                    navigationText: ["<i class='fa fa-angle-left'></i>", "<i class='fa fa-angle-right'></i>"]
                });
            }
        }, 1000);
    };

    Sand.callbacks.load_categories = function ($el, json, params) {
        if (json.success) {
            var template = $el.data('template');
            var region_id = $el.data('region-id');
            var items = json.result;
            var html = Sand.template.render(
                Sand.get_template('course', template),
                json);
            CourseCategories.display_items(html, region_id);
            //Todo: xu ly tracking
            Loading.disable();
            $(document).ready(function () {
                var get_tracking = $('[data-tco]');
                if (get_tracking.length > 0) {
                    var tcos = [];
                    $.each($('[data-tco]'), function (e, i) {
                        tcos.push($(this).data('tco'));
                    });
                    Tracker.get_tracking(tcos);
                }
            });
        }
    }
});

