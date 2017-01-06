$(document).ready(function () {

    Sand.callbacks.init_plugin_auto_grow_input = function () {
        $("input.inline_input").autoGrowInput({
            comfortZone: 20,
            minWidth: 100,
            maxWidth: 1000
        });
    };
    /*
     //TODO: where is this coming from? why is it not (document).on ?
     // Select inline multiple choice
     $("select.inline-multiple-choice, select.multiple-choice").on('change', function(e){
     var answer = $(this).val();
     $divWrap = $(this).closest('div.question_wrapper').find('input[name="answer"]').val(answer);
     });
     */

    Test.inline = {
        get_user_answer: function (exid, iid, answer) {
            var ex = Tree.get_node(exid);
            var q = Tree.get_node(iid);
            var $question = Test.$get_wrapper(iid);
            if (Test.is_inline_sortable(q)) {
                $question.find(".sortable-item").each(function (i, e) {
                    answer.push($.trim($(e).attr('data-idx')));
                });
            }
            else {
                $c = $question.find("select.user_answer,input.user_answer");
                $c.each(function (i, e) {
                    //var a = Sand.utils.format_sentence($.trim($(e).val()), q['subject']);
                    var a = Sand.utils.format_sentence($.trim($(e).val()),
                        ex.subject);
                    answer.push(a);
                });
            }
            return answer;
        },
        highlight_one_key: function (iid, i, isCorrect) //i is the index of the i(th) key
        {
            var $question = Test.$get_wrapper(iid);
            var q = Tree.get_node(iid);
            var $question = Test.$get_wrapper(iid);
            if (Test.is_inline_sortable(q)) {
                //highlight those li which are not in order
                var $ul = $question.find('ul.user_answer');
                $ul.find("li.sortable-item").each(function () {
                    if ($ul.find("li.sortable-item").index($(this)) == $(this).attr('data-idx'))
                        $(this).addClass('correct-answer-key').removeClass('wrong-answer-key');
                    else
                        $(this).removeClass('correct-answer-key').addClass('wrong-answer-key');
                });
            }
            else {
                $input = $question.find(".user_answer:eq(" + i + ")");

                if (isCorrect) {
                    $input.addClass('correct-answer-key').removeClass('wrong-answer-key');
                    $input.closest('.input-droppable').addClass('correct-answer-key').removeClass('wrong-answer-key');
                }
                else {
                    //If inline droppable
                    $input.removeClass('correct-answer-key').addClass('wrong-answer-key');
                    $input.closest('.input-droppable').removeClass('correct-answer-key').addClass('wrong-answer-key');
                }
            }
        }

    };

});