$(document).ready(function () {
    //========================multiple choice ===============
    //TODO: performance
    $("#blackboard").on('click', "div.question_wrapper div.answer ul li", function (e) {
        $(this).addClass('active').siblings().removeClass('active');
    });


    Test.open_ended = {
        get_user_answer: function (exid, iid, answer) {
            if(!answer) {
                answer = [];
            }
            var data = {};
            var $question = $(".question_wrapper[data-iid='" + iid + "']");
            var textAnswer = $question.find(".answer .open-ended-editor").val();
            if (textAnswer) {
                data['text-answer'] = textAnswer;
            }

            var fileURL = $question.find(".answered_file").val();
            if(fileURL) {
                data['file-url'] = fileURL;
            }
            answer.push(data);
            return answer;
        },
        highlight_one_key: function ($question, i, isCorrect) //i is the index of the i(th) key
        {
            //This function is not applicable for open ended questions
        }
    };
    Test.init_open_ended_file_input_control = function () {
            var edx_answered_file_upload_cb = function (data, $input) {//, $obj) {
                if (data.success) {
                    var uploaded = data.result.attachments[0];
                    $input.val(uploaded.link);
                    $input.trigger('change')
                }
                else {
                    Sand.alert.alert_error('Error: ' + data.err);
                }
            };

            $(".answered_file").cl_upload({
                url: '/file/index/upload',
                callback: edx_answered_file_upload_cb,
                params: {
                    access: 'public',
                    type: 'attachment',
                    folder: 'open_ended_answer'
                }
            });


            $("#exercise-wrapper .exercise-wrapper .question_wrapper").on('change', '.answer .open-ended-editor, .answer .answered_file', function () {
                var that = $(this).closest('.question_wrapper');
                var group_id = that.data('group');
                var question_iid = that.data('iid');
                Test.nav_forcus_question_group(question_iid, group_id);
            });
        },
    
    Test.init_open_ended_file_input_control();
});