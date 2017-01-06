$(document).ready(function () {
    //MOST IMPORTANT function: check $question for correct|wrong, how many times wrong/score/stars...
    Test = $.extend(Test, {
        //=====================================hints===================================
        show_hints_one_question: function (iid, $hint_click_button) {
            var exid = CourseViewer.current_iid;
            var q = Tree.get_node(iid);
            $divHints = $question.find("div.hints");
            if ($divHints.is(':visible')
                && Sand.page != 'question/index/new'
                && Sand.page != 'question/index/update'
            ) {
                //$divHints.hide();
                //return false;
            } else {
                $divHints.show();
            }

            total = parseInt(q.hints.length);
            var i = parseInt(Take.get(iid, 'hints'));
            if (total > i) {
                $divHints.find("li:eq(" + i + ")").fadeIn(500).show();
                i = i + 1;

                Take.set(iid, 'hints', i);
                if (i == total) {
                    $hint_click_button.addClass('disabled');
                }
            }
        }
    });

    //NOTE: if if we have multiple "show-hints" links, we could use ".show-hints"
    $(document).on('click', "#show-hints", function (e) {
        $hint_click_button = $(this);
        var exid = $(this).closest('#exercise-check').attr('data-exid');
        var $ex = Sand.utils.get_jquery_cache_obj("#exercise-" + exid);
        $ex.find('div.question_wrapper:visible').each(function (i, e) {
            var $question = $(this);
            Test.show_hints_one_question($question.data('iid'), $hint_click_button);
        });

        e.preventDefault();
        return false;
    });


});