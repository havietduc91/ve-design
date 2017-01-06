Test.question_modules_mapping = function (type) {
    switch (parseInt(type)) {
        case parseInt(Question.TYPES.INTRODUCTION):
            return 'introduction';
        case parseInt(Question.TYPES.INLINE) :
            return 'inline';
        case parseInt(Question.TYPES.MC) :
            return 'mc';
        case parseInt(Question.TYPES.REORDER) :
            return 'reorder';
        case parseInt(Question.TYPES.MATCHING_PAIRS) :
            return 'matching_pairs';
        case parseInt(Question.TYPES.REPEAT_AFTER_ME) :
            return 'repeat_after_me';
        case parseInt(Question.TYPES.ROLEPLAY):
            return 'roleplay';
        case parseInt(Question.TYPES.CATEGORIZED) :
            return 'categorized';
        case parseInt(Question.TYPES.OPEN_ENDED) :
            return 'open_ended';
        case parseInt(Question.TYPES.SPEAKING) :
            return 'speaking';
        default:
            return 'sample';
    }
};

Test.testStartedButNotSubmited = false;
Test.nrQuestionsTried = 0;

window.onbeforeunload = function () {
    if (Test.testStartedButNotSubmited && !Test.finished) {
        return 'You have not submitted your test result. Are you sure you want to cancel the test?';
    }
};

