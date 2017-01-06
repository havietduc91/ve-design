$(document).ready(function () {
    $(document).on('click', '.start-listen-categorized', function () {
        $categorized_question_closest = $(this).closest('.listen_categorized');
        $categorized_question_closest.find('.text-guide').hide();
        $categorized_question_closest.find('.icon-categorized').hide();
        $(this).hide();
        $categorized_question_closest.find('.listen-cate-answer-wrapper').show();
        $categorized_question_closest.find('.word-sounds').show();

        //play first word
        var $first_word = $categorized_question_closest.find(".sound:eq(0)");
        $first_word.find('.recording').trigger('click');
    });

    $(document).on('click', '.listen_categorized .box-cate', function () {
        var cate = $(this).attr('data-cate');
        $categorized_question_closest = $(this).closest('.listen_categorized');
        //Get current play word
        $current_play_word = $categorized_question_closest.find(".sound:visible[data-current-play='1']");
        if ($current_play_word.length > 0) {
            var answer = $current_play_word.attr('data-answer');
            var answer_cate = $current_play_word.attr('data-cate');
            var data_boolen = 'true';
            if ($.trim(answer_cate) == $.trim(cate)) {
                data_boolen = 'true';
                answer_html = answer + ' ' + Sand.utils.gen_icon('check');
            } else {
                data_boolen = 'false';
                answer_html = answer + ' ' + Sand.utils.gen_icon('remove');
            }
            var word_html = "<span class='listen-cate-word' " + "data-boolen='" + data_boolen + "'" +
                "data-cate='" + answer_cate + "' data-word='" + answer + "'>" + answer_html + "</span>";
            //append word to box
            var cateToLower = $.trim(cate.toLowerCase());
            $categorized_question_closest.find(".listen-cate-answer-wrapper[data-cate='" + cateToLower + "']").append(word_html);

            //stop this audio, disable this audio, play next audio
            $next_word = $current_play_word.next('.sound');
            if ($next_word.length > 0) {
                $next_word.find('.recording').trigger('click');
            }
            //TODO: stop current audio
            $current_play_word.hide();
        }
    });

    $(document).on('click', '.listen_categorized .sound', function () {
        //update current play
        $categorized_question_closest = $(this).closest('.listen_categorized');
        $categorized_question_closest.find('.sound').each(function (e) {
            $(this).attr('data-current-play', 0);
        });

        $(this).attr('data-current-play', 1);
    });

    Test.categorized =
    {

        get_user_answer: function (exid, $question, answer) {

        },
        check_user_answer: function ($question) {
            var nr_inputs = 0;
            var nr_correct = 0;
            var isCorrect;
            var categorized_type = $question.data('categorized-type');
            if (categorized_type == 'listen_choose_box') {
                $cate_word = $question.find(".listen_categorized .listen-cate-word");
                $cate_word.each(function (i, e) {
                    var data_boolen = $(this).attr('data-boolen');
                    if (data_boolen == 'true') {
                        nr_correct++;
                    }
                });
            } else {
                /**
                 * + update nr_correct
                 * + check correct
                 * + active input correct and wrong
                 */
                $c = $question.find(".categorized .cate");
                $c.each(function (k, category) {
                    //var a = Sand.utils.format_sentence($.trim($(e).val()), q['subject']);
                    var $cate = $(this);
                    var cate_name = $cate.data('cate');
                    var str_answers = $cate.data('answers');
                    $input_q = $cate.find('.word-cate');
                    $input_q.each(function (i, e) {
                        nr_inputs++;
                        isCorrect = false;
                        $input = $(this);
                        var cate_of_word = $input.data('cate');
                        if ($.trim(cate_of_word) == $.trim(cate_name) && cate_of_word != '') //answer not case sensitive
                        {
                            isCorrect = true;
                        }

                        if (isCorrect) {
                            nr_correct++;
                            $input.addClass('correct-answer-key').removeClass('wrong-answer-key');
                            $input.closest('.input-droppable').addClass('correct-answer-key').removeClass('wrong-answer-key');
                        }
                        else {
                            //If inline droppable
                            $input.removeClass('correct-answer-key').addClass('wrong-answer-key');
                            $input.closest('.input-droppable').removeClass('correct-answer-key').addClass('wrong-answer-key');
                        }
                    });
                });
            }
            return {nr_correct: nr_correct, isCorrect: isCorrect, nr_inputs: nr_inputs};
        }
    };
});
