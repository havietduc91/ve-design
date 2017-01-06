/**
 * Contains callbacks for form.cl_ajax callbacks
 */

$(document).ready(function () {

    Sand['callbacks'] = $.extend(
        Sand['callbacks'],
        {
            refresh_current_element_list: function ($form, json, params) {
                //$("#vocabset-area").removeClass('vocabset-bg');
                if (json.success) {
                    //refresh lesson's vocab list
                    Sand.ajax.handle_request($("#current-elements"));
                }
            },
            update_iid_success: function ($a, json, params) {
                $a.html(json.result.iid).attr('href', 'javascript:void(0);');
            },
            writing_submitted: function ($form, json, params) {

                //Lesson.populate_navigate_away_confirm(false);
                if (json.success) {
                    window.location.href = Sand.utils.take_link(Sand.course.iid, Sand.lesson.iid, Sand.lesson.slug, json.take.id);
                }
            },
            upload_recording_success: function ($form, json, params) {
                result = json.result;
                role = $form.find('input[name="role"]').val();
                if (role == 'teacher') {
                    //add this new file to ul
                    $form.closest('td').find('ul.recording_list').append(result.html);
                }
                else {
                    $form.closest('td').find("span.audio_player").html(result.html).css('background-color', '#eeeeee');
                }
            },
            add_feedback_success: function ($form, json, params) {
                Sand.alert.alert_success('Successfully');
                $form.get(0).reset();
            },
            add_student_success: function ($form, data) {
                $form.find("#emails").val('');
                //if (! _.isUndefined(data.success_emails))
                if (typeof data.success_emails !== 'undefined') {
                    //.insertBefore(data.successMsg);
                    //var emailList = data.result.valid_emails.join(',');
                    Sand.alert.alert_success(data.success_emails, 5000);
                    //$(".search_form #submit").trigger('click');
                }
                //if (! _.isUndefined(data.error_emails))
                if (typeof data.error_emails !== 'undefined') {
                    Sand.alert.alert_error(data.error_emails, 5000);
                }
            },
            start_bounty_success: function ($form, data, params) {
                //$form.prev('a.start_bounty').remove();
                if ($("span.bounty-text").length > 0) {
                    $("span.bounty-text").text('+' + data.result.bounty);
                }
                else {
                    var str = '<div class="well"><h3>\
                        This question had a bounty worth \
                        <span class="badge badge-success bounty-text">+' + data.result.bounty + '</span>reputation from ' + data.result.u.name;
                    str += '</h3></div>';
                    $(".quora_bounty_money_alert").html(str);
                }
                $form.hide();
                $form.closest('div.modal').modal('hide'); //also hide the modal
                User.change_token_balance(-(data.result.mbounty), 0);
            },

            hide_comment_box: function ($form, json, params) {
                $("#new_comment").hide();
            },
            //used in exercise/update?step=questions_order
            add_concept_to_checkbox: function ($el, item, params) {
                html = "<span><input type='checkbox' name='concepts__id[]' value='" + item.id + "' checked=checked />" +
                    item.name + "</span>";
                $el.closest('form').find('.concepts').append(html);
            },

            remove_concept_to_checkbox: function ($el, item, params) {
                $input = $el.closest('form').find('.concepts').find('input');
                $.each($input, function (i, e) {
                    if ($(e).val() == item.id) {
                        $(e).parent().remove();
                    }
                });
            },
            //order concepts in a goal
            add_concept_to_order_list: function ($el, item, params) {
                item.url = Sand.utils.node_link('concept', item);
                item.order = $(".sand-sortable .concept-row").size() + 1;
                var template = $("#mustache-concept-row").text();
                var html = Sand.template.render(template, item);
                $(".sand-sortable").append(html);
                $el.closest('form').find("[type='submit']").trigger('click');
            },

            remove_answer_to_question: function ($a, data, params) {
                var answerId = $a.attr('data-id');
                var $comment = $("#" + answerId).find('.comment');
                $comment.find('.reply-comment').html('');
                var content = $comment.html();

                $('.answers').show();
                $('.hide_is_answer').each(function (e, l) {
                    $(this).hide();
                });
                $('#insert-is-answer').html(content);
                $("#" + answerId).hide();
            },
            //TODO: deprecated??
            approve_recording: function ($a, data, params) {
                if (data.success) {
                    if ($a.hasClass('approved')) {
                        $li = $a.parents('li');
                        $li.siblings().removeClass('approved_recording');
                        $li.addClass('approved_recording');
                    }
                }
                else {
                    $a.removeClass('active');
                }
            },
            //unlock a lesson . /user/relate?object=lesson...
            unlock_lesson: function ($a, data, params) {
                if (data.success) {
                    Sand.alert.alert_success('You have successfully unlocked the lesson');
                }
                else {
                    //TODO: You need x tokens to unlock the lesson
                    //$('#myModal').modal();
                }
            },


            //When we request marking via ajaxModal, we need to bind the form to ajax
            /*
             rebind_order_drag_drop : function($modal)
             {
             $(".sand-sortable").sortable(orderItemOptions).disableSelection();
             },
             */

            //When we request marking via ajaxModal, we need to bind the form to ajax
            modal_autofocus_first_input: function ($modal) {
                $modal.find('div.modal-body').find("input[type='text']:visible:eq(0)").focus();
            },

            remove_bounty_act: function ($a, data, params) {
                if (data.success) {
                    $(".act_bounty").remove();
                }
            },

            mark_quora_comment_answer: function ($a, data, params) {
                $a.find('i').removeClass('icon-star').addClass('icon-ok');
                $a.closest('div.comment_wrapper').addClass('is_answer');
            },


            hide_top_fixed_notif: function ($a, data, params) {
                var $div = $a.parent();
                $div.fadeOut(500, function () {
                    $nextDiv = $div.next();
                    if ($nextDiv && $nextDiv.hasClass('i_notice')) {
                        $nextDiv.fadeIn(500);
                    }
                    else
                        $("#top-fixed-notif").hide();
                });

            },


            toggle_queued_class: function ($a, data, params) {
                if (data.success) {
                    //$li = $(a).closest('li');
                    var status = $a.attr('data-status');
                    var $li = $a.closest('li');
                    var $name = $li.find("a:first, a.toggle-queue-class-link");
                    if (status == 'queued')
                        $name.addClass('queued-item');
                    else
                        $name.removeClass('queued-item');
                }
                else
                    alert(t('operation_failed'));
            },


            memorized_note: function ($a, data, params) {
                var noteId = $a.attr('data-note-id');
                $a.closest('.popover').hide(); //hide popover
                //unhighlight all the matching highlighted span
                $(".highlight[data-note-id='" + noteId + "']").each(function () {
                    $(this).replaceWith($(this).html());
                });
                Sand.alert.alert_success('Congratulations! Note has been memorized');
            },

            trigger_click: function ($a, data, params) {
                $(params[0]).click();
            },

            alert_success: function ($a, data, params) {
                var message = params[0] || 'Successfully';
                Sand.alert.alert_success(message);
            },
        }
    );

});