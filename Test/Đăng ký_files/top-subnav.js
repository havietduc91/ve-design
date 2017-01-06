$(document).ready(function () {
    CourseViewer = $.extend(CourseViewer, {
        display_subnav: function (item) {
            $('.score-sb, .wcheck-item').hide();

            Sand.load_templates(['course|subnav_items'], function () {
                var html = Sand.template.render(
                    Sand.get_template('course', 'subnav_items'),
                    item);
                $('#blackboard-sub-nav-item').html(html);

                Tracker.get_tracking(item.childrenIids);

                //TODO: trigger the event to click on the first event
                //TODO: TIMEOUT
                // set tracking subnav
                if (CourseViewer.wl != null
                    && CourseViewer.wl != 'undefined'
                    && CourseViewer.wl != CourseViewer.wr
                    && CourseViewer.wr == item['iid']) {
                    var tag = 'a.snippet[data-iid=' + CourseViewer.wl + ']';
                    if ($(tag).size() > 0)
                        $(tag)[0].click();
                }
                else {
                    $(document).ready(function () {
                        if ($("#blackboard-sub-nav-item li").size() > 0) {
                            $("#blackboard-sub-nav-item li:eq(0)").find('a')[0].click();
                        }
                        else {
                            //$("#blackboard-title").html("No content for this section");
                        }
                    });
                }
                //Loading.disable();
            });
        },
        show_subnav: function () {
            $('#blackboard-sub-nav').show();
        },
        hide_subnav: function () {
            $('#blackboard-sub-nav').hide();
        },
    });
});