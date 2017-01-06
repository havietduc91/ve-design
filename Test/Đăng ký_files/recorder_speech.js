var recognitionGoogle;
var diffMatchPatch;

$(document).ready(function () {
    RecorderSpeech = {
        final_transcript: '',
        recognizing: false,
        start_timestamp: 0,
        ignore_onend: false,
        onStopSpeech: false,
        supportSpeak: false,
        message: '',
        error: false,
        init: function () {
            if ('webkitSpeechRecognition' in window) {
                RecorderSpeech.supportSpeak = true;
                RecorderSpeech.timeStopSpeech = 5,
                    RecorderSpeech.recognizing = false;
                RecorderSpeech.start_timestamp = 0;
                RecorderSpeech.ignore_onend = false;
                RecorderSpeech.onStopSpeech = false;
                RecorderSpeech.vocabsetIid = 0;
                RecorderSpeech.message = '';
            } else {
                RecorderSpeech.supportSpeak = false;
            }
            return RecorderSpeech.supportSpeak;
        },
        onStart: function (callback) {
            if (!RecorderSpeech.supportSpeak) {
                callback({success: false, message: 'Browser does not support'});
            }
            RecorderSpeech.callback = callback;
            if (RecorderSpeech.recognizing) {
                recognitionGoogle.stop();
            } else if (!RecorderSpeech.speechRecognition()) {
                RecorderSpeech.speechRecognition();
            }
            RecorderSpeech.final_transcript = '';
            recognitionGoogle.lang = 'en-US';
            recognitionGoogle.start();
        },

        speechRecognition: function () {
            recognitionGoogle = new webkitSpeechRecognition();
            recognitionGoogle.continuous = true;
            recognitionGoogle.interimResults = true;

            recognitionGoogle.onstart = function () {
                RecorderSpeech.error = false;
                RecorderSpeech.ignore_onend = false;
                RecorderSpeech.onStopSpeech = true;
                RecorderSpeech.recognizing = true;
            };

            recognitionGoogle.onerror = function (event) {
                RecorderSpeech.error = true;
                RecorderSpeech.ignore_onend = true;
                var message = "Error : "
                if (event.error == 'no-speech') {
                    message = message + 'no-speech';
                }
                if (event.error == 'audio-capture') {
                    message = message + 'audio-capture';
                }
                if (event.error == 'not-allowed') {
                    message = message + 'not-allowed';
                }
                RecorderSpeech.message = message;
            };

            recognitionGoogle.onend = function () {
                RecorderSpeech.recognizing = false;
                RecorderSpeech.onStopSpeech = false;
                if (RecorderSpeech.ignore_onend) {
                    RecorderSpeech.callback({success: false, message: RecorderSpeech.message});
                    return;
                }
                if (RecorderSpeech.timeStopSpeech == 0 && !RecorderSpeech.final_transcript) {
                    RecorderSpeech.callback({success: false, message: 'service unresponsive'});
                    return;
                }
                RecorderSpeech.callback({success: true, result: RecorderSpeech.final_transcript});
                return;
            };

            recognitionGoogle.onresult = function (event) {
                RecorderSpeech.timeStopSpeech = 5;
                var interim_transcript = '';
                for (var i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        RecorderSpeech.final_transcript += event.results[i][0].transcript;
                    } else {
                        RecorderSpeech.interim_transcript += event.results[i][0].transcript;
                    }
                }

                RecorderSpeech.timeOutStopSpeech();
            };

        },
        timeOutStopSpeech: function () {
            if (!RecorderSpeech.onStopSpeech) {
                return;
            }
            clearTimeout(RecorderSpeech.t);
            if (RecorderSpeech.timeStopSpeech == 0 && RecorderSpeech.onStopSpeech) {
                recognitionGoogle.stop();
                return;
            } else if (RecorderSpeech.onStopSpeech) {
                RecorderSpeech.timeStopSpeech -= 1;
                RecorderSpeech.t = setTimeout("RecorderSpeech.timeOutStopSpeech()", 300);
            }
        },

        onEnd: function () {
            if (RecorderSpeech.recognizing) {
                recognitionGoogle.stop();
            }
        },

        compareResult: function (text_1, text_2) {
            text1 = RecorderSpeech.textHandling(text_1, 1);
            text2 = RecorderSpeech.textHandling(text_2, 1);
            var arr_text1 = text1.split(' ');
            if (text1 == text2) {
                return {proportion: 100, wrong: [], correct: arr_text1};
            }
            var d = RecorderSpeech.diffMain(text1, text2);
            if (arr_text1.length == 1) {
                return {proportion: 0, wrong: arr_text1, correct: []};
            }
            var arr_d = [];
            for (var i = 0; i < d.length; i++) {
                var arr_tmp = d[i][1].split(' ');
                for (var ii = 0; ii < arr_tmp.length; ii++) {
                    var tmp = [d[i][0], arr_tmp[ii]];
                    if (arr_tmp[ii] != "") {
                        arr_d.push(tmp);
                    }
                }
            }
            var surplus = 0;
            var deficit = 0;
            var ttrue = 0;
            var correct = [];
            var map = [];
            for (var i = 0; i < arr_d.length - 1; i++) {
                var check = false;
                if (arr_d[i][0] == 0 && (arr_d[i + 1][0] == 0 || arr_d[i + 1][0] == 1)) {
                    correct.push(arr_text1[0]);
                    map.push(0);
                    arr_text1.splice(0, 1);
                    ttrue++;
                    check = true;
                }
                if (arr_d[i][0] == 1) {
                    surplus++;
                }
                if (arr_d[i][0] == -1 && (arr_d[i + 1][0] == 0 || arr_d[i + 1][0] == 1)) {
                    map.push(1);
                    arr_text1.splice(0, 1);
                    deficit++;
                    check = true;
                }
                if (arr_d[i][0] == 0 && arr_d[i][1] == arr_text1[0] && !check) {
                    correct.push(arr_text1[0]);
                    map.push(0);
                    arr_text1.splice(0, 1);
                    ttrue++;
                    check = true;
                }
                if (!check && arr_text1.lenth) {
                    var j = 0;
                    var tx = arr_d[i][1];
                    while (++j) {
                        if (arr_d[i + j][0] == -1) {
                            deficit++;
                        }
                        if (arr_d[i + j][0] == 1) {
                            surplus++;
                        } else {
                            tx = tx + arr_d[i + j][1];
                        }
                        if (tx == arr_text1[0]) {
                            map.push(1);
                            arr_text1.splice(0, 1);
                            i += j;
                            break;
                        }
                    }
                    if (i == arr_d.length - 1) {
                        if (arr_d[i][0] == 0 && (arr_d[i - 1][0] == 0 || arr_d[i - 1][0] == -1)) {
                            correct.push(arr_text1[0]);
                            map.push(0);
                            ttrue++;
                        } else if (arr_d[i][0] == 1) {
                            map.push(1);
                            surplus++;
                        } else {
                            map.push(1);
                            deficit++;
                        }

                    }
                }
            }
            arr_text1 = text1.split(' ');
            var wrong = [];
            jQuery.grep(arr_text1, function (el) {
                if (jQuery.inArray(el, correct) == -1) {
                    wrong.push(el);
                }
            });
            var text = RecorderSpeech.textHandling(text_1, 3);
            arr_text = text.split(' ');
            d = [];
            for (var i = 0; i < arr_text.length; i++) {
                if (typeof map[i] == 'undefined') {
                    map[i] = 1;
                }
                if (arr_text[i] != '') {
                    var dd = [];
                    dd.push(map[i]);
                    dd.push(arr_text[i] + " ");
                    d.push(dd);
                }
            }
            var textPretty = diffMatchPatch.diff_prettyHtml(d);
            var proportion = Math.ceil(ttrue * 100 / (arr_text1.length + Math.abs(surplus - deficit)));
            return {proportion: proportion, wrong: wrong, correct: correct, textPretty: textPretty};

        },

        diffMain: function (text1, text2) {
            if (!diffMatchPatch) {
                diffMatchPatch = new diff_match_patch();
            }
            var d = diffMatchPatch.diff_main(text1, text2);
            diffMatchPatch.diff_cleanupSemantic(d);
            return d;
        },
        /*
         *	type = 0 : tat ca chu thuong
         *	type = 1 : bo ky tu dac biet => chuyen ve chu thuong
         *	type = 2 : chuyen chu cai dau thanh viet hoa
         *   type = 3 : bo cac ky ty dac biet.
         */
        textHandling: function (text, type) {
            if (typeof type == 'undefined' || type == 0) {
                return text.toLowerCase();
            }

            if (type == 1) {
                var re = /[^a-zA-Z0-9']/gi;
                text = text.replace(re, " ").toLowerCase();
                return text.replace("  ", " ");
            }

            if (type == 2) {
                return text.replace(/\w\S*/g, function (txt) {
                    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                });
            }

            if (type == 3) {
                var re = /[^a-zA-Z0-9']/gi;
                text = text.replace(re, " ");
                return text.replace("  ", " ");
            }
        }
    };
});