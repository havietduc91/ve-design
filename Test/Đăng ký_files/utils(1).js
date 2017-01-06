$(document).ready(function () {

    //MOST IMPORTANT function: check $question for correct|wrong, how many times wrong/score/stars...
    Test = $.extend(Test, {
        /********************************Utilities****************************************/
        show_question_wrong_answer_notification: function () {
            Sand.utils.playBackground('wrong');
        },
        show_question_correct_answer_notification: function () {
            Sand.utils.playBackground('correct');
        },
        //Multiple choice question
        // sometimes the height of the choices are not equal
        // because some options are longer (text) than other
        fix_height_answers: function () {
            var $questions = $('.exercise-wrapper .question_wrapper');
            $.each($questions, function (e, i) {
                if ($(this).find('.mc-list-item.answer-avatar').length > 0) {
                    $(this).find('.mc-list-item').css({'height': 'auto', 'max-height' : '200px'});
                } else if($(this).find('.mc-list-item.answer-avatar').length > 0) {
                    var list_mc = $(this).find('.mc-list-item');
                    var max_height = 0;
                    $.each(list_mc, function (e, i) {
                        if ($(this).height() > max_height) {
                            max_height = $(this).height();
                        }
                    });
                    max_height = max_height + 24;
                    $(this).find('.mc-list-item').css({'height': max_height + 'px'});
                }
                if ($(this).find('.wrap-sortable-item').length > 0) {
                    var list_mc = $(this).find('.wrap-sortable-item');
                    var max_height = 0;
                    $.each(list_mc, function (e, i) {
                        if ($(this).height() > max_height) {
                            max_height = $(this).height();
                        }
                    });
                    max_height = max_height + 24;
                    $(this).find('.wrap-sortable-item').css({'height': max_height + 'px'});
                }

            });
        },

        //=====================================User answer=================================
        //==============Can be used in question's answer as well ==========================
        //=================================================================================
        display_score: function (score) {
            var rounded = parseFloat(score).toFixed(2).replace(/0+$/, "");
            ;
            if (parseFloat(rounded) == parseFloat(Math.round(score)))
                return Math.round(score);
            else
                return rounded;

        },
    });
});
