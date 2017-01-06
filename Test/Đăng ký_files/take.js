/**
 * Information about a take
 */
var Take = {
    saveResultKey : 'exam_result', //localstorage key to save a take's answers
    finished: false,
    started_time: 0,
    score: 0,
    total_nr_correct: 0, //total number of correct keys
    attempts: {},
    answer : {},
    total_wrong: 0,
    set: function (iid, attr, val) {
        if (typeof Take.attempts[iid] == 'undefined')
            Take.attempts[iid] = {};

        Take.attempts[iid][attr] = val;
    },
    get: function (iid, attr) {
        if (typeof Take.attempts[iid] == 'undefined')
            return;

        return Take.attempts[iid][attr];
    },
    get_attempt: function (iid) {
        return Take.attempts[iid];
    },
    reset: function (iid) /* exercise iid */ {
        Take = $.extend(Take, {
            finished: false,
            started_time: Math.round((new Date()).getTime() / 1000),
            total_nr_correct: 0,
            score: 0,
            attempts: {},
            total_wrong: 0,
        });

        var node = Tree.get_node(iid, true);
        if (typeof node != 'undefined' && node.childrenIids != 'undefined'
            && node.childrenIids.length > 0) {
            for (var i in node.childrenIids) {
                var childIid = node.childrenIids[i];
                Take.attempts[childIid] = {
                    wrongs: 0,
                    hints: 0, //number of hints used
                    score: 0, //score in percent = nr_correct / nr_keys %
                    nr_correct: 0, //maximum = question.nr_keys
                    prev: false /* prev answer */
                };
            }
        }
    },
    increase_total_nr_correct: function (nr_correct) {
        Take.total_nr_correct = Take.total_nr_correct + nr_correct;
        $('#ex-user-nr-key').html(Take.total_nr_correct);
    },
};
