$(document).ready(function () {

    Test.matching_pairs = {
        get_user_answer: function (exid, iid, answer) {
            // return Test.reorder.get_user_answer(exid,iid, answer);
            var $question = Test.$get_wrapper(iid);
            var answer = [];
            $question.find("div.answer ul.sand-sortable li").each(function (i, e) {
                answer.push($(this).data('id'));
            });
            return answer;
        },

        highlight_one_key: function (iid, i, isCorrect) //i is the index of the i(th) key
        {
            var $question = Test.$get_wrapper(iid);
            var $li = $question.find("ul.sand-sortable li").eq(i);
            if (!isCorrect)
                $li.addClass('wrong-answer-key').removeClass('correct-answer-key');
            else
                $li.removeClass('wrong-answer-key').addClass('correct-answer-key');
        }
    };

});