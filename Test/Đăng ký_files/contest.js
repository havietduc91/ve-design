$(document).ready(function () {
    Contest =
    {
        user: [],
        opponents: {},
        vocabset: [],
        opponentP: [],
        questions: [],
        myQuestions: {},
        opponentIids: [], //list of opponent Iids
        timeOut: 10,
        timeIn: 10,
        index: 0,
        total: 0, //total number of questions
        answerFinal: [],
        t: 1,
        key: "",
        total_score: 0,
        countRequest: 0,
        timeStart: 6,
        stopContest: true,
        start: function (vocabset) {
            Contest.stopContest = true;
            $('#blackboard-right').show();
            Contest.get_user();
            Contest.vocabset = vocabset;
            Contest.opponents = Contest.opponents || {};
            Sand.get_template('site', 'loading');
            $('#vocabset-practice').html(Sand.get_template('site', 'loading')).show();
            if (Contest.opponents.length) {
                Contest.showOpponentList();
            } else {
                Contest.findOpponents(Contest.vocabset['iid'], function () {
                    Contest.showOpponentList();
                });
            }
        },
        get_user: function () {
            Sand.ajax.ajax_request({
                url: "/user/api/info",
                success: function (json) {
                    Contest.user = json.result;

                },
            });
        },
        findOpponents: function (iid, callback) {
            Sand.ajax.ajax_request({
                url: "/vocabset/api/find-opponent",
                data: {
                    _sand_modal_ajax: 1,
                    vocabsetId: iid,
                },
                success: function (json) {
                    if (json.result) {
                        Contest.opponents = json.result;
                        callback();
                    }
                }
            });
        },
        loadQuestions: function (callback, start) {
            if (start) {
                Contest.questions = Contest.questions || [];
            }
            if (Contest.questions.length > 0) {
                callback();
            } else {
                Sand.ajax.ajax_request({
                    url: '/vocabset/api/load-contest',
                    data: {
                        uiid: Contest.opponentP['iid'],
                        vocabsetId: Contest.vocabset['iid'],
                    },
                    success: function (json) {
                        if (json.success) {
                            Contest.questions = json.result['questions'];
                            Contest.total = Contest.questions.length;
                            callback();
                        }
                    },
                    error: function () {
                        Contest.countRequest += 1;
                        if (!start && Contest.countRequest == 1) {
                            callback();
                        }
                        else if (Contest.countRequest == 2) {
                            Contest.loadQuestions(callback, start);
                        } else if (Contest.countRequest > 2) {
                            Contest.loadData = false;
                            Contest.loadContestFalse();
                        }
                    }
                });
            }
        },
        loadContestFalse: function () {
            Contest.stopContest = true;
            Vocabset.changeMode(Vocabset.mode);
        },
        showOpponentList: function () {
            $('#vocabset-practice').html(Sand.template.render(
                Vocabset.load_template('list_user_contest'),
                {user_contest: Contest.opponents})
            ).show();
            CourseViewer.display_check_next('next-item');
        },
        loadOpponent: function (iid) {
            for (var i in Contest.opponents) {
                if (Contest.opponents[i]['iid'] == iid) {
                    Contest.opponentP = Contest.opponents[i];
                    break;
                }
            }
            ;
            Contest.timeStart = 6;
            Contest.total_score = 0;
            Contest.opponentP['total_score'] = 0;
            Contest.showContestDialog('start');
            CourseViewer.display_check_next('hide_all');
            Contest.timeOutStart();
        },

        timeOutStart: function () {
            Contest.stopContest = false;
            if (Contest.timeStart % 2 == 0) {
                $('#view-start-fighter span.count-down').html(Contest.timeStart / 2);
            }
            if (Contest.timeStart == 0) {
                if (Contest.questions.length > 0) {
                    $('#menu-contest-count-question').html(Vocabset.load_template('contest_menu'));
                    $('#menu-contest-count-question').show();
                    CourseViewer.display_check_next('contest');
                    Contest.index = 0;
                    Contest.answerFinal = [];
                    Contest.total1 = 0;
                    Contest.total2 = 0;
                    Contest.play(Contest.questions[0]);
                } else {
                    Contest.loadContestFalse();
                }
                return;
            }
            Contest.timeStart -= 1;
            if (!Contest.questions.length && Contest.loadData == false)
                Contest.loadQuestions();
            setTimeout('Contest.timeOutStart()', 1000);
        },

        showContestDialog: function (action) {
            var usercontest = {
                'avatar_user': Contest.user['avatar'],
                'name_user': Contest.user['name'],
                'total': Contest.total,
                'total1': Contest.total1,
                'total2': Contest.total2,
                'avatar_opponent': Contest.opponentP['avatar'],
                'name_opponent': Contest.opponentP['name'],
                'question': Contest.answerFinal,
                'topic': Vocabset.vocabset.name,
            };
            $('#vocabset-practice').html(Sand.template.render(
                Vocabset.load_template('user_contest'),
                usercontest)).show();
            if (action == "start")
                $('#view-start-fighter').show();
            else if (action == 'win' || action == "lose") {
                $('#view-result-fighter').addClass(action);
                CourseViewer.display_check_next('next-item');
                Contest.stopContest = true;
                setTimeout(function () {
                    $('#view-result-fighter').hide();
                    $('#view-summary-fighter').show();
                }, 1500);
            }

        },
        play: function (question) {
            Contest.t = "_";
            Contest.key = "_";
            var index = Contest.index + 1;
            var total = Contest.total;
            $('#count-question-line').html(index + '/' + total);
            $('#count-question-line').css({
                'width': 100 * index / total + "%",
            });
            $('#vocabset-practice .answer').css({
                'pointer-events': 'auto',
            });
            Contest.timeIn = Contest.timeOut;
            var vocab = Vocabset.children[question['answer']];
            var vocabs = [];
            for (var i in question.ids) {
                vocabs[i] = Vocabset.children[question.ids[i]];
            }
            Vocabset.renderQuestion(Vocabset.availableQuestionTypes[question['type']], vocab, vocabs);
            Contest.timeOutNextQuestion();
        },
        saveQuestion: function (iid) {
            var question = {};
            Contest.t = parseInt(Contest.timeOut - Contest.timeIn);
            Contest.key = parseInt(iid);
        },
        checkNextQuestion: function () {
            var time = parseInt(Contest.timeOut - Contest.timeIn);
            var question = Contest.questions[Contest.index];

            if (Contest.timeIn > 0) {
                if (time == parseInt(question['t'])) {
                    var id = "#vocabset-practice li.vocab-option[data-iid = '" + question['key'] + "']";
                    $(id).addClass('check-answer');
                }
                if (Contest.t <= time)
                    return true;
            } else {
                return true;
            }
        },
        checkAnswer: function () {
            var anserQus = [];
            var stt = Contest.index;
            var qus1 = Contest.questions[stt];
            if (Contest.key != qus1['answer'] || Contest.key == "_") {
                anserQus['t1'] = Sand.utils.gen_icon('remove');// Tim icon sai 
                $('#vocabset-practice').find('.active').addClass('wrong').removeClass('active');
                $('#vocabset-practice').find(".vocab-option[data-correct=1]").addClass('active correct');
            } else {
                Contest.total_score += 3;
                Contest.total1 += 1;
                anserQus['t1'] = Contest.t + "s";
            }
            if (qus1['key'] != qus1['answer'] || qus1['key'] == "") {
                anserQus['t2'] = Sand.utils.gen_icon('remove');
            } else {
                Contest.total2 += 1;
                Contest.opponentP['total_score'] += 3;
                anserQus['t2'] = qus1['t'] + "s";
            }
            if (Contest.t > qus1['t']) {
                Contest.total_score += 1;
            } else
                Contest.opponentP['total_score'] += 1;
            anserQus['stt'] = stt + 1;
            Contest.answerFinal[stt] = anserQus;
            var myQuetion = {};
            myQuetion['t'] = Contest.t;
            myQuetion['key'] = Contest.key;
            myQuetion['answer'] = qus1['answer'];
            myQuetion['ids'] = qus1['ids'];
            myQuetion['type'] = qus1['type'];

            Contest.myQuestions[stt] = myQuetion;
            Contest.index += 1;
            setTimeout(function () {
                if (Contest.index < Contest.total) {
                    Contest.play(Contest.questions[Contest.index]);
                } else {
                    Contest.finalContest();
                }
            }, 1000);
        },

        finalContest: function () {

            $('#menu-contest-count-question').hide();
            if (Contest.total1 > Contest.total2 ||
                (Contest.total_score >= Contest.opponentP['total_score']
                && Contest.total1 == Contest.total2)) {
                Contest.showContestDialog('win');
            } else
                Contest.showContestDialog('lose');
        },
        timeOutNextQuestion: function () {
            if (Contest.stopContest)
                return;
            $('#display-time-vocab .display-time-vocab').html(Contest.timeIn);
            if (Contest.checkNextQuestion() || Contest.timeIn == 0) {
                Contest.checkAnswer();
            } else {
                Contest.timeIn -= 1;
                setTimeout('Contest.timeOutNextQuestion()', 1000);
            }
        },
        bindAnswerEvents: function () {
            $(document).on('click', '.reval-wrap li.reval-item', function () {
                Contest.loadOpponent($(this).attr('data-iid'));
                Contest.questions = [];
                Contest.myQuestions = [];
                Contest.countRequest = 0;
                Contest.loadData = true;
                Contest.loadQuestions(function () {
                });
            });
        },

    };
    Contest.bindAnswerEvents();
});