$(document).ready(function () {
    //MOST IMPORTANT function: check $question for correct|wrong, how many times wrong/score/stars...
    Test = $.extend(Test, {
        id_question: "",
        sumGroup: 0,
        sumQuestion: 0,
        currentGroup: 0,
        current_question: false,
        display_answer_as_hint: true,
        indexFocus: -1,
        init: function () {
            /**** Inline questions***************/
            $("input.inline_input").autoGrowInput({
                comfortZone: 20,
                minWidth: 100,
                maxWidth: 1000
            });
            $.each($("select.inline_select"), function (index, value) {
                var html = $(this).html();
                var html = "<option value='-1a-l-l-'>--select--</option>" + html;
                $(this).html(html);
            });
        },
        is_inline_sortable: function (q) {
            if (typeof q.is_inline_sortable != 'undefined')
                return true;
        },
        submitData: {},
        $get_exercise_nav: function () {
            return $("#exercise-nav");
        },
        $get_exercise: function () {
            return $("#exercise-wrapper");
        },
        $get_wrapper: function (iid) {
            return $(".question_wrapper[data-iid='" + iid + "']");
        },
        get_question_nav: function (iid) {
            return $("#exercise-nav li[data-iid='" + iid + "']");
        },
        is_one_key_correct: function (qInfo, correctAnswer, answer, i) {
            var correct = false;
            var ca = correctAnswer[i]; //is an array
            var a = answer[i] || '';
            if (qInfo.type == Question.TYPES.MC) {
                if (a == ca && a != '') {
                    return true;
                } else {
                    return false;
                }
            }
            if (ca.indexOf(a) != -1 && a !== "") //answer not case sensitive
            {
                correct = true;
            }
            else
            // else if (qInfo['acs'] == 0)
            {
                if (ca.indexOf(a.toString().toLowerCase()) != -1 && a !== "")
                    correct = true;
            }
            return correct;
        },
        is_question_correct: function (nr_keys, nr_correct) {
            if (nr_keys != 0 && nr_correct == nr_keys)
                return true;
            else
                return false;
        },
        highlight_question: function (iid, nr_keys, nr_correct) {
            //update questions answer here
            var $question = Test.$get_wrapper(iid);
            if (Test.is_question_correct(nr_keys, nr_correct)) {
                $question.addClass('is-correct').removeClass('is-wrong');
            }
            else {
                Take.set(iid, 'wrongs', Take.get(iid, 'wrongs') + 1);
                $question.addClass('is-wrong').removeClass('is-correct');
            }
        },
        //
        get_correct_answer: function (iid, type) {
            var node = Tree.get_node(iid);
            return node.answers || [];
        },
        //detects if user has changed answer in the left
        //TODO: don't use data-prev-answer
        answer_has_changed: function (iid, answer) {
            if (typeof Take.get(iid, 'prev') != 'undefined'
                && Take.get(iid, 'prev') === answer)
                return false;
            else {
                Take.set(iid, 'prev', answer)
            }
            return true;
        },
        /**** MOST IMPORTANT FUNCTION **********/
        get_and_check_answer: function (iid) {

            if (typeof iid == 'undefined' ||
                iid == 'summary' || iid == 'exam-summary')
                return;

            var exid = Tree.get_pid(iid);
            var qInfo = Tree.get_node(iid);
            var type = qInfo.type;

            if (type == Question.TYPES.INTRODUCTION) {
                return;
            }
            if (type == Question.TYPES.CATEGORIZED) {
                Test.categorized.check_user_answer($question);
                return;
            }

            //First question is done. So we will alert user if he navigates away
            Test.testStartedButNotSubmited = true;


            var mod = Test[Test.question_modules_mapping(type)]; //Test.inline (for example)

            //Step 1. user's answer
            var answer = [];
            answer = mod.get_user_answer(exid, iid, answer);

            //Step 2. check if question has been changed yet. If not, do not check.
            //This is useful where a question has multiple keys
            // and user accidentally clicked check just because one question
            if (!Test.answer_has_changed(iid, answer)) {
                Sand.utils.log("User has not changed. Returning in get_and_check_answer");
                return;
            }
            //Now user has changed answer (or has done it first time)


            //Step 3. Check with correc answer;
            // answer key
            var correctAnswer;
            if (typeof mod.get_correct_answer != 'undefined')
                correctAnswer = mod.get_correct_answer(iid, type);
            else
                correctAnswer = Test.get_correct_answer(iid, type);

            if (type == Question.TYPES.MC) {
                Test.display_answer_as_hint = false;
                var mcAnswer = correctAnswer[0];
                var tag = '.mc-question.user_answer .mc-list-wrap:eq(' + mcAnswer + ')';
                var $exWrapper = Test.$get_wrapper(iid);
                $exWrapper.find(tag).addClass('correct-answer-key');
            }
            //var nr_keys = answer.length;
            // How many inputs/keys are there in one question. For example we have one inline question
            // how __are__ you this __CourseViewer.checkDisplaymorning__ ? then nr_keys = 2 because user will have
            // to type 2 textboxes.

            var nr_keys = correctAnswer.length;
            var nr_correct = 0;
            var f, nr_inputs, is_one_key_correct;
            var lever_complete = 'completed';
            if (type != Question.TYPES.OPEN_ENDED) {
                if (typeof mod.check_user_answer != 'undefined') {
                    info = mod.check_user_answer($question, answer);
                    nr_correct = info.nr_correct;
                    nr_inputs = info.nr_inputs;
                    lever_complete = 'struggling';
                }
                else {
                    if (nr_keys > 0) {
                        for (i = 0; i <= nr_keys - 1; i++) {
                            is_one_key_correct = Test.is_one_key_correct(qInfo, correctAnswer, answer, i);
                            if (is_one_key_correct) {
                                nr_correct++;
                            } else {
                                lever_complete = 'struggling';
                            }
                            mod.highlight_one_key(iid, i, is_one_key_correct);
                        }
                    }
                }
                Take.set(iid, 'nr_correct', nr_correct);

                Take.increase_total_nr_correct(nr_correct);
                if (nr_correct < nr_keys || !answer) {
                    Take.total_wrong += 1;
                }

                Tracker.change_icon(iid, lever_complete);

                // calculate question score/stars here
                Test.get_and_populate_question_score_and_stars(iid);

                if (type == Question.TYPES.CATEGORIZED) {
                    nr_keys = nr_inputs;
                }
                Test.highlight_question(iid, nr_keys, nr_correct);
            }
            else {

            }
        },
        nextFocusTextBox: function () {
            if (Test.indexFocus == -1)
                return false;
            Test.indexFocus += 1;
            var $div = $(".question_wrapper[data-iid='" + Test.current_question + "']");
            if ($div.find(".user_answer:visible:eq(" + Test.indexFocus + ")").length) {
                $div.find(".user_answer:visible:eq(" + Test.indexFocus + ")").focus();
                return true;
            }
            return false;
        },

        bind_events: function () {
            //Increase Test.nrQuestionsTried to prevent user from navigating away
            $(document).on('click', '#blackboard-content .mc-question.user_answer div, ul.user_answer li:not(".sortable-item")', function () {
                Sand.utils.playBackground('clicked');
                Test.nrQuestionsTried++;
                if ($(this).hasClass('mc')) {
                    $(this).parent().find('.mc.active').removeClass('active');
                    $(this).addClass('active');
                    Vocabset.activeEventCheck();
                    var $question = $(this).parents('div.question_wrapper');
                    $('#nav-question-exe-simpl').find(".question-nav[data-iid='" + $question.data('iid') + "']").addClass('visited');
                }
            });


            $(document).on('change', "input.user_answer", function () {
                Test.nrQuestionsTried++;
            });

            $(document).on('click', "div.user_answer", function () {
                Test.nrQuestionsTried++;
            });

            $(document).keypress(function (e) {
                /*                if (e.which == 13) {
                 if (Test.nextFocusTextBox())
                 return;
                 if ($("#result-next-snippet").is(":visible"))
                 $("#result-next-snippet").trigger('click');
                 else if ($("#show-speak").is(":visible") && Vocabset.isCheck)
                 $("#show-speak").trigger('click');
                 else if ($("#check-answer").is(":visible") && Vocabset.isCheck)
                 $("#check-answer").trigger('click');
                 else if ($("#next-question").is(":visible") && Vocabset.isCheck)
                 $("#next-question").trigger('click');
                 else if ($("#next-item").is(":visible") && Vocabset.isCheck)
                 $("#next-item").trigger('click');
                 else if ($("#next-video").is(":visible") && Vocabset.isCheck)
                 $("#next-video").trigger('click');
                 else if ($("#exercise-result").is(":visible") && Vocabset.isCheck)
                 $("#exercise-result").trigger('click');
                 }*/
            });

            $(document).on("focus", 'input.inline_input', function (e) {
                Test.indexFocus = $('input.inline_input:visible').index($(this));
            });
        },

        calculate_exercise_score: function () {
            var score = 0;
            for (var iid in Take.attempts) {
                var e = Take.attempts[iid];
                if (!isNaN(parseFloat(e['score'])))
                    score = parseFloat(score + parseFloat(e['score']));
            }
            ;

            Take.score = score; //total exercise score. Out of exercise' sw
        },
        /**
         * iid is either sco (exam) iid
         * or exercise iid
         */
        finish_test: function (iid) {

            $("#redo-exercise,#review-exercise, #score-wrapper").show();
            if (Test.exam_iid) {
                $('.question_wrapper').each(function (i, e) {
                    Test.get_and_check_answer($(this).data('iid'));
                });
                $("#redo-exercise").hide();
            }
            Test.exam_tduration = Test.exam_tend - Test.exam_tstart;
            Test.exam_tduration = Math.ceil(Test.exam_tduration / 1000);
            Test.calculate_exercise_score();
            var node = Tree.get_node(iid, 4);
            var score = Take.total_nr_correct;
            var sw = node.sw;
            var pscore = Math.ceil((score / sw) * 100) || 0; //diem tren 100;s

            var pscore_display = pscore + ' %';

            if (typeof Edx.progress_algorithm != 'undefined' && Edx.progress_algorithm == CourseViewer.algorithm_proprotion) {
                var wrong = Take.total_wrong;
                var sum_question = node.children.length;
                pscore_display = (sum_question - wrong) + '/' + sum_question;
                if (wrong <= 1) {
                    pscore = 100;
                }

                var p = {
                    tco_iid: iid,
                    p: pscore,
                    pg: pscore_display
                };
                p.pg = pscore_display;
            } else {
                var p = {
                    tco_iid: iid,
                    p: pscore,
                };
            }

            $("#total-score").html(pscore_display);
            $("#c-ers-title").html(node.name);
            $("#c-ers-point").html(score);
            $("#c-ers-percentage").html(pscore + ' %');
            $("#c-ers-duration").html(Sand.utils.parse_digital_clock_string_from_duration(Test.exam_tduration));
            $("#c-ers-start").html(Sand.utils.convert_time(Test.exam_tstart));
            $("#c-ers-finish").html(Sand.utils.convert_time(Test.exam_tend));

            Tracker.save_progress_multi([p]);
            Take.finished = true;
            Test.finished = true;
            CourseViewer.display_check_next('next-item');
            Test.hide_submit_button();
        },
        hide_submit_button: function () {
            $("#submit-exam").hide();
        },

        // score is calculated based on the following factors
        // 1. nr_correct/nr_keys
        // 2. wrongs  #of times user clicked 'check' and still got it wrong (this won't apply to
        //   exam Edx['exercises'] because in exams, user does not have chance to click twice

        //hints/total_hints
        get_and_populate_question_score_and_stars: function (iid) {

            var exid = Tree.get_pid(iid);
            var $question = Test.$get_wrapper(iid);

            var qInfo = Tree.get_node(iid);

            var sw = qInfo.sw;

            var dg = qInfo.dg; //TODO: do we need dg??? Yes we do

            var attempt = Take.get_attempt(iid);
            score = parseFloat(100 * attempt.nr_correct / qInfo.nr_keys);// out of 100
            //how many wrongs. Each time divide it by half. For simplicity
            if (attempt.wrongs > 0)
                score = parseFloat(score / (Math.pow(2, attempt.wrongs)));

            //based on wrongs and shit, return a different score
            // Let's make it a simple formula here
            if (attempt.hints > 0) {
                score = parseFloat(score * (qInfo.total_hints - attempt.hints) / qInfo.total_hints);
                //Math.pow(2, attempt.hints));
            }
            else if (attempt.hints == -1) //give up
            {
                score = 0; //score is 0, but star might be 1 . As an encouragement
            }

            var actual_score = parseFloat(score * sw / 100);
            actual_score_for_display = Test.display_score(actual_score);
            ;

            $question.find(".score").html(actual_score_for_display + "/" + sw);

            Take.set(iid, 'score', actual_score);

            return score;
        }
    });

    //=========================save questions for later==========================
    Sand.callbacks.question_saved = function () {
        var total = $('.question_wrapper.saved_question').size();
        $("#marked-question-total").html(total);
        if (total > 0)
            $("#marked-question-panel").show();
        else
            $("#marked-question-panel").hide();
    };

    Sand.callbacks.toggle_saved_questions = function ($el, json, params) {
        if ($el.data('toggle') == 'show') //show saved questions
        {
            $('.question_wrapper').hide();
            $('.group-wrapper').show();
            $('.saved_question').show();
            $('.stickem-row-relative').stickem();
            $el.data('toggle', 'hide');
        }
        else {
            $('.question-navigation li.current-dg').trigger('click');
            $('.stickem-row-relative').stickem();
            $el.data('toggle', 'show');
        }

    };

    $(document).on('click', "#check-answer", function (e) {
        if (CourseViewer.ntype == 'exercise') {
            var $div = $(".question_wrapper[data-iid='" + Test.id_question + "']");
            if ($div.find("div.question div.answer").length)
                $div.find("div.question div.answer").css({
                    'pointer-events': 'none',
                });
            else {
                $div.find("div.question ").css({
                    'pointer-events': 'none',
                });
            }
            Test.display_answer_as_hint = true;
            var stars;
            var exid = CourseViewer.current_iid;
            var ex = Tree.get_node(exid);

            var $ex = Test.$get_exercise(exid);
            //check all current visible questions
            $ex.find('div.question_wrapper:visible').each(function (i, e) {
                Test.get_and_check_answer($(this).data('iid'));
            });

            Test.update_question_nav(exid);

            //TODO: update the next button or wrong
            var total_question = 0;
            if (ex.question_mode == 'one_by_one') {
                var dg;
                var groupHasWrongAnswer = false;
                var total_score = 0;
                $ex.find('div.question_wrapper:visible').each(function (i, e) {
                    total_question = total_question + 1;
                    dg = $(this).attr('data-dg');
                    var score = 0;
                    if ($(this).hasClass('is-wrong')) {
                        $(this).addClass('is-wrong')
                        groupHasWrongAnswer = true;
                        //return false;
                    } else {
                        $(this).addClass('is-correct')
                    }
                    score = score + $(this).attr('data-score');
                    total_score = total_score + parseFloat(score);
                });
            }

            $ex.find('div.question_wrapper.is-wrong:visible').find('.feedback_false').show();
            $ex.find('div.question_wrapper.is-correct:visible').find('.feedback_true').show();
            if (groupHasWrongAnswer && total_question == 1) {
                Test.show_question_wrong_answer_notification();
            } else if (total_question == 1) {
                Test.show_question_correct_answer_notification();
            }

            $('#check-answer').hide();
            if (Test.currentGroup == Test.sumGroup)
                CourseViewer.display_check_next('exercise-result');
            else
                CourseViewer.display_check_next('next-question');
            //show answer
            if (Test.display_answer_as_hint) {
                $ex.find('div.question_wrapper:visible').find('.answer_as_hint').show();
            }

        } else if (CourseViewer.ntype == 'vocabset') {
            Vocabset.checkQuestion();
        }

    });

    Test.update_question_nav = function (exid) {
        var $exNav = Test.$get_exercise_nav();
        var needs_update_exercise_score = false;
        $exNav.find("div.question-nav").each(function () {
            var iid = $(this).attr('data-id');
            if ($(this).attr('data-needs-update')) {
                needs_update_exercise_score = true;
                var dg = $(this).attr('data-dg');
                var sw = $(this).attr('data-sw');
                var score = 0;
                var i = 0;
                $ex.find("div.question_wrapper[data-dg='" + dg + "']").each(function () {
                    i++;
                    score = parseFloat(score + parseFloat($(this).attr('data-score')));
                });

                $(this).attr('data-score', score).find('.score').html(Test.display_score(score));

                scorePercent = parseFloat(100 * score / sw);

                $(this).removeAttr('data-needs-update');
            }
        });

        if (needs_update_exercise_score) {
            Test.calculate_exercise_score();
        }
    };

    Test.bind_events();

    //next-flow-item
    $(document).on('click', ".next-flow-item", function (e) {
        $next_flow_item = $("#blackboard-nav").find("a.lesson-dir[data-dir='next']");
        $next_flow_item.trigger('click');
    });
});
