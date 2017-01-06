/**
 * All the data in the CourseViewer
 */
$(document).ready(function () {
    CourseViewer = $.extend(CourseViewer, {
        loading_iid: false, // can be the iid of the item we're loading
        current_iid: false, // current item leaf iid (video, exercise, vocabset)
        ntype: '',
        start_link: false, // check is_item
        wr: null, //where right RedistKey::tco_where_r
        wl: null, //where left RedistKey::tco_where_l
        checkDisplay: false,
        showMenu: 1,
        algorithm_proprotion : "2",
    });
});