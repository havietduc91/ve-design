/**
 * contains logic about taking an exam
 */
$(document).ready(function () {
    Test = $.extend(Test, {
        exam_iid: false, //se bang sco iid neu exam start
        display_exam: function (exam_iid) {
            var sco = Tree.get_node(exam_iid);
            var exercise_iid;
            var html = '';
            Test.sumGroup = 0;
            Test.sumQuestion = 0;
            for (i in sco.childrenIids) {
                exercise_iid = sco.childrenIids[i];
                html = html + CourseViewer.render_exercise_html(
                        Tree.get_node(exercise_iid));
            }
            html = html + CourseViewer.render_exercise_summary();
            html = html + Sand.get_template('question', 'next_back_question');
            var html = "<div id='exercise-wrapper'>" + html + "</div>";

            Sand.set_html('#blackboard-content', html, true);

            if (Take.attempts.answers) {
                $.each(Take.attempts.answers, function (i, r) {
                    var $question = $(".question_wrapper[data-iid='" + i + "']");
                    switch (r.type) {
                        case parseInt(Question.TYPES.INLINE) :
                            $question.find('.user_answer').each(function (i, e) {
                                $(this).val(r.answer[i]);
                            });
                            break;

                        case parseInt(Question.TYPES.MC) :
                            $question.find('.answer .mc-list-wrap').eq(r.answer).addClass('active');
                            break;

                        case parseInt(Question.TYPES.REPEAT_AFTER_ME) :
                            break;
                        case parseInt(Question.TYPES.ROLEPLAY):
                            break;
                        case parseInt(Question.TYPES.CATEGORIZED) :
                            break;
                        case parseInt(Question.TYPES.OPEN_ENDED) :
                            $question.find('.answer .open-ended-editor').val(r.answer[0]['text-answer']);
                            $question.find(".answer .answered_file").val(r.answer[0]['file-url']);
                            break;
                    }
                })
            }

            if (!Sand.utils.is_mobile()) {
                Test.fix_height_answers();
            }
            var firstExerciseIid = sco.childrenIids[0];
            CourseViewer.load_item(firstExerciseIid, 'exercise');
            CourseViewer.display_check_next('nav-exam');
            Test.timer.start();
        },
        display_exam_start_screen: function (exam_iid) {
            var sco = Tree.get_node(exam_iid);

            var html = Sand.template.render(
                Sand.get_template('course', 'start_exam'),
                sco);

            //set total exam duration
            // Test.timer.duration = Sand.utils.parse_duration_from_digital_clock_string(sco.duration);

            Sand.set_html("#blackboard-content", html, true);
        },
        // out of all the exercise-wrapper-{$iid}.exercise
        // load only this exercise
        load_exam_exercise: function (exercise_iid) {
            $("#exercise-wrapper .exercise").hide();
            $("#exercise-" + exercise_iid).show();
        },

        /*********************************************************/
        /*************************callbacks***********************/
        /*********************************************************/
        submit_exam: function ($el, json, params) {
            if (!Test.exam_tend) {
                var d = new Date();
                Test.exam_tend = d.getTime();
            }
            Test.timer.stop(1);
            Test.save_exam_result();
            localStorage.removeItem(Take.saveResultKey);
        },

        save_exam_result: function () {
            var exam_result = JSON.parse(localStorage.getItem(Take.saveResultKey));
            var data = {
                _sand_modal_ajax: 1,
                exam_answer: exam_result.answer,
                exam_iid: exam_result.iid,
                completion_time: exam_result.time
            };
            Sand.ajax.ajax_request({
                url: "/take/api/exam-result",
                data: data,
                success: function (json) {
                    if (json.result) {
                    }
                }
            });
        },

        start_exam: function ($el, json, params) {
            var exam_iid = $el.data('iid');
            //Neu click start => set
            // Clock chat
            Test.exam_iid = exam_iid;
            //Ve children ben phai
            var sco = Tree.get_node(exam_iid);
            Test.timer.duration = Sand.utils.parse_duration_from_digital_clock_string(sco.duration);
            var exam_result = JSON.parse(localStorage.getItem(Take.saveResultKey));
            var user = User.get_user();
            if (exam_result && exam_result.iid == Test.exam_iid && exam_result.uiid == user.iid && exam_result.time < Test.timer.duration) {
                Take.attempts.answers = exam_result.answer;
                Test.timer.time_used = exam_result.time;
            } else {
                localStorage.removeItem(Take.saveResultKey);
                Take.attempts.answers = false;
            }
            //Load all exercises && display all exercises
            Tree.load_async({iid: exam_iid, ntype: 'sco', depth: -1},
                function () {
                    Test.display_exam(exam_iid);
                });
            Test.finished = false;
        },
        next_group_question_exam: function ($el, json, params) {
            var next = Tree.next_sibling(CourseViewer.current_iid, Test.current_question);
            $('#back-exam').removeClass('pointer-vents');
            if (next) {
                Test.show_question(next);
            } else {
                var n = Tree.get_next_sibling(parseInt(CourseViewer.current_iid));
                if (n)
                    CourseViewer.load_item(n, 'exercise');
                else
                    Test.show_question('exam-summary');
            }
        },
        back_group_question_exam: function ($el, json, params) {
            var $nav_group = $('#nav-question-exe-simpl .question-navigation');
            var $nav_group_active = $('#nav-question-exe-simpl .question-navigation.active');
            var index = $nav_group.index($nav_group_active);
            if (index == 0) {
                return;
            }
            $nav_group.eq(index - 1).find('.question-nav').eq(0).trigger('click');
            if (index - 1 == 0) {
                $('#back-exam').addClass('pointer-vents');
            }
        },
        bindEvents: function () {
            $(document).on('click', '.question_wrapper span.c-tq-stick-note', function () {
                var $question = $(this).parents('.question_wrapper');
                var $nav_question = $('#nav-question-exe-simpl').find(".question-nav[data-iid='" + $question.data('iid') + "']");
                if ($(this).hasClass("c-q-active-note")) {
                    $(this).removeClass('c-q-active-note');
                    $nav_question.removeClass('c-q-active-note');
                } else {
                    $(this).addClass('c-q-active-note');
                    $nav_question.addClass('c-q-active-note');
                }
            });
        }
    });
    Test.bindEvents();
});