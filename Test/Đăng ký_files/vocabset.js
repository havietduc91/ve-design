$(document).ready(function () {
    Vocabset = {
        mode: 'learn',
        started_time: 0, //started time for a question
        supportedQuestionTypes: [1, 2, 3, 4, 5, 6, 7, /*8,9,10, */11, 12, 17
            //,13,14,15 //phonetics
        ],
        submitProgress: [],
        availableQuestionTypes: null,
        mcMinimumCount: 3, //3 means at least 4 options are given (including the correc one)
        total: 1,
        completedpractice: 0,
        typeQuestion: "",
        valuesQuestion: "",
        recognizing: false,
        falseConsecutive: 0,
        googleSpeechPercentConsideredAsCorrect: 80,
        isCheck: true,
        summary: {},
        skillConfig: {},
        skillTrackingConfig: {},
        vcs_skills: '',
        modeLearn: {},
        modesLearn: {},
        vcsQuestionType: 17,
        vocabLearn: {},
        isCorrect: true,
        init: function () {
            $('#play-youtube').hide();
            $('#blackboard-content , #wrap-question-list').hide();
            Vocabset.mode = 'learn';
            Vocabset.started_time = 0; //started time for a question
            Vocabset.supportedQuestionTypes = [];
            Vocabset.submitProgress = [];
            Vocabset.availableQuestionTypes = null;
            Vocabset.mcMinimumCount = 3; //3 means at least 4 options are given (including the correc one)
            Vocabset.total = 1;
            Vocabset.completedpractice = 0;
            Vocabset.typeQuestion = "";
            Vocabset.valuesQuestion = "";
            Vocabset.recognizing = false;
            Vocabset.falseConsecutive = 0;
            Vocabset.googleSpeechPercentConsideredAsCorrect = 80;
            Recorder.blockSpeak = false;
            Vocabset.vcsQuestionType = 0;
            Vocabset.isCorrect = true;
        },
        show_summary: function () {
            $("#vocabset-summary").show();
        },
        reset: function () {
            Vocabset.vocabset = {};
            Vocabset.children = {}; //same as vocabset.vocabs, but maintained by vocab iid
            Vocabset.iids = [];
            Vocabset.notyet = Vocabset.struggling = Vocabset.completed = Vocabset.practicing = [];
            Vocabset.recentQuestions = []; //List of all questions taken for this session
            Vocabset.practice_index = 0; //index of the vocab being practiced
            Vocabset.p = 1; //progress
            Vocabset.total = 1;
            Vocabset.completedpractice = 0;
            Vocabset.falseConsecutive = 0;

        },
        reset_progress: function () {
            //Student relearns all the things
            for (var i in Vocabset.iids) {
                var iid = Vocabset.iids[i];
                for (var skill in Vocabset.skillConfig) {
                    Vocabset.children[iid][skill] = 0;
                }
                Vocabset.children[iid]['p'] = 0;
            }
            Vocabset.recentQuestions = [];

            Vocabset.submitProgress.push({
                tco_iid: Vocabset.vocabset.iid,
                p: 0
            });
            Vocabset.saveProgress();
            Vocabset.submitProgress = [];
            /*
             Vocabset.practice_index = 0;
             Vocabset.notyet = Vocabset.struggling = Vocabset.completed = [];
             Vocabset.practicing = Sand.array.shuffle(Sand.array.remove_dupes(Vocabset.struggling.concat(Vocabset.notyet)));
             */
            Vocabset.drawSummary();
            Vocabset.changeMode('learn');
            $('#vocabset-practice-start').trigger('click');
            Sand.ajax.ajax_request({
                url: "/tracker?a=reset_progress",
                data: {
                    _sand_modal_ajax: 1,
                    course: Edx.course_iid,
                    iid: Vocabset.vocabset['iid']
                },
                success: function (json) {
                }
            });
        },
        getVocabsProgress: function (item) {
            Tracker.get_tracking([item.iid], {vocabset: 1, children: 1}, function (json) {
                if (json == false) {
                    item = Vocabset.setVocabsProgress(item);
                } else {
                    var children = json;
                    for (var i = 0; i < item.children.length; i++) {
                        item.children[i] = Vocabset.setPhonetics(item.children[i]);
                        var iid = item.children[i].iid;
                        if (typeof children[iid] != 'undefined') {
                            $.extend(item.children[i], children[iid]);
                        }
                    }
                }
                Vocabset.load_vocabset2(item);
            });

        },
        setVocabsProgress: function (item) {
            $progress = {'p': 0, 'p0': 0, 'p1': 0, 'p2': 0, 'p3': 0, 'p4': 0, 'p5': 0};
            for (var i = 0; i < item.children.length; i++) {
                item.children[i] = Vocabset.setPhonetics(item.children[i]);
                $.extend(item.children[i], $progress);
            }
            return item;
        },
        setPhonetics: function (item) {
            var phonetics = item.audio.phonetics;
            if (!phonetics) {
                if (item.audio['gb'].phonetics)
                    phonetics = item.audio['gb'].phonetics;
                else if (item.audio['us'].phonetics)
                    phonetics = item.audio['us'].phonetics;
            }
            if (phonetics)
                item['phonetics'] = "/ " + phonetics + " /";
            else
                item['phonetics'] = '';
            return item;
        },

        load_template: function (tpl) {
            return Sand.get_template('vocabset', tpl);
        },

        // 'p0' : 'flashcard' : 17
        // 'p1' : 'read' : 1,2
        // 'p2' : 'listen' : 5,6,7
        // 'p3' : 'translate' : 3,4
        // 'p4' : 'spell' : 11,12
        // 'p5' : 'speakgoogle' : 18
        getConfig: function (vcs_skills) {
            var skills = ['basic', 'advanced', 'speak', 'complete'];
            var qs = [];
            for (var i in skills) {
                if (typeof vcs_skills[skills[i]] != 'undefined'
                    && vcs_skills[skills[i]]) {
                    Vocabset.vcs_skills = skills[i];
                    break;
                }
            }
            if (typeof Vocabset.vcs_skills == 'undefined')
                Vocabset.vcs_skills = 'advanced';
            Vocabset.getSkillConfig(skills[i]);
            Vocabset.supportedQuestionTypes = Vocabset.getSupportQuestionTypeConfig(skills[i]);
            return;
        },

        getSkillConfig: function (skill) {
            var skillTrackingConfig = [];
            switch (skill) {
                case 'basic':
                    Vocabset.skillConfig = {
                        'p0': 'flashcard',
                        'p1': 'read',
                        'p2': 'listen',
                        'p3': 'translate',
                    };
                    skillTrackingConfig = [
                        'read', 'listen', 'translate'
                    ];
                    break;
                case 'advanced':
                    Vocabset.skillConfig = {
                        'p0': 'flashcard',
                        'p1': 'read',
                        'p2': 'listen',
                        'p3': 'translate',
                        'p4': 'spell',
                    };
                    skillTrackingConfig = [
                        'read', 'listen', 'translate'
                    ];
                    break;
                case 'speak':
                    Vocabset.skillConfig = {
                        'p0': 'flashcard',
                        'p5': 'speakgoogle',
                    };
                    skillTrackingConfig = [
                        'speakgoogle'
                    ];
                    break;
                case 'complete':
                    Vocabset.skillConfig = {
                        'p0': 'flashcard',
                        'p1': 'read',
                        'p2': 'listen',
                        'p3': 'translate',
                        'p4': 'spell',
                        'p5': 'speakgoogle',
                    };
                    skillTrackingConfig = [
                        'read', 'listen',
                        'translate', 'speakgoogle'
                    ];
                    break;
            }
            var modeSkillTracking = Vocabset.modeLearn['tracking'];
            Vocabset.skillTrackingConfig = [];
            if (typeof modeSkillTracking != 'undefined') {
                for (var i = 0; i < modeSkillTracking.length; i++) {
                    var tmp = Vocabset.skillConfig[modeSkillTracking[i]];
                    if (jQuery.inArray(tmp, skillTrackingConfig) > -1) {
                        Vocabset.skillTrackingConfig.push(tmp);
                    }
                }
                ;
            } else {
                Vocabset.skillTrackingConfig = skillTrackingConfig;
            }

        },

        getSupportQuestionTypeConfig: function (skill) {
            var qs = [];
            var questionTypes = [];
            switch (skill) {
                case 'basic':
                    questionTypes.push(1, 2, 3, 4, 5, 6, 7, 17);
                    break;
                case 'advanced':
                    questionTypes.push(1, 2, 3, 4, 5, 6, 7, 11, 12, 17);
                    break;
                case 'speak':
                    questionTypes.push(17, 18);
                    break;
                case 'complete':
                    questionTypes.push(1, 2, 3, 4, 5, 6, 7, 11, 12, 17, 18);
                    break;
            }
            var modeQuestionType = Vocabset.modeLearn['question_type'] || {};
            if (!modeQuestionType.length) {
                return questionTypes;
            }
            for (var i = 0; i < modeQuestionType.length; i++) {
                if (jQuery.inArray(modeQuestionType[i], questionTypes) > -1) {
                    qs.push(modeQuestionType[i]);
                }
            }
            ;
            return qs;
        },

        /*
         * item : vocabset.
         * reload : load lại toàn bộ logic lúc change_mode.
         */
        load_vocabset: function (item, reload) {
            Vocabset.init();
            if (typeof reload == 'undefined') {
                var t = [
                    'contest_final',
                    'examples',
                    'flashcard',
                    'input',
                    'mc_avatar',
                    'list_user_contest',
                    'mc_text',
                    'contest_menu',
                    'navigation',
                    'summary',
                    'summary_default',
                    'summary_mobile',
                    'tpl0',
                    'tpl1',
                    'tpl2',
                    'tpl3',
                    'tpl4',
                    'user_contest',
                    'wrap',
                ];
                var tplsToLoad = Sand.templates_to_load('vocabset', t);
                Vocabset.getMode(function () {
                    Vocabset.getConfig(item.vcs_skills);
                    Sand.load_templates(tplsToLoad, function () {
                        Vocabset.start_learn(item);

                    });
                });
            } else {
                Vocabset.getConfig(item.vcs_skills);
                Vocabset.start_learn(item);
            }
        },

        start_learn: function (item) {
            Vocabset.displayLayout(item);
            Vocabset.getVocabsProgress(item);
            $('#vocabset-progress').attr('data-tco', item.iid);
            Tracker.get_tracking([item.iid]);
            CourseViewer.display_title(item);
        },

        load_vocabset2: function (vocabset) {
            if (!Vocabset.availableQuestionTypes) {
                Vocabset.mapQuestionTypes();
            }
            Vocabset.reset();
            Vocabset.vocabset = vocabset;
            Vocabset.total = vocabset.children.length;
            for (var i in vocabset.children) {
                var v = vocabset.children[i];
                //populate Vocabset.struggling, completed, good, notyet
                v.p = v.p || 0;
                if (v.p > 3)
                    v.p = 3;

                var levelText = Vocabset.pText(v.p);
                //Sand.utils.log(levelText);
                Vocabset[levelText].push(v.iid);
                //change v.1 to read
                if (v.avatar) {
                    if (v.avatar.indexOf(Sand.configs.STATIC_CDN) == -1)// s.vieted.com
                    {
                        v.avatar = Sand.configs.STATIC_CDN + v.avatar;
                    }
                }

                var tmp = Vocabset.getAllSupportedQuestionSkillsAndTypesForVocab(v);
                v.supportedQuestionTypes = tmp.supportedQuestionTypes;
                v.supportedSkills = tmp.supportedSkills;

                vocabset.children[i] = v;
                Vocabset.children[v.iid] = v;
                Vocabset.iids.push(v.iid);
                // Vocabset.practice();

            }
            Vocabset.logProgress();
            Vocabset.vocabset = vocabset;

            Vocabset.completed = Sand.array.shuffle(Vocabset.completed);

            Vocabset.practicing = Sand.array.shuffle(Sand.array.remove_dupes(Vocabset.struggling.concat(Vocabset.notyet)));

            if (Vocabset.practicing.length == 0)
                Vocabset.practicing = Vocabset.completed;
            Vocabset.drawSummary();
            Vocabset.changeMode('learn', false);
        },
        displayLayout: function (item) {
            $('#sidebar-tip').hide();
            var data = {};
            if (Vocabset.modesLearn.length) {
                data = {modes: Vocabset.modesLearn};
            }
            Sand.set_html('#subnav-bottom', Sand.template.render(Vocabset.load_template('navigation'), data), true);

            var menu = ['learn', 'summary', 'contest'];

            for (var i in menu) {
                if (!item.vcs_menu[menu[i]]) {
                    $('#vocabset-' + menu[i] + '-start').parent().hide();
                }
            }
            ;
            var skillTrackingConfig = [];
            for (var i in Vocabset.skillTrackingConfig) {
                skillTrackingConfig.push({"skill": Vocabset.skillTrackingConfig[i]});
            }
            var tmp = '<div id="vocabset" class="col-md-12 wrapx-vocabset">'
                + Vocabset.load_template('wrap')
                + Sand.template.render(Vocabset.load_template('summary'), {skillTrackingConfig: skillTrackingConfig})
                + '</div>';
            Sand.set_html('#blackboard-content', tmp, true);
        },
        p_percent: function (p) {
            //return p in percent from normal p (0,1,2,3)
            if (p == 0)
                return 0;
            else if (p == 1)
                return 30;
            else if (p == 2)
                return 60;
            else
                return 100;
        },
        updateOverallProgress: function () //P is index of current vocab
        {
            Vocabset.submitProgress = [];//reset
            //number of subskills in whole of vocabset. Number of cells in the
            //summary grid table
            var totalGridPoint = 0;
            var sum = 0;
            var progress = 0;
            var skillsTracking = Vocabset.skillTrackingConfig;
            for (var i in Vocabset.children) {
                var vocab = Vocabset.children[i];
                var totalSupportSkill = skillsTracking.length;
                totalGridPoint = totalGridPoint + totalSupportSkill;
                sum = sum + vocab.p;

                var pText = Vocabset.pText(vocab.p);

                Tracker.change_icon(vocab.iid, pText);
                var tmp = {
                    tco_iid: vocab.iid
                }
                for (var k in skillsTracking) {
                    var sk = Vocabset.skillTrackingMaping[skillsTracking[k]];
                    if (jQuery.inArray(skillsTracking[k], vocab.supportedSkills)) {
                        tmp[sk] = vocab[sk];
                    }
                    else {
                        tmp[sk] = 3; // tmp[sk] = -1;
                    }
                }
                Vocabset.submitProgress.push(tmp);
            }
        },

        skillTrackingMaping: {
            'flashcard': 'p0',
            'read': 'p1',
            'listen': 'p2',
            'translate': 'p3',
            'spell': 'p4',
            'speakgoogle': 'p5',
        },

        saveProgress: function () {
            var iid = Vocabset.vocabset.iid;
            Tracker.save_progress_multi(Vocabset.submitProgress, function (tcos) {
                if (typeof tcos != 'undefined' && typeof tcos[iid] != 'undefined' && tcos[iid]) {
                    Vocabset.completedpractice = tcos[iid]['p'];
                }
            }, Vocabset.vcs_skills);
            Tracker.update_tco_progress(iid, Vocabset.completedpractice);
            if (Vocabset.completedpractice == 100) {
                Vocabset.drawSummary(true);
                $("#vocabset-summary-finished, #vocabset-practice").hide();
                $("#vocabset-summary-finished").show();
                $("#question-check-buttons").hide();
            }
        },
        drawSummary: function (updateHTML) {
            var vocabs = [];
            var skillsTracking = Vocabset.skillTrackingConfig;
            var progress = 0;
            for (var i in Vocabset.iids) {
                var iid = Vocabset.iids[i];
                Sand.utils.log(iid);
                var vocab = Vocabset.children[iid];
                var tpl_skills = [];
                vocab.p = 0; //p is total of all other skills.
                //So if other skills score is 0,2,3,1,3 then
                //p is 0 + 2 + 3 + 1 + 3
                for (var j in skillsTracking) //p1 => "read"
                {
                    var k = Vocabset.skillTrackingMaping[skillsTracking[j]];
                    vocab[k] = vocab[k] || 0;
                    vocab.p = vocab.p + parseInt(vocab[k]);

                    var text;
                    var skillText = skillsTracking[j];
                    if (vocab.supportedSkills.indexOf(skillText) != -1) {
                        var pText = Vocabset.pText(vocab[j]);
                        if (pText == 'completed') {
                            text = '<span class="o-view"><i class="fa fa-star "></i></span>';
                        } else if (pText == 'notyet') {
                            text = '<span class="f-view"><i class="fa fa-star-o"></i></span>';
                        } else {
                            text = '<span class="h-view"><i class="fa fa-star"></i></span>';
                        }
                        vocab['pText-' + skillText] = pText;
                    }
                    else {
                        text = '<span class="o-view"><i class="fa fa-star "></i></span>';
                        // text = '<span class="f-view"><i class="fa fa-star"></i></span>';
                        vocab['pText-' + skillText] = 'notyet';
                    }
                    tpl_skills.push({'skill': text});
                }
                vocab['skills'] = tpl_skills;

                if (vocab.p == 0) {
                    vocab['progress'] = '<span class="f-view"><i class="fa fa-star-o"></i></span>';
                } else if (vocab.p == 3 * (vocab.supportedQuestionTypes.length)) {
                    vocab['progress'] = '<span class="o-view"><i class="fa fa-star "></i></span>';
                } else {
                    vocab['progress'] = '<span class="h-view"><i class="fa fa-star"></i></span>';
                }
                progress = progress + vocab.p * 100 / (3 * skillsTracking.length);

                vocabs.push(vocab);
            }
            Vocabset.completedpractice = Math.ceil(progress / (Vocabset.iids.length));
            if (updateHTML) {
                if (Sand.utils.is_mobile()) {
                    $("#display-summary-mobile").html(Sand.template.render(Vocabset.load_template('summary_mobile'), {vocabs: vocabs}));
                } else {
                    $("#vocabset-list").html(Sand.template.render(Vocabset.load_template('summary_default'), {vocabs: vocabs}));
                }
                Vocabset.show_summary();
            }
            Vocabset.updateOverallProgress();
        },
        changeMode: function (mode, finished) {
            CourseViewer.display_check_next('next-question');
            $('#check-answer, #menu-contest-count-question').hide();
            Vocabset.mode = mode;
            if (!Contest.stopContest) {
                $('.count-question-exit a.text-muted').trigger('click');
                return;
            }
            if (Sand.utils.is_guest() && mode == "contest") {
                if (Sand.utils.is_mobile()) {
                    window.location.replace("/user/login");
                } else {
                    $('#contest_login').trigger('click');
                }
            } else {
                $('#vocabset-practice .answer').css({
                    'pointer-events': 'auto',
                });
                $("#vocabset-practice, #vocabset-summary, #menu-contest, #help_text").hide();
                $('#progress-vocabset').show();
                if (mode == 'summary') {
                    CourseViewer.display_check_next('next-item');
                    Vocabset.drawSummary(true);
                    if (finished) {
                        $("#vocabset-summary-finished").show();
                    } else {
                        $("#vocabset-summary-finished").hide();
                    }
                } else if (mode == 'learn') {
                    $("#vocabset-practice").removeClass('scroll-view');
                    if (Vocabset.completedpractice == 100) {
                        Vocabset.drawSummary(true);
                        $("#vocabset-summary-finished").show();
                    } else {
                        $("#question-check-buttons").show();
                        $("#vocabset-practice").show();
                        CourseViewer.display_check_next('next-question');
                        Vocabset.nextQuestion();
                    }
                } else if (mode == 'contest') {
                    $('#progress-vocabset').hide();
                    CourseViewer.display_check_next('next-item');
                    if ($('#messenger_display').length)
                        $('#messenger_display').hide();
                    $("#vocabset-practice").addClass('scroll-view');
                    Contest.start(Vocabset.vocabset);
                }
            }
        },
        practice: function (t, index) {
            var index = index || Vocabset.practice_index;
            index = Vocabset.practice_index || 0;

            //1. Find which word & question type
            if (Vocabset.isCorrect || typeof Vocabset.vocabLearn == 'undefined') {
                var iid = Vocabset.practicing[index];
                var vocab = Vocabset.children[iid];
                Vocabset.vocabLearn = vocab;
            }
            t = Vocabset.getQuestionTypeToPractice(Vocabset.vocabLearn);
            if (t) {
                //make sure we only find the vocab that has the needed data, like avatar
                Vocabset.renderQuestion(t, Vocabset.vocabLearn, Vocabset.vocabset.children);

                Vocabset.practice_index = Vocabset.practice_index + 1;
                if (Vocabset.practice_index == Vocabset.practicing.length)
                    Vocabset.practice_index = 0;
            }
            else {
                Sand.utils.log("No questionType to practice for " + vocab.name + " with iid = " + vocab.iid);
            }
        },
        mcAlternatives: function (vocab, questionType, vocabs) {
            // get the ids
            var others = [];
            for (var i in vocabs) {
                var v = Vocabset.vocabset.children[i];
                if (v[questionType.answer] && v.iid != vocab.iid)
                    others.push(v);
            }
            return others;
        },
        renderQuestion: function (questionType, vocab, vocabs) {
            $("#messenger_display").hide();
            var type = questionType.type;
            var skill = questionType.skill;
            Vocabset.recentQuestions.unshift({type: type, skill: skill, iid: vocab.iid});
            $("#vocabset-practice").show();
            Vocabset.typeQuestion = questionType.type;
            if (Vocabset.mode == 'learn') {
                $('#help_text').html(questionType.help_text).show();
            }
            if (questionType.type == 'mc') {
                //find other 3 options
                // get the ids
                var others = Vocabset.mcAlternatives(vocab, questionType, vocabs);
                //make sure they have different values here
                var options = [];
                var selected = [];
                for (i = 0; i < others.length; i++) {
                    if (others[i].vname.toLowerCase() != vocab.vname.toLowerCase()) {
                        var v = others[i];
                        if (selected.indexOf(v[questionType.answer]) === -1) {
                            options.push(v);
                            selected.push(v[questionType.answer]);
                        }
                        if (options.length == 3)
                            break;
                    }
                }

                $("#vocabset-practice").html(Vocabset.renderQuestionMc(vocab, options, questionType));
                if (questionType.display == 'player' || questionType.display == 'name') {
                    Vocabset.playAudio();
                }
            }
            else if (questionType.type == 'input') {
                $("#vocabset-practice").html(Vocabset.renderQuestionInput(vocab, questionType));
                if (questionType.display == 'player') {
                    Vocabset.playAudio();
                }
                $("#vocabset-input").focus();
            }
            else if (questionType.type == "flashcard") {
                $('#help_text').hide();
                $("#vocabset-practice").html(Vocabset.renderQuestionFlashcard(vocab, questionType));
                if (typeof vocab['examples'] != undefined && vocab['examples'] != '') {
                    $('#examples-vocab').show();
                } else {
                    $('#examples-vocab').hide();
                }
                Vocabset.activeEventCheck();
                Vocabset.checkQuestion();
            } else if (questionType.type == "speakgoogle") {
                Recorder.init();
                Recorder.vocabsetIid = Vocabset.vocabset['iid']
                Recorder.textDisplay = vocab['name'];
                $("#vocabset-practice").html(Vocabset.renderQuestionSpeakGoogle(vocab, questionType));
                $('#vocabset-practice .answer').css({
                    'pointer-events': 'auto',
                });
                if (Recorder.supportSpeak) {
                    $('#start_button').css({
                        'pointer-events': 'auto',
                    });
                    Recorder.proportion = 0;
                    $('#try-again-question').hide();
                    Recorder.speechRecognition();
                } else {
                    Vocabset.activeEventCheck();
                    Vocabset.checkQuestion();
                    $('#start_button').html('<i class="fa fa-microphone-slash"></i>');
                    $('#start_button').css({
                        'pointer-events': 'none',
                    });

                    $("#messenger_display").show();
                }
            }

            Vocabset.started_time = Date.now(); //milliseconds
        },
        renderQuestionFlashcard: function (vocab, questionType) {
            return Sand.template.render(Vocabset.load_template('flashcard'), vocab);
        },
        renderQuestionSpeakGoogle: function (vocab, questionType) {
            var question = {
                name: vocab['name'],
                player: vocab['player'],
                phonetics: vocab['phonetics'],
            }
            return Sand.template.render(Vocabset.load_template(questionType.tpl), question);
        },
        renderQuestionInput: function (vocab, questionType) {
            var display_content = '';
            var display_audio = '';

            if (questionType.display == 'player') {
                display_audio = vocab[questionType.display];
            } else {
                display_content = vocab[questionType.display];
            }

            var input = Sand.template.render(Vocabset.load_template('input'), {key: vocab[questionType.answer]});
            var question = {
                key: vocab[questionType.answer],
                interact: input,
                display_content: display_content,
                display_audio: display_audio,
            };
            return Sand.template.render(Vocabset.load_template(questionType.tpl), question);

        },
        renderQuestionMc: function (vocab, others, questionType) {
            var answers = [];
            var key, tpl;
            var display_audio = '';
            var display_content = '';

            //Get answer first
            if (questionType.answer == 'avatar') {
                tpl = Vocabset.load_template('mc_avatar');
            }
            else {
                tpl = Vocabset.load_template('mc_text');
            }


            answers = [{answer: vocab[questionType.answer], correct: 1, iid: vocab.iid}];
            for (i in others) {
                var v = others[i];
                answers.push({answer: v[questionType.answer], iid: v.iid});
            }
            answers = Sand.array.shuffle(answers);


            var mc;
            if (questionType.answer == 'avatar') {
                mc = Sand.template.render(tpl, {
                    first2images: answers.slice(0, 2),
                    second2images: answers.slice(2, 4)
                });
            }
            else {
                mc = Sand.template.render(tpl, {answers: answers});
            }

            if (questionType.display == 'player') {
                display_audio = vocab[questionType.display]
            } else {
                display_content = vocab[questionType.display]
            }

            // display_audio = '';
            // display_content = '';
            var question = {
                interact: mc,
                display_content: display_content,
                display_audio: display_audio
            };
            return Sand.template.render(Vocabset.load_template(questionType.tpl), question);
        },
        bindAnswerEvents: function () {
            $(document).on('click', '#vocabset .vocab-option input', function (e) {
                if (Vocabset.valuesQuestion != $(this).parent() && Vocabset.mode == 'learn') {
                    Vocabset.activeEventCheck();
                    Vocabset.valuesQuestion = $(this).parent();
                    $('#blackboard-content').find('.vocab-option').removeClass("active");
                    $(this).parent().addClass('active');
                }
            });
            $(document).on('click', '#vocabset .vocab-option', function (e) {
                if (Vocabset.mode == 'learn') {
                    Vocabset.activeEventCheck();
                } else {
                    Contest.saveQuestion($(this).attr('data-iid'));
                    $('#vocabset-practice .answer').css({
                        'pointer-events': 'none',
                    });
                }
                if (Vocabset.valuesQuestion != $(this)) {
                    Vocabset.valuesQuestion = $(this);
                    $('#blackboard-content').find('.vocab-option').removeClass("active");
                    $(this).addClass('active');
                }
            });
            $(document).on("change keydown paste input", "#blackboard-content", function () {
                if ($('#vocabset-input').val() || $('.inline_input').val() || $(':focus').val()) {
                    Vocabset.activeEventCheck();
                }
            });

            $(document).on('change', "#select-mode", function () {
                var modeLearn = $(this).val();
                Sand.cookie.deleteCookie('mode');
                Sand.cookie.setCookie('mode', modeLearn, 365);
                for (var i = 0; i < Vocabset.modesLearn.length; i++) {
                    delete Vocabset.modesLearn[i]['selected'];
                    if (Vocabset.modesLearn[i]['id'] == modeLearn) {
                        Vocabset.modesLearn[i]['selected'] = true;
                        Vocabset.modeLearn = Vocabset.modesLearn[i];
                    }
                }
                ;
                Vocabset.load_vocabset(Vocabset.vocabset, true);
            });

            $(document).on('click', '#start_button', function (e) {
                Recorder.startButton(e);
            });
            $(document).on('click', '#try-again-question', function (e) {
                Recorder.startButton(e);
            });
        },
        checkQuestion: function () {
            $('#vocabset-practice .answer').css({
                'pointer-events': 'none',
            });
            CourseViewer.display_check_next('next-question');
            Vocabset.checkAnswer();
            EdxPlayer.stop();
        },
        nextQuestion: function () {
            $('#vocabset-practice .answer').css({
                'pointer-events': 'auto',
            });
            CourseViewer.display_check_next('check-answer');
            Vocabset.pointerEventsCheck();
            Vocabset.practice();
        },
        activeEventCheck: function () {
            $('#check-answer').css({
                'pointer-events': 'auto',
            });
            $('#check-answer').removeClass('pointer-vents');
            Vocabset.isCheck = true;
        },
        pointerEventsCheck: function () {
            $('#check-answer').css({
                'pointer-events': 'none',
            });
            $('#check-answer').addClass('pointer-vents');
            Vocabset.isCheck = false;
        },
        checkAnswer: function () {
            var correct = false;
            // var time_out = 200;
            var type = Vocabset.typeQuestion;
            $el = Vocabset.valuesQuestion;
            if (type == 'mc') {
                $('#vocabset').find(".vocab-option[data-correct=1]").addClass('active correct');
                if ($el != "") {
                    correct = $el.data('correct');
                    if (!$el.data('correct')) {
                        // time_out = 3000;
                        $el.removeClass('active');
                        $el.addClass('wrong');
                        Vocabset.falseConsecutive += 1;
                    }
                } else {
                    $('#vocabset').find(".vocab-option").addClass('wrong');
                    Vocabset.falseConsecutive = 0;
                }
            }
            else if (type == 'input') {
                var $input = $("#vocabset-input");
                var re = /[^a-zA-Z0-9]/gi;
                var tmp1 = $.trim($input.val()).toLowerCase().replace(re, '');
                var tmp2 = $input.data('key').toLowerCase().replace(re, '');
                if (tmp1 === tmp2) {
                    correct = true;
                    $input.addClass('correct');
                    Vocabset.falseConsecutive = 0;
                }
                else {
                    // time_out = 3000;
                    $input.addClass('wrong');
                    $("#vocabset-input-key").show();
                    Vocabset.falseConsecutive += 1;
                }
            }
            else if (type == "flashcard") {
                correct = true;
                Vocabset.falseConsecutive = 0;
                // $input.addClass('correct');
            }
            else if (type == "speakgoogle") {
                $('#vocabset-practice .answer').css({
                    'pointer-events': 'auto',
                });
                if (Recorder.supportSpeak) {
                    if (Recorder.recognizing)
                        recognitionGoogle.stop();
                    $('#interim_span').show();
                    if (parseInt(Recorder.proportion) >= Vocabset.googleSpeechPercentConsideredAsCorrect && Recorder.supportSpeak) {
                        correct = true;
                        Vocabset.falseConsecutive = 0;
                    }
                    else {
                        correct = false;
                        Vocabset.falseConsecutive += 1;
                    }
                } else {
                    correct = false;
                }
            }

            if (type == 'flashcard' ||
                (type == 'speakgoogle' && !Recorder.supportSpeak)
            ) {
            }
            else {
                if (correct)
                    Test.show_question_correct_answer_notification();
                else
                    Test.show_question_wrong_answer_notification();
            }
            Vocabset.recentQuestions[0]['correct'] = correct;
            Vocabset.isCorrect = correct;
            Vocabset.recentQuestions[0]['ts'] = Math.ceil(2 * (Date.now() - Vocabset.started_time / 1000)) / 2; //time taken
            var lastQuestion = Vocabset.recentQuestions[0];
            Vocabset.logProgress(lastQuestion.iid);
            Vocabset.updateProgressForVocab(lastQuestion.iid, lastQuestion.skill, correct);
            Vocabset.logProgress(lastQuestion.iid);

            //next question;
            if (type == 'mc' && !correct && $el != "") //reduce from the the chosen one
            {
                //Sand.utils.log("reducing " + $el.data('iid') + " for skill " + lastQuestion.skill );
                Vocabset.logProgress($el.data('iid'));
                if (lastQuestion.skill == 'translate') {
                    Vocabset.updateProgressForVocab($el.data('iid'), 'read', false);
                }
                else if (lastQuestion.skill == 'read') {
                    Vocabset.updateProgressForVocab($el.data('iid'), 'translate', false);
                }
                else //listen
                {
                    Vocabset.updateProgressForVocab($el.data('iid'), lastQuestion.skill, false);
                }
                Vocabset.logProgress($el.data('iid'));
            }
            Vocabset.drawSummary(false);
            Vocabset.saveProgress();
            Vocabset.typeQuestion = "";
        },
        //skill is "read", "read,listen"...
        updateProgressForVocab: function (iid, skill, correct) {
            //the the first skill only. TODO: we can take the other skills later
            var s = Vocabset.getPrimarySkill(skill);
            //Sand.utils.log("updateProgressForVocab", iid, s, correct);
            var skillCode = Vocabset.skillCode(s); //p1,p2...
            var vocab = Vocabset.children[iid];
            if (correct) {
                vocab[skillCode] = 3;//completed. Note that flashcard is always correct.
            }
            else {
                if (vocab[skillCode] == 3)
                    vocab[skillCode] = 2; //forgotten
                else
                    vocab[skillCode] = 1;//struggling
            }
            //var skills = Vocabset.vocabs[iid]['supportedSkills'];

            var skillConfigs = Vocabset.skillConfig;

            var t = 0;
            for (var i in skillConfigs) //p1 => "read"
            {
                if (vocab.supportedSkills.indexOf(skillConfigs[i]) != -1 && vocab[i]) {
                    t = t + parseInt(vocab[i]);
                }
            }
            vocab.p = Math.ceil(t / vocab.supportedSkills.length);
            Vocabset.children[iid] = vocab;
        },
        /********Utilities ****************/
        playAudio: function (practice_type) {
            $elem_recording = $("#vocabset .recording:visible");
            $elem_recording.trigger('click');
        },
        pText: function (i) {

            var levels = ['notyet', 'struggling', 'struggling', 'completed'];
            i = i || 0;
            i = parseInt(i);
            return levels[i];
        },
        skillText: function (i) {
            var levels = Vocabset.skillConfig;
            if (i)
                return levels[i];
            else
                return levels;
        },
        skillCode: function (skill) //skill is text like "read"..., return "p1","p2"...
        {
            var conf = Vocabset.skillConfig;
            for (var i in conf) {
                if (conf[i] == skill)
                    return i;
            }
        },
        getAllSupportedQuestionSkillsAndTypesForVocab: function (v) {
            //TODO: not all questions are applicable. Have to apply this for
            // each vocab when initializing
            // vocab[questionType.display] &&
            var applicableTypes = [];
            var supportedSkills = [];
            for (var i in Vocabset.supportedQuestionTypes /*Vocabset.availableQuestionTypes*/) {
                var questionTypeId = Vocabset.supportedQuestionTypes[i];
                var questionType = Vocabset.availableQuestionTypes[questionTypeId];
                if (questionType.type == "flashcard" || questionType.type == "speakgoogle") {
                    supportedSkills.push(questionType.skill);
                    applicableTypes.push(questionType.id);
                }
                else if (v[questionType.display])  //first the vocab has to have the display field.
                {
                    var skill = Vocabset.getPrimarySkill(questionType.skill);
                    if (supportedSkills.indexOf(skill) == -1) {
                        //Sand.utils.log(skill);
                        supportedSkills.push(skill);
                    }

                    if (questionType.type == 'mc') {
                        var check_support_question = true;
                        if (questionType.id == 2 || questionType.id == 4 || questionType.id == 7) {
                            if (v['avatar'] == "" || v['avatar'] == null)
                                check_support_question = false;
                        }
                        if (Vocabset.mcAlternatives(v, questionType, Vocabset.vocabset.children).length >= Vocabset.mcMinimumCount && check_support_question) {
                            applicableTypes.push(questionType.id);
                        }
                        else {

                            Sand.utils.log(
                                "mcAlternatives not enough: " + Vocabset.mcAlternatives(v, questionType, Vocabset.vocabset.children).length +
                                " " + v.name
                            );
                            Sand.utils.log(questionType);

                        }

                    }
                    else if (questionType.type == 'input') {
                        //Sand.utils.log("Pushing applicableTypes input: " + questionType.id);
                        applicableTypes.push(questionType.id);
                    }
                }
                else {
                    //Sand.utils.log("question type: " + questionType.display + " is not ok for vocab: " + v.name);
                    //Sand.utils.log(v);
                }
            }
            return {
                supportedQuestionTypes: applicableTypes,
                supportedSkills: supportedSkills
            }
        },
        getQuestionTypeToPractice: function (vocab) {
            var applicableTypes = [];
            if (Vocabset.vcsQuestionType == 0) {
                Vocabset.vcsQuestionType = 17;
                return Vocabset.availableQuestionTypes[17];
            } else if (!Vocabset.isCorrect) {
                var idNextQuestion = Vocabset.modeLearn['question_next'];
                var idNextQuestion = [];
                for (var i = 0; i < idNextQuestion.length; i++) {
                    if (jQuery.inArray(idNextQuestion[i], vocab.supportedQuestionTypes) > -1
                        && Vocabset.vcsQuestionType != idNextQuestion[i]) {
                        var questionType = Vocabset.availableQuestionTypes[idNextQuestion[i]];
                        applicableTypes.push(questionType);
                    }
                }
                ;
            } else {
                /*

                 * TODO if the last 3 questions are wrong, give him something he's already
                 * good at. This can be found out from Vocabset.recentQuestions
                 */

                //find out skills to practice first.
                //randomize from list of skills that needs practice
                var skill;
                var skills = vocab.supportedSkills;
                var skillCode;

                var needPracticing = [];
                for (var j in skills) {
                    if (Recorder.blockSpeak && skills[j] == 'speakgoogle') {
                        // break;
                    } else {
                        var skillText = skills[j];
                        skillCode = Vocabset.skillCode(skillText); //p1,p2
                        if (parseInt(vocab[skillCode]) !== 3 && Vocabset.recentQuestions[0] != skills[j]) {
                            needPracticing.push(skillText);
                        }
                    }
                }

                if (needPracticing.length > 0)
                    skill = Sand.array.random_item(needPracticing);
                else
                    skill = Sand.array.random_item(skills);

                //Sand.utils.log("chosen skill" , skill);
                //TODO: not all questions are applicable. Have to apply this for
                // each vocab when initializing
                // vocab[questionType.display] &&
                for (var i in vocab.supportedQuestionTypes) {
                    if (Recorder.blockSpeak && vocab.supportedQuestionTypes[i] == 18) {
                        //break;
                    } else {
                        questionTypeId = vocab.supportedQuestionTypes[i];
                        if (Vocabset.vcsQuestionType != questionTypeId) {
                            var questionType = Vocabset.availableQuestionTypes[questionTypeId];
                            applicableTypes.push(questionType);
                        }
                    }
                }
            }

            //TODO: check this with recentQuestions to find out the next possible types
            if (applicableTypes.length > 0) {
                Vocabset.vcsQuestionType = applicableTypes['id'];
                return Sand.array.random_item(applicableTypes);
            }
            else {
                Vocabset.vcsQuestionType = 17;
                return Vocabset.availableQuestionTypes[17];
            }
        },
        mapQuestionTypes: function () {
            Vocabset.availableQuestionTypes = {};
            for (var i in vocabsetQuestionTypeDefinitions) {
                questionType = vocabsetQuestionTypeDefinitions[i];
                Vocabset.availableQuestionTypes[questionType.id] = questionType;
            }
        },
        getPrimarySkill: function (skill) {
            if (skill.indexOf(',') != -1) {
                skill = skill.split(',');
                skill = skill[0];
            }
            return skill;
        },
        logProgress: function (iid) {
            if (Sand.configs.APPLICATION_ENV.indexOf('development') == -1)
                return;

            for (var i in Vocabset.children) {
                var el = Vocabset.children[i];
                var l = false;
                if (iid) {
                    if (el.iid == iid || el.name == iid)
                        l = true;
                }
                else {
                    l = true;
                }
                if (l) {
                    Sand.utils.log(el.iid, ': ', el.name, "p", el.p, "p0", el.p0, "p1", el.p1, "p2", el.p2, "p3", el.p3, "p4", el.p4, "p5", el.p5);
                }
            }
            ;

            Sand.utils.log("Vocabset: " + Vocabset.vocabset.p);
            return;
        },
        getMode: function (callback) {
            Sand.ajax.ajax_request({
                url: "/vocabset/api/get-mode",
                data: {
                    _sand_modal_ajax: 1,
                },
                success: function (json) {
                    if (json.success) {
                        Vocabset.modesLearn = json.result;
                        var modeLearn = Sand.cookie.getCookie('mode');
                        var isCheck = true;
                        if (modeLearn != 'undefined') {
                            for (var i = 0; i < Vocabset.modesLearn.length; i++) {
                                if (Vocabset.modesLearn[i]['id'] == modeLearn) {
                                    isCheck = false;
                                    Vocabset.modesLearn[i]['selected'] = true;
                                    Vocabset.modeLearn = Vocabset.modesLearn[i];
                                    break;
                                }
                            }
                            ;
                        }
                        if (modeLearn == 'undefined' || isCheck) {
                            Vocabset.modeLearn = Vocabset.modesLearn[0];
                            Vocabset.modesLearn[0]['selected'] = true;
                            modeLearn = Vocabset.modeLearn['id'];
                            Sand.cookie.setCookie('mode', modeLearn);
                        }
                        callback();
                    } else {
                        callback();
                    }
                }
            });
        }
    };
    Vocabset.bindAnswerEvents();
});
