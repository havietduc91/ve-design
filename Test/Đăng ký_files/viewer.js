$(document).ready(function () {
    CourseViewer = $.extend(CourseViewer, {
        display_everything: function () {
            if ('webkitSpeechRecognition' in window) {
                Recorder.supportSpeak = true;
            } else {
                Recorder.supportSpeak = false;
            }
            if (typeof Edx.url_learn_course != 'undefined' && Edx.url_learn_course) {
                alert(Edx.message);
                window.location.replace(Edx.url_learn_course);
            }
            if (Edx.learning_type != 'koncept' && !CourseViewer.start_link) {
                Tracker.get_tracking(
                    [Edx.course_iid],
                    {where: 1, ciid: Edx.course_iid},
                    function (data) {
                        // tra ve data la iid cua sub-item va navigation
                        // wr view right ; wl view left
                        if (data != false) {
                            CourseViewer.wl = data.wl || null;
                            CourseViewer.wr = data.wr || null;
                        }
                        CourseViewer.event_click_snippet();
                    }
                );
            } else {
                CourseViewer.event_click_snippet();
            }
        },
        min_height_content: function ($type) {
            var $h = $(window).height();
            if ($type == 'submit_exam') {
                $('#blackboard-left').css({'min-height': $h + 'px'});
            } else {
                if (Test.exam_iid) {
                    $('#blackboard-left').css({'min-height': '150px'});
                } else {
                    $('#blackboard-left').css({'min-height': $h + 'px'});
                }
            }
        },
        event_click_snippet: function () {
            var tag1 = 'a.snippet[data-iid=' + CourseViewer.wr + ']';
            var tag2 = 'a.snippet[data-iid=' + CourseViewer.wl + ']';
            if (Edx.learning_type != 'koncept' && $(tag1).length && CourseViewer.wr != null) {
                $(tag1)[0].click();
            } else if (Edx.learning_type != 'koncept' && $(tag2).length && CourseViewer.wl != null) {
                CourseViewer.wr = CourseViewer.wl;
                CourseViewer.wl = null;
                $(tag2)[0].click();
            } else {
                $('.list-item-body a.snippet:eq(0)')[0].click();
            }
        },

        bind_click: function () {
            $(document).on('click', '.snippet', function (e) {
                e.preventDefault();
                //TODO: if it's loading something we have to return...
                if (CourseViewer.loading_iid) {
                    //TODO: cancel_loading the item?
                    //CourseViewer.cancel_loading(CourseViewer.loading_iid);
                    return false;
                }

                var $a = $(this);//.find('a');
                var iid = $a.data('iid');
                var ntype = $a.data('ntype');
                var from = $a.data('from');

                if (!CourseViewer.allowed_to_view_item(iid, ntype, from)) {
                    alert(Edx.message_block_to_view_item);
                    return;
                }

                CourseViewer.load_item(iid, ntype, from)
                //CourseViewer.click_menu_list($a);
            });
        },

        load_note: function () {

        },

        load_comment: function () {

        },

        set_display_mode: function () {

        },

        hide_title: function () {
            $('#blackboard-title').hide();
        },

        display_title: function (item) {
            var name = '';

            if (typeof item == 'string') {
                item = {name: item};
            } else {
                if (typeof item.vname != 'undefined' && item.vname != '') {
                    item.name = item.vname;
                }
                if (item.ntype == 'exercise') {
                    item.is_exersice = true;
                }
            }

            $('#blackboard-title').html(
                Sand.template.render(
                    Sand.get_template('course', 'item_title'),
                    item)
            ).show();
        },

        display_video_intro: function (item, type) {
            //item{st,et,duration, vid, name}
            //type : intro
            $('#blackboard-right').html('');
            if (type == 'intro') {
                // alert("render overlay for dictation");
            }
            CourseViewer.display_title(item.name);
            CourseViewer.play_video.vid_current = item.vid;
            CourseViewer.play_video.currentIid = 'playOtherVideo';
            $("#play-youtube").show();
            if ('loadVideoById' in CourseViewer.play_video) {
                // CourseViewer.check_display_video = true;
                CourseViewer.play_video.loadVideoById({
                    videoId: CourseViewer.play_video.vid_current,
                    playerVars: {rel: 0}
                });

                CourseViewer.auto_play_video();
            } else {
                CourseViewer.check_video_ready();
            }
            CourseViewer.display_check_next('skip-snippet');
        },

        hide_outline_learn: function () {
            if (Sand.utils.is_mobile()) {
                $('#nav-right-outline').removeClass('active');
            }
        },

        display_check_next: function (type) {
            $('#exercise-buttons-wrapper a').hide();
            if (type == 'contest') {
                $('#exercise-buttons-wrapper').hide();
                $('#display-time-vocab').show();
                return;
            }
            else if (type == 'hide_all') {
                $('#check-answer-question-fixed').hide();
                $('#question-check-buttons').hide();
                return;
            } else if (type == 'nav-exam') {
                $('#question-check-buttons').hide();
                $('#check-answer-question-fixed').show();
                return;
            }
            $('#display-time-vocab').hide();
            $('#question-check-buttons').show();
            $('#exercise-buttons-wrapper').show();
            $('#check-answer-question-fixed').show();

            $('.next-default-none').hide();
            switch (type) {
                case 'check-answer':
                    $('#check-answer').show();
                    break;
                case 'next-item':
                    $('#next-item').show();
                    break;
                case 'next-question':
                    $('#next-question').show();
                    break;
                case 'exercise-result':
                    $('#exercise-result').show();
                    break;
                case 'next-video':
                    $('#next-video').show();
                    break;
                case 'show-speak':
                    $('#show-speak').show();
                    break;
                case 'skip-snippet':
                    $('#skip-snippet').show();
                    break;
                default:
                    break;
            }

        },

        auto_play_video: function () {
            CourseViewer.play_video.playVideo();
        },

        display_sco: function (iid, from) {
            var item = Tree.get_node(iid);
            CourseViewer.display_subnav(item);
        },

        is_locked: function (iid) {
            if (Sand.utils.is_guest() && typeof Edx.tcos_price != 'undefined' && Edx.tcos_price[iid] > 0) {
                return true;
            } else if (Tracker.get_progress(iid) == 'locked')
                return true;
            else
                return false;
        },

        display_unlock_course: function (iid) {
            CourseViewer.stop_video();
            if (typeof Edx.path_unlock && Edx.path_unlock) {
                var html = Sand.template.render(
                    Sand.get_template('course', 'unlock_by_path'), Edx.path_unlock);
                Sand.set_html('#blackboard-content', html, true);
            } else {
                Sand.load_templates([
                    'course|unlock',
                ], function () {
                    var item = {
                        iid: iid,
                        price: Edx.course_price,
                        ciid: Edx.course_iid
                    };
                    var html = Sand.template.render(
                        Sand.get_template('course', 'unlock'),
                        item);
                    $('#blackboard-content').html(html).show();
                    //query for balance
                    Sand.ajax.ajax_request({
                        url: "/user/balance",
                        dataType: 'json',
                        success: function (json) {
                            if (json.result) {
                                User.change_token_balance(
                                    json.result.m,
                                    json.result.vm
                                );
                            }
                        },
                        error: function () {

                        }
                    });
                });
            }
            CourseViewer.enable_snippet_click();
        },

        load_item: function (iid, ntype, from) {
            CourseViewer.show_loading(iid);

            //set default display_full is false
            CourseViewer.play_video.display_full = false;

            var node = Tree.get_node(iid);
            var load_children = false;
            if (typeof node.speaking_type != 'undefined' &&
                node.speaking_type == 'dictation') {
                if (node.children.length && typeof node.children[0].childrenIids !== 'undefined'
                    && node.children[0].childrenIids.length) {
                    load_children = false;
                } else {
                    load_children = true;
                }
            } else {
                load_children = false;
            }
            if ((!CourseViewer.is_locked(iid) && Tree.needs_reload(node)) || load_children) {
                var params = {iid: iid, ntype: ntype};
                if (typeof node.ntype != 'undefined' && Tree.is_list(node.ntype))
                    params.depth = 3;
                else
                    params.depth = 0;

                if (load_children) {
                    params.depth = -1;
                }

                Tree.load_async(params, function () {
                    CourseViewer.display_item(iid, from);
                });
            }
            else
                CourseViewer.display_item(iid, from);
        },

        reload_item: function () {
            CourseViewer.load_item(
                CourseViewer.current_iid,
                CourseViewer.current_ntype,
                CourseViewer.current_from
            );
        },

        display_item: function (iid, from) {
            window.scrollTo(0, 0);
            EdxPlayer.stop();
            CourseViewer.stop_video();
            $("#play-video-area").jPlayer("stop");
            $('#content-course').show();
            $('#finish-course').hide();
            $("#title-timer").hide();
            Sand.set_html('#video-content-wrap', '');
            Sand.set_html('#slide-content-wrap', '', false);
            $("#subnav-bottom").hide();
            $('.score-sb, .wcheck-item').hide();
            if (from == 'right') {
                var $li = $(".snippet[data-iid='" + iid + "']").closest('li');
                $li.closest('.list-item-body').find("li").removeClass('active');
                $li.addClass('active');
            }
            else  //active subnav
            {
                var $li = $(".snippet[data-iid='" + iid + "']").closest('li');
                $li.addClass('active').siblings().removeClass('active');
            }


            //hide title
            CourseViewer.hide_title();
            CourseViewer.hide_loading();
            CourseViewer.checkDisplay = false;

            var item = Tree.get_node(iid);

            CourseViewer.current_iid = iid.toString();
            CourseViewer.current_ntype = item.ntype;
            CourseViewer.current_from = from;

            CourseViewer.ntype = item.ntype;
            if (CourseViewer.start_link) {
                CourseViewer.start_link = false;
            } else if (Edx.learning_type != 'koncept') {
                CourseViewer.track(iid, from);
            }

            if (item.ntype == 'sco') {
                CourseViewer.show_subnav();
            }
            else if (from == 'right') {
                CourseViewer.hide_subnav();
            }
            Sand.set_html('#blackboard-right', '');
            if (CourseViewer.is_locked(iid) && Edx.learning_type != 'koncept') {
                CourseViewer.display_unlock_course(iid);
            } else {
                $('#exercise-buttons-wrapper').css({
                    'padding-bottom': '15px'
                });
                switch (item.ntype) {
                    case 'sco':
                        CourseViewer.checkDisplay = true;
                        CourseViewer.display_sco(iid, from);
                        break;
                    case 'video':
                        Tracker.save_progress_multi([{
                            tco_iid: iid,
                            p: 100
                        }]);
                        if (item.type == 'text') {
                            CourseViewer.display_check_next('next-item');
                            CourseViewer.display_title(item);
                            Sand.set_html('#video-content-wrap', '<div class="content-grammar">' + item.content + '</div>', true);
                        } else if (item.type == 'pdf' || item.type == 'ppt') {
                            CourseViewer.display_slide(iid, from);
                        } else {
                            CourseViewer.display_video(iid, from);
                        }
                        $("#sidebar-tip").show();
                        break;
                    case 'exercise':
                        CourseViewer.display_exercise(iid, from);
                        $("#nav-question-exe-simpl").show();
                        break;
                    case 'vocabset' :
                        Vocabset.load_vocabset(item);
                        break;
                    default:
                        console.log("item type not supported");
                }
            }

            if (CourseViewer.showMenu != 0) {
                var checkShowMenu = window.location.hash;
                var showMenuInUrl = "showmenu";
                if (checkShowMenu.indexOf(showMenuInUrl) != -1) {
                    $('#nav-right-outline').addClass('active');
                }
                CourseViewer.showMenu = 0;
            }
            if (Edx.learning_type != 'koncept') {
                if (typeof item.pid != 'undefined' && item.pid != "") {
                    Sand.url.goto_hashbang('/' + CourseViewer.current_ntype + '/' + item.pid + '.' + item.iid);
                } else
                    Sand.url.goto_hashbang('/' + CourseViewer.current_ntype + '/' + item.iid);
            }

            CourseViewer.click_menu_list($li);
            CourseViewer.min_height_content();
        },

        auto_resize_video: function () {
            if ($('#play-youtube').is(":visible")) {
                var xxx = $('#play-youtube').width();
                var zzz = (xxx * 9) / 16 - 150;
                $('#ytplayer').css({'height': zzz + 'px'});
            }
        },
        show_loading: function (iid) {
            CourseViewer.loading_iid = iid;
            Sand.utils.show_ajax_loading();
            CourseViewer.disable_snippet_click();
        },

        hide_loading: function () {
            CourseViewer.loading_iid = false;
            Sand.utils.hide_ajax_loading();
            CourseViewer.enable_snippet_click();
        },

        finish_course: function () {
            CourseViewer.stop_video();
            EdxPlayer.stop();
            $('#content-course').hide();
            CourseViewer.display_check_next('hide_all');
            if (Edx.path_iid != 0) {
                Sand.ajax.ajax_request({
                    url: "/api/v1/syllabus/get?ntype=path&depth=2&iid=" + Edx.path_iid,
                    dataType: 'json',
                    data: {},
                    success: function (json) {
                        var ciid = 0;
                        for (i in json.result.children) {
                            ciid = json.result.children[i].iid;
                            if (ciid == Edx.course_iid) {
                                json.result.children[i].current_class = 'active';
                            } else {
                                json.result.children[i].current_class = ' ';
                            }
                        }
                        var html = Sand.template.render(
                            Sand.get_template('course', 'item_finish'),
                            json);
                        $("#c-learn-path-wrap").html(html);
                    },
                    error: function () {

                    }
                });
            } else {
                var min_height = $(window).height();
                $('#finish-course').css({'min-height': min_height + 'px'});
                $('.finish-course').css({'margin-top': '150px'});
            }

            var content = $('#top-nav-course h4.size-course-top').html();
            var html = Sand.template.render(
                Sand.get_template('course', 'course_finish'), {content: content});
            Sand.set_html('#finish-course', html, true);
            // $('#finish-course').show();
            $('#nav-right-outline').removeClass('active');
            Sand.url.goto_hashbang('');
            Sand.utils.playBackground('correct');
        },

        menu_toggle: function () {
            $('.section-learn-outline .section-title-toggle').click(function (e) {
                if (CourseViewer.showMenu == 0) {
                    var edx_this = $(this);
                    var edx_parent = edx_this.closest('.outline-learn-body');

                    $activeSection = edx_parent.find('.section-learn-outline.active');
                    $activeSection.removeClass('active');
                    if ($activeSection.data('iid') !== edx_this.closest('.section-learn-outline').data('iid')) {
                        edx_this.closest('.section-learn-outline').addClass('active');
                    }
                }
            });
        },

        click_menu_list: function (edx_this) {
            var edx_parent = edx_this.closest('.section-learn-outline');
            if (!edx_parent.hasClass('active')) {
                edx_parent.find('.section-title-toggle').trigger('click');
            }
        }
    });
});