$(document).ready(function () {
    //========================multiple choice ===============
    //TODO: performance
    $("#blackboard").on('click', "div.question_wrapper div.answer .mc-question .mc-list-wrap", function (e) {
        $(this).addClass('active').siblings().removeClass('active');
    });


    Test.mc = {
        get_user_answer: function (exid, iid, answer) {
            var $question = Test.$get_wrapper(iid);
            var $ul = $question.find(".mc-question.user_answer");
            $lis = $ul.find(".mc-list-wrap");
            $e = $ul.find(".mc-list-wrap.active");
            idx = $lis.index($e);
            if (idx != -1)
                answer.push(idx);

            return [answer];
        },
        highlight_one_key: function (iid, i, isCorrect) //i is the index of the i(th) key
        {
            var $question = Test.$get_wrapper(iid);
            if (!isCorrect) {
                if ($question.find(".mc-list-wrap.active").length) {
                    $question.find(".mc-list-wrap.active").addClass('wrong-answer-key');
                } else {
                    $question.find(".mc-list-wrap").addClass('wrong-answer-key');
                }
            }
        }
    };
});