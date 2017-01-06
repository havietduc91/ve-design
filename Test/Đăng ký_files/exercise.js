$(document).ready(function () {
    CourseViewer = $.extend(CourseViewer, {
        display_audio: function (item) {
            edx_id = item.iid;
            if (item['audio'].length == 1) {
                EdxJplayer[edx_id] = {
                    'id': edx_id,
                    'is_list': false,
                    'path': item.audio[0].path,
                    'play_id': 'ejplay-' + edx_id,
                    'container_id': 'ejcon-' + edx_id
                };

                item.audio_info = {
                    'id': edx_id,
                    'play_id': 'ejplay-' + edx_id,
                    'container_id': 'ejcon-' + edx_id,
                };

                item.audio_display = Sand.template.render(
                    Sand.get_template('site', "audio_single"),
                    item);
            } else if (item['audio'].length > 1) {
                var audio_list = [];
                $.each(item.audio, function (i, e) {
                    audio_list.push({
                        title: e.name,
                        mp3: e.path
                    });
                });

                EdxJplayer[edx_id] = {
                    'id': edx_id,
                    'paths': audio_list,
                    'is_list': true,
                    'play_id': 'ejplay-' + edx_id,
                    'container_id': 'ejcon-' + edx_id
                };

                item.audio_info = {
                    'id': edx_id,
                    'play_id': 'ejplay-' + edx_id,
                    'container_id': 'ejcon-' + edx_id,
                };

                item.audio_display = Sand.template.render(
                    Sand.get_template('site', "audio_list"),
                    item);
            } else {
                item.audio_display = '';
            }

            return item.audio_display;
        },
        display_exercise: function (iid, from) {
            var item = Tree.get_node(iid);

            if (item.exam_iid) {
                if (Test.exam_iid && Test.exam_iid != item.exam_iid) {
                    alert("You are taking another test");
                    return;
                }
                else if (!Test.exam_iid) {
                    Test.display_exam_start_screen(item.exam_iid);
                    return;
                }
                else {
                    if (CourseViewer.current_iid != item.iid) {
                        Test.load_exam_exercise(item.iid);
                    }
                }
            }
            else {
                Take.attempts.answers = false;
                Test.exam_iid = false;
            }

            if (!item.exam_iid)
                Take.reset(iid);
            var item = Tree.get_node(iid);

            if (typeof item.speaking_type != 'undefined' &&
                item.speaking_type == 'dictation') {
                Dictation.init();
                if (!Dictation.watchIntro) {
                    Dictation.showIntro();
                    return true;
                }
            }

            //$('#exercise-buttons-wrapper,#question-check-buttons').show();
            CourseViewer.display_check_next('next-question');

            CourseViewer.display_title(item);

            //display question list
            if (typeof item.speaking_type != 'undefined'
                &&
                item.speaking_type == 'dictation') {
                CourseViewer.ntype = 'dictation';
                Dictation.start(item, from);
            }
            else {
                CourseViewer.stop_video();

                if (!item.exam_iid) {
                    Sand.clear_plugins();
                    //Exercise area
                    Test.sumGroup = 0;
                    Test.sumQuestion = 0;
                    Test.finished = false;
                    html = CourseViewer.render_exercise_html(item);
                    Sand.set_html("#blackboard-content", html, true);
                    if (!Sand.utils.is_mobile()) {
                        Test.fix_height_answers();
                    }
                }

                CourseViewer.display_exercise_nav(item.iid);

                //Sand.form.bind_plugins($("#blackboard-content"));
                //TODO: bind plugin...
                //TODO: trigger cau hoi dau tien
                if (Sand.utils.is_mobile()) {
                    Sand.set_html("#blackboard-right", '', false);
                }

                CourseViewer.load_exercise_first_question(item);

                $('#exercise-buttons-wrapper').css({
                    'padding-bottom': '0px'
                });
            }
            Loading.disable();
        },

        render_exercise_html: function (item) {
            var questions = '';
            var group_question = '';
            var group = '___';
            var group_id = '';
            var item_groups = [];
            var item_group = [];
            var index_groups = 0;
            var iid_sticky = '___';
            for (var i in item.children) {
                if (typeof item.hide_help != 'undefined' && item.hide_help == 1) {
                    item.children[i].hide_help = 1;
                }
                if (group != '___' && group != item.children[i]['group']) {
                    var tmp = {group_id: group_id, content: group_question, g_index: Test.sumGroup + index_groups + 1};
                    if (item_group.length == 1) {
                        tmp.display_one = 1;
                    }
                    questions = questions + Sand.template.render(
                            Sand.get_template('question', 'wrapper_group'), tmp);
                    group_question = '';
                }
                if (typeof item.children[i].iid_sticky != 'undefined' &&
                    item.children[i].iid_sticky != iid_sticky) {
                    iid_sticky = item.children[i].iid_sticky;
                    questions = questions + item[iid_sticky];
                }
                if (group == '___' || group != item.children[i]['group']) {
                    if (group != '___') {
                        var tmp = {group: item_group, group_id: group_id};
                        if (item_group.length == 1) {
                            tmp.display_one = 1;
                        }
                        item_groups.push(tmp);
                        index_groups++;
                        item_group = [];
                        index_group = 0;
                    }
                    group = item.children[i]['group']
                    group_id = item.children[i]['id'] + "-" + item.children[i]['group'];
                }
                item.children[i]['group'] = group_id;
                Test.sumQuestion++;
                item.children[i]['index'] = Test.sumQuestion;
                item_group.push(item.children[i]);
                group_question = group_question + CourseViewer.render_question_html(item.children[i]);
                if (i == (item.children.length - 1)) {
                    var tmp = {group_id: group_id, content: group_question, g_index: Test.sumGroup + index_groups + 1};
                    questions = questions + Sand.template.render(
                            Sand.get_template('question', 'wrapper_group'), tmp);
                    var tmp = {group: item_group, group_id: group_id};
                    if (item_group.length == 1) {
                        tmp.display_one = 1;
                    }
                    item_groups.push(tmp);
                    Test.sumGroup = Test.sumGroup + item_groups.length;
                }
            }

            item.exercise_content = questions;
            if (typeof item.exam_iid == 'undefined') {
                item.exercise_content = item.exercise_content + CourseViewer.render_exercise_summary();
            }
            item.groups = item_groups;

            Tree.save_node(item);

            var html = Sand.template.render(
                Sand.get_template('question', 'exercise'),
                item);
            return html;
        },

        display_exercise_nav: function (iid) {
            $("#subnav-bottom").show();
            Sand.set_html('#blackboard-right', '');
            var item = Tree.get_node(iid);
            var exercises = [];
            var html = '';
            if (item.exam_iid) {
                var $nav = $("#nav-question-exe-simpl .question-navigation[data-iid='" + iid + "']");
                if ($nav.length) {
                    return;
                }
                var p_node = Tree.get_node(item.pid);
                for (var i = 0; i < p_node.children.length; i++) {
                    var tmp_node = Tree.get_node(p_node.children[i].iid);
                    var $nav = $("#exercise-nav .c-exam-exercise[data-iid='" + tmp_node.iid + "']");
                    if ($nav.length) {
                        return;
                    }
                    html = html + '<div class="c-exam-exercise" style="display:inline-block; color:#02a8f3;" data-iid="' + tmp_node.iid + '">';
                    html = html + '<i class="fa fa-star "></i>';
                    html = html + '</div>';
                    html = html + Sand.template.render(
                            Sand.get_template('course', 'question_li'),
                            tmp_node);
                }

            } else {
                html = html + Sand.template.render(
                        Sand.get_template('course', 'question_li'),
                        item);
            }
            var htmls = '<div id="nav-question-exe-simpl" class="s-nav-question-exe-simpl">';
            htmls = htmls + '<div id="exercise-nav" class="s-exercise-nav">'
            htmls = htmls + html;
            htmls = htmls + '</div></div>'
            $("#nav-question-exe-simpl").show();
            Sand.set_html('#subnav-bottom', htmls, true);
        },

        load_exercise_first_question: function (item) {
            var qid;
            if (item.exam_iid) {
                //TODO Load previous question
                qid = item.childrenIids[0];
            }
            else {
                $(".question_wrapper span.c-tq-stick-note").hide();
                qid = item.childrenIids[0];
            }

            Test.show_question(qid);
            $("#blackboard-content").show();

        },

        render_exercise_summary: function () {
            var params = {'can_review': 1, 'can_redo': 1};
            if (Test.exam_iid) {
                params.exam_iid = Test.exam_iid;
                var item = Tree.get_node(Test.exam_iid);
            } else {
                var item = Tree.get_node(CourseViewer.current_iid);
            }
            params.can_review = (item.can_review != undefined) ? item.can_review : 1;
            params.can_redo = (item.can_redo != undefined) ? item.can_redo : 1;
            return Sand.template.render(
                Sand.get_template('question', 'exercise_summary'),
                params);
        },

        //1 question HTML
        render_question_html: function (q) {
            var hasAnswers = ['inline', 'mc', 'matching_pairs', 'reorder'];
            var template = Test.question_modules_mapping(q.type);
            if (q.type == Question.TYPES.MC) {
                var tpl_type = q.tpl_type;
                q.question_answer = '';
                var tpl = '';
                if (Test.exam_iid) {
                    tpl = Sand.get_template('question', 'exam_' + tpl_type);
                }
                if (typeof tpl == 'undefined' || tpl == '') {
                    tpl = Sand.get_template('question', tpl_type);
                }
                q.question_content = Sand.template.render(tpl, q);
            } else {
                if (hasAnswers.indexOf(template) != -1) {
                    q.question_answer = Sand.template.render(
                        Sand.get_template('question', template + "_answer"),
                        q);
                }

                q.question_content = Sand.template.render(
                    Sand.get_template('question', template),
                    q);
            }

            //render audio
            // var d = new Date();

            if (typeof q['audio'] != 'undefined') {
                q.audio_display = CourseViewer.display_audio(q);
            }
            var tpl = '';
            if (Test.exam_iid) {
                tpl = Sand.get_template('question', 'exam_wrapper');
            }
            if (typeof tpl == 'undefined' || tpl == '') {
                tpl = Sand.get_template('question', 'wrapper');
            }
            var html = Sand.template.render(tpl, q);
            return html;
        },
    });
});