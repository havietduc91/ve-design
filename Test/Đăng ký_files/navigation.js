$(document).ready(function () {
    Test = $.extend(Test, {
        auto_play_audio: function () {
            //auto play audio when detect audio
            var detec_audio = $('.has-mp3:visible');
            // var detec_audio = $('.exercise-body .has-mp3:visible');
            var detec_audio_list = $('.play-conversation:visible');
            // var detec_audio_list = $('.exercise-body .play-conversation:visible');
            if (detec_audio_list.length > 0) {
                detec_audio_list.each(function (index) {
                    $(this).trigger('click');
                    return true;
                });
            } else if (detec_audio.length > 0) {
                detec_audio.each(function (index) {
                    $(this).trigger('click');
                    return true;
                });
            }
        },
        show_exercise_summary: function (iid) {
            if ($('#exercise-box-result').is(":visible")) {
                $('#next-snippet').trigger('click');
            } else {
                $('.jp-stop').trigger('click');
                $('#exercise-result').hide();

                CourseViewer.display_check_next('next-item');
                $(".question_wrapper").hide();
                $('.c-intro-sticky').hide();
                if (iid == 'summary') {
                    Test.finish_test(CourseViewer.current_iid);
                    $("#exercise-box-result").show();
                }
                else if (iid == 'exam-summary') {
                    $("#exercise-box-result").show();
                    $("#redo-exercise,#review-exercise,#score-wrapper").hide();
                    $("#submit_exam").show();
                    $('#next_check_exam').hide();
                    CourseViewer.display_check_next('nav-exam');
                }
            }
            CourseViewer.min_height_content('submit_exam');
        },
        show_question: function (iid) {
            var intro_key = 'intro-stick-key';

            if (iid == 'exam-summary' ||
                (iid == 'summary' && Test.sumGroup == Test.currentGroup)
            ) {
                Test.show_exercise_summary(iid);
            }
            else {
                CourseViewer.current_iid = Tree.get_pid(iid);
                Test.current_question = iid;
                Vocabset.activeEventCheck();
                Test.indexFocus = -1;

                var node = Tree.get_node(iid);
                intro_key = node.intro_key;
                Test.id_question = iid;

                Test.show_group_question(iid);

                // $div.siblings().hide();
                //auto focus on input if it's an inline question
                var $div = $(".question_wrapper[data-iid='" + iid + "']");
                if (node.type == Question.TYPES.INLINE) {
                    Test.indexFocus = 0;
                    $div.find(".user_answer:visible:eq(0)").focus();
                }

                //Do not show "check" button for introduction type

                if (node.type == Question.TYPES.INTRODUCTION && !$('#exercise-result').is(":visible")) {
                    $('#check-answer').hide();
                    $('#next-question').show();
                }
                else if (!$('#exercise-result').is(":visible")) {
                    $('#check-answer').show();
                    $('#next-question').hide();
                }

                // pointer button Check question
                if (node.type == Question.TYPES.INLINE || node.type == Question.TYPES.MC) {
                    if (typeof node.tpl_type !== 'undefined' && node.tpl_type == 'select') {
                        Vocabset.activeEventCheck();
                    } else {
                        Vocabset.pointerEventsCheck();
                    }
                }

                var checkIntroDisplay = $('.' + intro_key);
                if (checkIntroDisplay != undefined && !checkIntroDisplay.is(':visible')) {
                    $('.' + intro_key).show();
                }

                if ($('.jp-play:visible').length == 0) {//khi không có audio nào cả
                    $('.jp-stop').trigger('click');
                } else {
                    if ($('.jp-state-playing:visible').length == 0) {
                        $($('.jp-play:visible')[0]).trigger('click');
                    }
                }
                if (Test.exam_iid && !Test.finished) {
                    CourseViewer.display_check_next('nav-exam');
                } else if (Test.exam_iid && Test.finished) {
                    CourseViewer.display_check_next('next-item');
                } else if ($('#exercise-result').is(":visible") && Test.finished) {
                    CourseViewer.display_check_next('exercise-result');
                } else if ($('#next-item').is(":visible") && Test.finished) {
                    CourseViewer.display_check_next('next-item');
                }
                $('#next_check_exam').show();

            }

            var $navLi = Test.$get_exercise_nav().find("li[data-iid='" + iid + "']");
            $navLi.addClass('active').siblings().removeClass('active');
        },

        show_group_question: function (iid) {
            $('#exercise-wrapper .question_wrapper').hide();
            var $div = $(".question_wrapper[data-iid='" + iid + "']");
            Test.nav_forcus_question_group(iid, $div.data('group'));
            var group_id = "#group-" + $div.data('group');
            Test.currentGroup = $(group_id).data('group');
            var $group = $(group_id + " .question_wrapper").show();

            $(document).scrollTo($div);
            var y = $(window).scrollTop();
            var h = $('#page-wrap .top-nav').height();
            $(window).scrollTop(y - h);

            var $sticky = $(".instruction .c-intro-sticky[data-sticky='" + $div.data('sticky') + "']");
            if (!$sticky.length) {
                $('.c-intro-sticky').hide();
            }
            if ($sticky.length) {
                $('.c-intro-sticky').hide();
                $sticky.show();
            }
            var tmp = '(' + Test.currentGroup + "/" + Test.sumGroup + ')';
            $('.count_question').html(tmp).show();
        },

        allow_question_navigation: function () {
            if (Take.finished ||
                Sand.configs.APPLICATION_ENV == "development"
                || (typeof Edx.editing_syllabus != 'undefined' && Edx.editing_syllabus)
                || Test.exam_iid
            )
                return true;
        },
        /***********************************************************/
        /*************************callbacks*************************/
        /***********************************************************/
        review_exercise: function ($el, json, params) {
            $el.hide();
            $('.c-intro-sticky').show();
            $('.question_wrapper').show();
            $("#nav-question-exe-simpl").show();
        },

        redo_exercise: function ($el, json, params) {
            if (Test.exam_iid) {
                location.reload();
            }
            else {
                $('div.question_wrapper, .reset-show-wrong-all-answer').hide();
                $('#exercise-box-result, .show-wrong-all-answer').show();
            }
            $('#ex-user-nr-key').html(0);
            CourseViewer.reload_item();
        },

        nav_forcus_question_group: function (question, group) {
            var $nav_group = $('#nav-question-exe-simpl .question-navigation');
            $nav_group.removeClass('active');
            $('#nav-question-exe-simpl').find(".question-nav").removeClass('active');
            var $group = $('#nav-question-exe-simpl').find(".question-navigation[data-group='" + group + "']").addClass('active');
            var index = $nav_group.index($group);
            if (index == 0) {
                $('#back-exam').addClass('pointer-vents');
            }
            if (!Test.exam_iid) {
                $('#nav-question-exe-simpl .question-navigation').css({
                    'pointer-events': 'none',
                });
                $group.css({
                    'pointer-events': 'auto',
                });
            }
            var $question = $('#nav-question-exe-simpl').find(".question-nav[data-iid='" + question + "']");
            $question.addClass('active  preview');
            var question_tpe = $question.data('type');
            if (question_tpe != 2 && question_tpe != 1) {
                $question.addClass('visited');
            } else if (question_tpe == 1) {
                var node = Tree.get_node(question);
                if (node.tpl_type != 'typing')
                    $question.addClass('visited');
            }
            var $nav = $("span.question-nav[data-iid='" + question + "']");
            if (!$nav.visible(true, false, 'horizontal')) {
                $("#exercise-nav").scrollTo($nav);
            }
            Test.save_answers_to_local_storage();
        },

        save_answers_to_local_storage: function () {
            if (!Test.exam_iid) {
                return;
            }
            Take.attempts.answers = Take.attempts.answers || {};
            $('#exercise-nav span.question-nav.visited a').each(function (i, e) {
                var iid = $(this).data('iid');
                var $question = $(".question_wrapper[data-iid='" + iid + "']");
                var data = {
                    answer: [],
                    type: ''
                };
                data.type = $question.data('type');
                var mod = Test[Test.question_modules_mapping(data.type)]; //Test.inline (for example)
                //Step 1. user's answer
                var exid = Tree.get_pid(iid);
                data.answer = mod.get_user_answer(exid, iid, data.answer);
                Take.attempts.answers[iid] = data;
            });
            var user = User.get_user();
            var answer = {
                uiid: user.iid,
                iid: Test.exam_iid,
                answer: Take.attempts.answers,
                time: Test.timer.seconds_passed
            };
            localStorage.setItem(Take.saveResultKey, JSON.stringify(answer));
        },

        /*******************************************************/
        /********************Sand callbacks*********************/
        /*******************************************************/
        navigate_question: function ($el, json, params) {
            //a.question-ajax
            if (Test.allow_question_navigation()) {
                Test.show_question($el.data('iid'));
                var $p = $(this).parent();
                $p.siblings().removeClass('active');
                $p.addClass('active');
            }
        }
    });


    //Next question
    $(document).on('click', ".next-default-none", function () {
        if (Recorder.recognizing) {
            recognitionGoogle.stop();
        }
        if (CourseViewer.ntype == 'exercise' &&
            Test.exam_iid &&
            $("#next-item").is(":visible")) {
            CourseViewer.next_snippet(Test.exam_iid);
        } else if (CourseViewer.ntype == 'exercise' && !$("#check-answer").is(":visible") && !Test.exam_iid) {
            var next = Tree.next_sibling(CourseViewer.current_iid, Test.current_question);
            if (next) {
                Test.show_question(next);
            }
            else {
                if (!Test.exam_iid) {
                    Test.show_question('summary');
                }
                else //exam mode
                {
                    var n = Tree.get_next_sibling(parseInt(CourseViewer.current_iid));
                    if (n)
                        CourseViewer.load_item(n, 'exercise');
                    else
                        Test.show_question('exam-summary');
                }

            }
        } else if (CourseViewer.ntype == 'vocabset') {
            if ($("#next-item").is(":visible")) {
                $('#next-snippet').trigger('click');
            } else {
                Vocabset.nextQuestion();
            }
        } else if (CourseViewer.ntype == 'dictation') {
            if ($("#show-speak").is(":visible")) {
                Dictation.display_tplSpeak();
                Dictation.start_speak(Recorder.supportSpeak);
                CourseViewer.display_check_next('next-item');
            } else {
                Dictation.nextVocab();
            }
        } else if (CourseViewer.ntype == 'video') {
            $('#next-snippet').trigger('click');
        }
    });

    $(document).on('click', 'select.user_answer', function () {
        Vocabset.activeEventCheck();
    });

    $(document).on('click keydown', '#exercise-wrapper .exercise-wrapper .question_wrapper ', function () {
        if ($(this).is(":visible")) {
            var group_id = $(this).data('group');
            var question_iid = $(this).data('iid');
            Test.nav_forcus_question_group(question_iid, group_id);
        }
    });

    $(document).on('click', '#skip-snippet', function () {
        var iid = CourseViewer.current_iid;
        // var from = CourseViewer.current_from;
        if (CourseViewer.ntype == 'exercise' || CourseViewer.ntype == 'dictation') {
            localStorage.setItem(Dictation.localStorageKey, 1);
            Dictation.checkWatchIntro();
        }
        // CourseViewer.display_item(iid, from);
        $('a[data-iid="' + iid + '"]').trigger('click');
        $('#skip-snippet').hide();
    });

    $(document).on('click', '#nav-question-exe-simpl .question-navigation span.question-nav', function () {
        $(this).find('a').trigger('click');
    });

    $(document).on("focus change keydown paste input", ".question_wrapper .inline_input", function () {
        if ($('.inline_input').val()) {
            var $question = $(this).parents('div.question_wrapper');
            $('#nav-question-exe-simpl').find(".question-nav[data-iid='" + $question.data('iid') + "']").addClass('visited');
        }
    });

});
