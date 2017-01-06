$(document).ready(function () {
    CourseViewer = $.extend(CourseViewer, {
        track: function (iid, from) {

            var item = Tree.get_node(iid);
            var p;
            if (from == 'right') {
                p = [{
                    tco_iid: Edx.course_iid,
                    wr: item.iid,
                    wl: item.iid,
                }];
            } else {
                p = [{
                    tco_iid: Edx.course_iid,
                    wr: item.pid,
                    wl: item.iid,
                }];
            }
            Tracker.save_progress_multi(p);
        },
    });
});