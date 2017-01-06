var recognitionGoogle;
var diffMatchPatch;

$(document).ready(function () {
    Recorder = {
        final_transcript: '',
        recognizing: false,
        start_timestamp: 0,
        ignore_onend: false,
        two_line: /\n\n/g,
        one_line: /\n/g,
        first_char: /\S/,
        textSpeak: "",
        arr_text: [],
        proportion: 0,
        onStopSpeech: false,
        supportSpeak: false,
        blockSpeak: false,
        error: false,
        t: 0,
        arrPhoneticWrong: {},
        phonetics: '',
        phoneticsWrong: '',
        vocabsetIid: '',
        xpeak_fluency: 100,
        indexHistory: -1,
        historySpeak: [],
        init: function () {
            Sand.load_templates(['vocabset__phonic_wrong'], function () {
            });
            blockSpeak = false;
            xpeak_fluency = 100;
            historySpeak = [];
            timeStopSpeech : 5,
                Recorder.final_transcript = '';
            Recorder.recognizing = false;
            Recorder.start_timestamp = 0;
            Recorder.ignore_onend = false;
            Recorder.two_line = /\n\n/g;
            Recorder.one_line = /\n/g;
            Recorder.first_char = /\S/;
            Recorder.onStopSpeech = false;
            Recorder.vocabsetIid = 0;
            diffMatchPatch = new diff_match_patch();
        },
        startButton: function (event) {
            $('#try-again-question').hide();
            $('#interim_span').hide();
            if (Recorder.recognizing) {
                recognitionGoogle.stop();
                return;
            }
            Recorder.error = false;
            Recorder.timeStopSpeech = 5;
            Recorder.final_transcript = '';
            recognitionGoogle.lang = 'en-US';
            recognitionGoogle.start();
            Recorder.textSpeak = Recorder.toTitleCaseText(Recorder.textDisplay, 1);
            Recorder.textSpeak = Recorder.toTitleCaseText(Recorder.textDisplay, 3);
            Recorder.arr_text = Recorder.toTitleCaseText(Recorder.textSpeak, 2);
            for (var i = 0; i < Recorder.arr_text.length; i++) {
                if (Recorder.arr_text[i] == "" || Recorder.arr_text[i] == " ")
                    Recorder.arr_text.splice(i, 1);
            }
            Recorder.ignore_onend = false;
            Recorder.setIconView('mic-slash');
            Recorder.start_timestamp = event.timeStamp;
        },
        showFinalTranscrip: function () {
            $('#try-again-question').hide();
            $('#final_span').show();
            Recorder.proportion = 0;
            Recorder.final_transcript = Recorder.capitalize(Recorder.final_transcript);
            var text_r = Recorder.linebreak(Recorder.final_transcript);
            text_r = Recorder.toTitleCaseText(text_r, 1);
            text_r = Recorder.toTitleCaseText(text_r, 3);
            var arr_result = Recorder.launchText(text_r, Recorder.textSpeak);
            $('#final_span').html(arr_result).show();
            if (arr_result) {
                Recorder.toProportion(arr_result);
            }
            if (Recorder.error) {
                Recorder.setIconView('mic-slash');
            }
            if (CourseViewer.ntype == 'dictation') {
                Tracker.save_progress_multi([{
                    tco_iid: Dictation.item_play['iid'],
                    p6: Recorder.proportion,
                }], null, 'speak_dictation');
            }


        },
        linebreak: function (s) {
            return s.replace(Recorder.two_line, '<p></p>').replace(Recorder.one_line, '<br>');
        },
        capitalize: function (s) {
            return s.replace(Recorder.first_char, function (m) {
                return m.toUpperCase();
            });
        },
        setIconView: function (icon) {
            $('#start_button').removeClass('recording-now');
            var html_icon;
            if (icon == 'mic-slash') {
                // html_icon = Sand.utils.gen_icon('fa-microphone-slash');
                html_icon = '<i class="fa fa-microphone-slash"></i>';
            } else {
                // html_icon = Sand.utils.gen_icon('fa-microphone');
                html_icon = '<i class="fa fa-microphone"></i>';
                if (icon == 'mic-animate') {
                    $('#start_button').addClass('recording-now');
                }
            }
            $('#start_img').html(html_icon);

        },
        toTitleCaseText: function (str, type) {
            if (type == 1) {//loai bo tat ca ky ty dac biet tra ve mang cac tu
                var re = /[^a-zA-Z0-9]/gi;
                return $.trim(str.replace(re, " "));
            } else if (type == 2) {// cat thanh mang cac tu
                return str.split(" ");
            }
            else if (type == 3) { // chuyển thành chữ cái đầu dòng viết hoa.
                return str.toLowerCase();
            }
            // chuyen chu cai dau thanh viet hoa
            return str.replace(/\w\S*/g, function (txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            });
        },
        splitText: function (text) {
            var tmp = $.trim(text).replace('-', " ").toLowerCase();
            return tmp.split(" ");
        },
        toProportion: function (arr_result, update) {
            var total = Recorder.arr_text.length;
            var sum = 0;
            for (var i = 0; i < arr_result.length; i++) {
                if (arr_result[i][0] == 0) {
                    sum += Recorder.spliceresult(arr_result[i][1]);
                }
                else if (arr_result[i][0] == -1) {
                    arr_result.splice(i, 1);
                }
            }
            if (typeof update !== 'undefined') {
                var wordWrong = $('#final_span').html();
                var phoneticsWrong = diffMatchPatch.diff_prettyHtml(arr_result);
                $('#final_span').html(wordWrong + '   /' + phoneticsWrong + '/');
            } else {
                Recorder.proportion = Math.floor(100 * sum / total);
                if (Recorder.indexHistory == 0) {
                    Recorder.historySpeak = [];
                }
                Recorder.historySpeak[Recorder.indexHistory] = Recorder.proportion;
                $('#final_span').html(diffMatchPatch.diff_prettyHtml(arr_result));
                $('#interim_span').html("Bạn đúng: <a>" + Recorder.proportion + "</a> %").show();
                if (Edx.learning_type != 'koncept' && Recorder.proportion !== 100) {
                    Recorder.getDiffMatchPhonetics(function (data) {
                        Recorder.displayLessonPhonic(data);
                    });
                }
            }
        },

        getXpeakEncouragementText: function () {
            if (Recorder.proportion == 100) {
                return "Chúc mừng bạn";
            } else if (Recorder.proportion < Recorder.historySpeak[Recorder.indexHistory - 1]) {
                return "Thử lại đi em, kết quả còn tệ hại hơn trước";
            } else {
                return "Có tiếng bộ, tốt hơn trước 1 chút";
            }

        },

        spliceresult: function (text) {
            text = Recorder.toTitleCaseText(text, 1);
            var tmp = Recorder.toTitleCaseText(text, 2);
            var total = tmp.length;
            var sum = 0;
            if (total == 1) {
                for (var i in Recorder.arr_text) {
                    if (tmp[0] == Recorder.arr_text[i]) {
                        Recorder.arr_text.splice(i, 1);
                        return 1;
                    }
                }
                return sum;
            }
            for (var i = 0; i <= (Recorder.arr_text.length - total); i++) {
                sum = 0;
                if (tmp[0] == Recorder.arr_text[i]) {
                    for (var ii = 0; ii < total; ii++) {
                        if (tmp[ii] != Recorder.arr_text[i + ii])
                            break;
                        else {
                            sum += 1;
                        }
                    }
                    if (sum == total) {
                        for (var iii in tmp) {
                            Recorder.arr_text.splice(i + iii, 1);
                        }
                        return sum;
                    }
                }
            }
            return total;
        },
        launchText: function (text1, text2) {
            // diffMatchPatch.Diff_Timeout = parseFloat(document.getElementById('timeout').value);
            // diffMatchPatch.Diff_EditCost = parseFloat(document.getElementById('editcost').value);
            diffMatchPatch.Diff_Timeout = 1;
            // diffMatchPatch.Diff_EditCost = 4;
            var d = diffMatchPatch.diff_main(text1, text2);
            diffMatchPatch.diff_cleanupSemantic(d); // config Semantic Cleanup
            diffMatchPatch.diff_cleanupEfficiency(d); // config Efficiency Cleanup
            // return diffMatchPatch.diff_prettyHtml(d);
            return d;
        },
        speechRecognition: function () {
            recognitionGoogle = new webkitSpeechRecognition();
            recognitionGoogle.continuous = true;
            recognitionGoogle.interimResults = true;
            recognitionGoogle.onstart = function () {
                Recorder.onStopSpeech = true;
                Recorder.indexHistory++;
                Recorder.recognizing = true;
                Recorder.setIconView('mic-animate');
            };

            recognitionGoogle.onerror = function (event) {
                Recorder.error = true;
                if (event.error == 'no-speech') {
                    Recorder.setIconView('mic');
                    Recorder.ignore_onend = true;
                }
                if (event.error == 'audio-capture') {
                    Recorder.setIconView('mic');
                    Recorder.ignore_onend = true;
                }
                if (event.error == 'not-allowed') {
                    Recorder.ignore_onend = true;
                }
            };

            recognitionGoogle.onend = function () {
                Recorder.onStopSpeech = false;
                Recorder.recognizing = false;
                Recorder.setIconView('mic');
                Recorder.showFinalTranscrip();
                if (CourseViewer.ntype == 'dictation') {

                } else {
                    Vocabset.activeEventCheck();
                    Vocabset.checkQuestion();
                    $('#vocabset-practice .answer').css({
                        'pointer-events': 'auto',
                    });
                }
                if (Recorder.proportion != 100) {
                    $('#try-again-question').show();
                }
                $('#interim_span').show()
                if (Recorder.ignore_onend) {
                    return;
                }
                if (!Recorder.final_transcript) {
                    //Recorder.showInfo('info_start');
                    return;
                }
                //Recorder.showInfo('');
                // if (window.getSelection) {
                //   window.getSelection().removeAllRanges();
                //   var range = document.createRange();
                //   range.selectNode(document.getElementById('final_span'));
                //   window.getSelection().addRange(range);
                // }
            };

            recognitionGoogle.onresult = function (event) {
                var interim_transcript = '';
                for (var i = event.resultIndex; i < event.results.length; ++i) {

                    if (event.results[i].isFinal) {
                        Recorder.final_transcript += event.results[i][0].transcript;
                    } else {
                        Recorder.interim_transcript += event.results[i][0].transcript;
                    }
                }

                Recorder.timeStopSpeech = 5;
                Recorder.timeOutStopSpeech();
            };

        },
        timeOutStopSpeech: function () {
            if (!Recorder.onStopSpeech) {
                return;
            }
            clearTimeout(Recorder.t);
            if (Recorder.timeStopSpeech == 0 && Recorder.onStopSpeech) {
                Recorder.startButton();
                return;
            } else if (Recorder.onStopSpeech) {
                Recorder.timeStopSpeech -= 1;
                Recorder.t = setTimeout("Recorder.timeOutStopSpeech()", 300);
            }
        },
        bindAnswerEvents: function () {
            $(document).on('click', '#block-question-speak', function () {
                Recorder.blockSpeak = true;
                $('#messenger_display a.close')[0].click();
                $('#next-question')[0].click();
            })
        },
        getDiffMatchPhonetics: function (callback) {
            Sand.ajax.ajax_request({
                url: "/vocabset/api/diff-match-phonetic",
                data: {
                    word: Recorder.textSpeak,
                    wordWrong: Recorder.final_transcript,
                    vocabsetIid: Recorder.vocabsetIid
                },
                success: function (json) {
                    if (json.success) {
                        callback(json.result);
                    }
                }
            });
        },
        displayLessonPhonic: function (data) {
            var phonetic = data.phonetics['word'];
            var phoneticWrong = data.phonetics['wordWrong'];
            if (phonetic !== phoneticWrong) {
                var arr_result = Recorder.launchText(phoneticWrong, phonetic);
                if (arr_result) {
                    Recorder.toProportion(arr_result, true);
                }
            }
            if (data.importantWrongPhonics.length) {
                data['isImportantPhonics'] = 1;
            }
            if (data.wrongPhonics.length) {
                data['isPhonics'] = 1;
            }
            data.xpeak_fluency = Recorder.getXpeakEncouragementText();
            var tmp = Sand.template.render(Sand.get_template('vocabset', 'phonic_wrong'), data);
            $("#phonic-display").html(tmp);

        },
    };
    Recorder.bindAnswerEvents();
});