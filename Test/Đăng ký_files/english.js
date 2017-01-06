$(document).ready(function () {
    Sand.utils = $.extend(Sand.utils, {
        //if answer is "isn't", then we might mark "is not" as correct as well
        add_abbreviated_form: function (answer, subject) {
            if (subject == 'eng') {
                var dupesArr = [
                    //to be
                    ["is not", "isn't"],
                    ["are not", "aren't"],
                    ["was not", "wasn't"],
                    ["were not", "weren't"],

                    //has
                    ["has not", "hasn't"],
                    ["have not", "haven't"],

                    ["i am", "i'm"],
                    ["he is", "he's"],
                    ["she is", "she's"],
                    ["it is", "it's"],
                    ["they are", "they're"],
                    ["we are", "we're"],
                    ["you are", "you're"],
                    ["that is", "that's"],

                    ["will", "'ll"],
                    ["will not", "won't"],
                    ["I will", "I'll"],
                    ["we will", "we'll"],
                    ["they will", "they'll"],
                    ["he will", "he'll"],
                    ["she will", "she'll"],
                    ["you will", "you'll"],
                    ["it will", "it'll"],
                    ["would not", "wouldn't"],

                    ["can't", "cannot"],
                    ["could not", "couldn't"],


                    ["did not", "didn't"],
                    ["do not", "don't"],
                    ["does not", "doesn't"],

                    ["shall not", "shan't"],
                    ["should not", "shouldn't"],
                    ["might not", "mightn't"],

                    ["'d better", "had better"],
                ];

                var other_answers = [];
                for (j = 0; j < answer.length; j++) {
                    a = answer[j];
                    a = a.toLowerCase();

                    //now add any other form of 'a' to other_answers
                    for (i = 0; i < dupesArr.length; i++) {
                        dupes = dupesArr[i];//["can't", "cannot", "cannot"],
                        for (k = 0; k <= dupes.length - 1; k++) {
                            t = dupes[k];
                            if (a.indexOf(t) != -1) //if something matches, e.g "can't"
                            {
                                //we will replace "can't" with every single element of dupes ["can't", "cannot", "cannot"]
                                for (kk = 0; kk <= dupes.length - 1; kk++) {
                                    other_answers.push(a.replace(t, dupes[kk]));
                                }
                            }
                        }
                    }
                }

                ret = answer.concat(other_answers);
                ret = ret.filter(function (elem, pos) {
                    return ret.indexOf(elem) == pos;
                });
                return ret;
            }

            return answer;
        },
        format_sentence: function (t, subject) {
            if (subject == 'eng') {
                t = Sand.utils.clean_answer(t);
                var punctuators1 = [".", ";", ",", ":", '?', '!', ')']; // No space before, 1 space after
                var punctuators2 = ['(']; // 1 space before. None after
                var punctuators3 = ["-"]; // no spaces around it
                var punctuators4 = ['"'];// for now we should just put both spaces around it
                var puncts = [];
                puncts = puncts.concat(punctuators1).concat(punctuators2).concat(punctuators3).concat(punctuators4);

                //add a space before and after the answer
                for (i = 0; i < puncts.length - 1; i++) {
                    t = t.replaceAll(puncts[i], ' ' + puncts[i] + ' ');
                }

                //now remove the doulbe spaces
                t = t.replace(/\s{2,}/g, ' ');

                for (i = 0; i < punctuators1.length; i++) {
                    t = t.replaceAll(' ' + punctuators1[i] + ' ', punctuators1[i] + ' ');
                }

                for (i = 0; i < punctuators2.length; i++) {
                    t = t.replaceAll(' ' + punctuators2[i] + ' ', ' ' + punctuators2[i]);
                }
                for (i = 0; i < punctuators3.length; i++) {
                    t = t.replaceAll(' ' + punctuators3[i] + ' ', punctuators3[i]);
                }

                //replace the first ' " ' with ' "'
                t = t.replace(' " ', ' "');
                t = t.replace(' " ', '" ');
                t = $.trim(t);

            }
            return t;
        }
    });
});