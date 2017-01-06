$(document).ready(function () {
    CourseViewer = $.extend(CourseViewer, {
        init: function () {

            //Ngay khi duoc load thi disable ngay su kien nay
            CourseViewer.disable_snippet_click();

            CourseViewer.wr = null;
            CourseViewer.wl = null;
            CourseViewer.start_link = CourseViewer.get_item_display_by_link();
            Sand.load_templates([
                    'course|dictation_nav',
                    'course|item_title',
                    'course|question_li',
                    'course|search_suggest',
                    'course|xpeak',
                    'course|item_finish',
                    'course|course_finish',
                    'question|dictation',
                    'question|introduction',
                    'question|intro_stick',
                    'question|inline',
                    'question|mc',
                    'question|mc_answer_text',
                    'question|exam_mc_answer_text',
                    'question|mc_answer_avatar',
                    'question|mc_answer_avatar_text',
                    'question|reorder',
                    'question|matching_pairs',
                    'question|inline_answer',
                    'question|mc_answer',
                    'question|reorder_answer',
                    'question|matching_pairs_answer',
                    'question|wrapper',
                    'question|exam_wrapper',
                    'question|wrapper_group',
                    'question|exercise',
                    'question|exercise_summary',
                    'question|next_back_question',
                    'question|vocab_nav',
                    'question|open_ended',
                    'site|loading',
                    'site|audio_single',
                    'site|audio_list',
                    'course|start_exam',
                    'course|unlock_by_path'
                ], function () {
                    CourseViewer.bind_click();
                    //TODO: Load syllabus tree ?
                    var ntype = '';
                    if (typeof Edx.learning_type !== 'undefined') {
                        ntype = Edx.learning_type;
                    } else {
                        ntype = 'syllabus';
                    }
                    Tree.load_async(
                        {
                            iid: Edx.syllabus_iid,
                            ntype: ntype,
                            depth: Edx.syllabus_initial_depth
                        }, function () {
                            CourseViewer.display_everything();
                        });
                }
            );
            if (Edx.learning_type != 'koncept') {
                if (Edx.course_price == 0) {
                    Sand.ajax.ajax_request({
                        url: "/course/api/pay",
                        dataType: 'json',
                        data: {
                            ciid: Edx.course_iid,
                            tiid: Edx.course_iid,
                        },
                        success: function (json) {
                        },
                        error: function () {

                        }
                    });
                }
                Tracker.get_tcos_price(Edx.tcos, function () {
                    CourseViewer.menu_toggle();
                });
            } else {
                CourseViewer.notTracking = true;
            }
        },
        get_item_display_by_link: function () {
            var link = window.location.hash;
            if (link.length) {
                var tmp = link.split("/");
                if(typeof tmp[2] == 'undefined') {
                    return false;
                }
                tmp = tmp[2].split('.');
                if (tmp.length == 1) {
                    CourseViewer.wr = tmp[0];
                    CourseViewer.wl = null;
                }
                else {
                    CourseViewer.wr = tmp[0];
                    CourseViewer.wl = tmp[1];
                }
                return true;
            } else {
                return false;
            }

        },

    });

    if (Sand.page == "course/index/view") {
        CourseViewer.init();
    }
})
