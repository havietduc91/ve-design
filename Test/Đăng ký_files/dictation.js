var Dictation;
$(document).ready(function () {
    $('body').on('click', '#return-video-dictation', function (e) {
        $('#dictation-timeline-ul .timeline-li.active').trigger('click');
        e.preventDefault();
    });

    Dictation =
    {
        init: function () {
            Dictation.bindAnswerEvents();
            Dictation.checkWatchIntro();
        },
        item: [],
        next_vocab: {},
        from: "",
        index: 0,
        count: 0,
        item_play: {},
        videoIntro: Edx.videoIntroDictation,
        watchIntro: false,
        isWatchIntro: false,
        iids: [],
        oneLevel: false,
        children: [],
        localStorageKey: 'userwatchIntroDictation',
        showIntro: function () {
            var itemIntro = {
                vid: Dictation.videoIntro,
                name: 'Giới thiệu về bài tập dictation'
            };
            Dictation.isWatchIntro = true;
            CourseViewer.display_video_intro(itemIntro, 'intro');
            return;
        },
        checkWatchIntro: function () {
            if (localStorage.getItem(Dictation.localStorageKey)) {
                Dictation.watchIntro = true;
            }
        },
        start: function (item, from) {
            Recorder.init();
            Dictation.from = from;
            Dictation.setDisplayItem(item);
            Dictation.display_navigation(item.children);
            // Recorder.blockSpeak = false;
        },
        display_navigation: function (children) {
            var children_nav = {};
            var vocabsetIid = -1;
            if (!Dictation.oneLevel) {
                vocabsetIid = children[0].iid;
                children_nav = {children: children};
                children_nav['two_col'] = true;
            }
            var html = Sand.template.render(Sand.get_template('course', 'dictation_nav'), children_nav);
            Sand.set_html('#subnav-bottom', html, false);
            $('#dictation_vocabset_nav').hide();
            Dictation.display_children_navigation(vocabsetIid);
        },
        display_children_navigation: function (piid) {
            var children_nav = {};
            if (!Dictation.oneLevel) {
                children_nav = Tree.get_node(piid);
            } else {
                children_nav = {children: Dictation.children};
            }
            var html = Sand.template.render(Sand.get_template('question', 'vocab_nav'), children_nav);
            Sand.set_html('#dictation_vocab_nav', html, true);
            $('#subnav-bottom').show();
            if (Dictation.oneLevel) {
                $('#dictation_vocab_nav').removeClass('col-xs-2');
            }
            $('#dictation_vocab_nav').find("li:eq(0)").trigger('click');
        },
        play_video: function (iid) {
            // Dictation.display_button('video');
            Dictation.item_play = Tree.get_node(iid);
            Recorder.vocabsetIid = Dictation.item_play.pid;
            $('#blackboard-content').hide();
            CourseViewer.play_video.display_full = false;
            CourseViewer.display_video(iid, Dictation.from, 'dictation');
        },
        setDisplayItem: function (item) {
            if (Dictation.item == {} || Dictation.item.iid != item.iid) {
                Dictation.item = {};
            }

            if (!Dictation.item.length) {
                Dictation.index = 0;
                Dictation.item = item;
                Dictation.next_vocab = {};
                Dictation.count = 0;
                var tCount = 0;
                var oneLevel = true;
                Dictation.children = [];
                for (var i in item.children) {
                    var tmp = item.children[i];
                    Dictation.iids[tCount++] = tmp.iid;
                    Dictation.next_vocab[Dictation.count++] = {0: tmp.iid, 1: tmp.iid};
                    if (tmp.children.length > 1) {
                        oneLevel = false;
                    }
                    for (var ii in tmp.children) {
                        if (oneLevel) {
                            Dictation.children.push(tmp.children[ii]);
                        } else {
                            oneLevel = false;
                        }
                        Dictation.iids[tCount++] = tmp.children[ii].iid;
                        Dictation.next_vocab[Dictation.count++] = {0: tmp.iid, 1: tmp.children[ii].iid};
                    }
                }
                if (oneLevel) {
                    Dictation.oneLevel = oneLevel;
                }
                Tracker.get_tracking(Dictation.iids, {}, function (progress) {
                    Dictation.displayProgressVocab(progress);
                });
                Dictation.displayView(Dictation.next_vocab[0]);
            } else {
                Dictation.displayView(Dictation.next_vocab[Dictation.index]);
            }
            // if(Sand.utils.is_mobile()){
            //     $('#blackboard-left').css({'min-height': 0 + 'px'});
            // }else{
            //     var height = $(window).height();
            //     var height_top = $('#top-nav-course').height();
            //     var height_check_question = $('#check-answer-question-fixed').height();
            //     var height_title = $('#blackboard-title').height();
            //     var min_height = height - height_top - height_check_question + height_title;
            //     if($('#blackboard-sub-nav').is(":visible")){
            //         min_height += $('#blackboard-sub-nav').height();
            //     }
            //     $('#blackboard-left').css({'min-height': min_height + 'px'});
            // }
        },
        displayView: function (item) {
            if (Dictation.oneLevel && item[0] == item[1]) {
                return Dictation.nextVocab();
            }
            if (item[0] == item[1]) {
                $('#dictation_vocabset_nav').find("li[data-iid='" + item[1] + "']").trigger('click');
            } else {
                var data_iid = item[0] + "-" + item[1];
                $('#dictation_vocab_nav').find(" .timeline-li[data-iid='" + data_iid + "']").trigger('click');
            }
        },
        getIndexNext: function (data_iid) {
            var tmp = data_iid.split("-");
            for (var i = 0; i < Dictation.count; i++) {
                if (Dictation.next_vocab[i][0] == tmp[0] && Dictation.next_vocab[i][1] == tmp[1]) {
                    Dictation.index = i;
                    break;
                }
            }
            return tmp;
        },
        nextVocab: function () {
            Dictation.index += 1;
            $('#blackboard-content').hide();
            if (Dictation.index < Dictation.count) {
                Dictation.displayView(Dictation.next_vocab[Dictation.index]);
            } else {
                $('#next-snippet').trigger('click');
            }
        },
        start_speak: function (checkDisplay) {
            CourseViewer.stop_video();
            $('#try-again-question').hide();
            Recorder.textDisplay = Dictation.item_play['name'];
            Sand.set_html('#final_span', Recorder.textDisplay, true);
            if (!checkDisplay) {
                $('#start_button').css({
                    'pointer-events': 'none',
                });
                $('#messenger_display').show();
                $('#start_button').html('<i class="fa fa-microphone-slash"></i>');
            } else {
                Recorder.proportion = 0;
                Recorder.speechRecognition();
                $('#start_button').trigger('click');
            }
        },
        display_tplSpeak: function () {
            var html = Sand.template.render(
                Sand.get_template('question', 'dictation'),
                Dictation.item_play
            );

            $('#blackboard-content').html(html).show();
            var p_item = Tree.get_node(Dictation.item_play['pid']);
            if (typeof Dictation.item_play['audio']['phonetics'] != 'undefined') {
                $('#phonetics-vocab').html("/ " + Dictation.item_play['audio']['phonetics'] + " /").show();
            } else
                $('#phonetics-vocab').hide();
            $('#sentence-learn').html(p_item['name']);
            $('#play-youtube').hide();
        },
        displayProgressVocab: function (progress) {
            $.each(progress, function (tco_iid, p) {
                var progress = p.p6 > 0 ? p.p6 : 0;
                var $trackItems = $(".tco-tracking[data-tco='" + tco_iid + "']");
                $trackItems.each(function () {
                    var $item = $(this);
                    if (progress == 0) {
                        $item.addClass('m-view');
                    } else if (progress == 100) {
                        $item.addClass('o-view');
                    } else {
                        $item.addClass('h-view');
                    }
                });
            })
        },
        bindAnswerEvents: function () {
            $(document).on('click', '.recoreding-bottom-button', function () {
                if ($('#wrap-xpeak-helper').is(":visible")) {
                    $("#xpeak-helper-button").trigger('click');
                }
                if (!$('#blackboard-content').is(":visible") && !Recorder.blockSpeak) {
                    Dictation.display_tplSpeak();
                    Dictation.start_speak(Recorder.supportSpeak);
                    CourseViewer.display_check_next('next-item');
                }
                else if ($('#blackboard-content').is(":visible")) {
                    Dictation.displayView(Dictation.next_vocab[Dictation.index]);
                }
            });
            $(document).on('click', '#dictation_vocab_nav .timeline-li', function (e) {
                $('#dictation_vocab_nav .timeline-li').removeClass('active');
                $(this).addClass('active');
                var tmp = Dictation.getIndexNext($(this).attr('data-iid'));
                Dictation.play_video(tmp[1]);

            });
            $(document).on('click', '#list_sentence', function (e) {
                if ($('#dictation_vocabset_nav').is(":visible")) {
                    $('#dictation_vocabset_nav').hide();
                } else {
                    $('#dictation_vocabset_nav').show();
                    $('#dictation_vocabset_nav').mouseleave(function () {
                        $(this).hide();
                    });
                }
            });
            $(document).on('click', '#dictation_vocabset_nav li', function () {
                var iid = $(this).data('iid');
                Dictation.display_children_navigation(iid);
                $('#dictation_vocabset_nav').hide();
            });

        },
    };
});