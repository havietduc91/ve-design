/**
 * General js applied to comment
 * If a site uses a specific comment functions/callbacks, it can either
 * overwrite those functions or simply use their own custom comment.js
 */

$(function () {
    var removeTinyMCE = function (textareaId) {
        tinymce.execCommand('mceFocus', false, textareaId);
        tinymce.execCommand('mceRemoveControl', false, textareaId);
    };

    //tinymce doesn't work well when move the form element
    //around the DOM. So we need this function to make it refresh properly
    var refresh_and_focus_tinymce = function ($el, position) {
        $wrapper = $el.closest('.comments_area');
        $newCommentBox = $wrapper.find(".new_comment");
        removeTinyMCE('content');

        /*
         if (position == 'after')
         {
         $el.after($newCommentBox.show());
         }
         else if (position == 'before')
         {
         $el.before($newCommentBox.show());
         }
         else if (position == 'insert')
         {
         $el.html($("#new_comment").show());
         }
         */

        //tinymce.execCommand('mceFocus', true, 'content');
        tinymce.execCommand('mceSetContent', false, '');
        $('#grade_me').val('');
    };

    $(document).on('click', "a.edit-comment", function (e) {

        var cid = $(this).attr('data-cid');
        $("#comment-backup-" + cid).html($("#comment-" + cid).html());

        var sel = "#comment-" + cid;

        var config = Sand.editorConfigs[Sand.editorMode];
        config.selector = sel;
        //config.inline = true;
        tinymce.init(config);

        $("#comment-form-actions-" + cid).show();
        $("#comment-actions-" + cid).hide();


    });

    $(document).on('click', 'a.reply-comment', function (e) {
        var pid = $(this).attr('data-id');
        $wrapper = $(this).closest('.comments_area');
        $commentForm = $('#comment_form');
        //WTF?
        if ($commentForm.find("input[name='pid']").val() != pid) {
            $commentForm.find("a.cancel-reply").show();
            //$commentForm.find("a.reply-comment").show();
            $commentForm.find("a.cancel-update").hide();
            $commentForm.find("input[name='pid']").val(pid);
            $commentWrapper = $(this).closest('.comment_wrapper');
            // indent the comment box
            $wrapper.find(".new_comment").addClass('comment-child');
            refresh_and_focus_tinymce($commentWrapper.find("> .comment-child:first"), 'before');
        }
    });

    $(document).on("click", ".btn-quora-reply", function (e) {
        $wrapper = $('.comments_area');
//        $wrapper.find(".new_comment").addClass('comment-child');
        refresh_and_focus_tinymce($wrapper.find("> .comment-child:first"), 'before');
    });

    $(document).on('click', 'a.cancel-reply', function (e) {
        $wrapper = $(this).closest('.comments_area');
        $commentForm = $('#comment_form');

        $wrapper.find(".new_comment").removeClass('comment-child');
        $commentForm.find("a.cancel-reply").hide();
        //$commentForm.find("a.reply-comment").show();
        $commentForm.find("input[name=pid]").val(0);

        //move editor to bottom
        refresh_and_focus_tinymce($wrapper.find(".comment_list"), 'after');

        e.preventDefault();
        return false;
    });

    //append the "Cancel update" / "Cancel reply" to the form
    appendText = '<a class="cancel-update btn btn-default" href="javascript:void(0);"' +
        'style="display:none">Cancel Update</a>' +
        '<a href="javascript:void(0);"' +
        'class="cancel-reply btn btn-default" style="display:none; margin-left: 5px;">Cancel Reply</a>';
    $("input[name='submit']").parent().append(appendText);

    /**
     * Update : true, update from tinymce => html
     */
    var return_to_html = function (cid, update) {
        var editor_id = 'comment-' + cid;

        tinymce.remove("#" + editor_id);

        if (!update) {
            $("#comment-" + cid).html($("#comment-backup-" + cid).html());
        }

        $("#comment-form-actions-" + cid).hide();
        $("#comment-actions-" + cid).show();
    };

    $("a.cancel-update-comment").click(function () {
        var cid = $(this).attr('data-cid');
        return_to_html(cid, false);
    });


    Sand.callbacks = $.extend(
        Sand.callbacks,
        {
            before_update_comment: function ($form, json, params) {
                var cid = $form.attr('data-cid');
                var c = tinymce.get('comment-' + cid).getContent();
                ret = {content: c};
                return ret;
            },
            after_update_comment: function ($form, json, params) {
                var cid = $form.attr('data-cid');
                return_to_html(cid, true);
            },

            //general appending new comment
            update_comment: function ($form, json, params) {
                $wrapper = $form.closest('.comments_area');
                result = json.result;
                //TODO: do not use /quora/update-comment
                $('#comment_form').prop('action', $form.attr('update_url'));

                //replace old content with new content
                cId = $form.find('input[name=id]').val();
                selector = '#' + cId;

                $(selector).find("div.comment:first").replaceWith($(result)).addClass('highlight').removeClass('being_edited');
                ;
                Sand.alert.alert_success("Update Successful");
                $form.find(".cancel-update").trigger('click');//this will $form.resetForm();
            },
            //overwrite core's
            vote_comment_success: function ($a, data, params) {

                if (typeof data != 'undefined'
                    && typeof data.success != 'undefined'
                    && data.success != false) {
                    data.message = data.message || 'voted successfull';

                    $voteWrapper = $a.closest('.voteWrapper');
                    var votes = parseInt($voteWrapper.attr('data-votes'));
                    if ($a.attr('id') == 'quora-vote-up') {
                        votes += 1;
                    } else {
                        votes -= 1;
                    }

                    $voteWrapper.attr('data-votes', votes);
                    $voteWrapper.find('div span.votes').html(votes);
                    Sand.alert.alert_success(data.message);
                } else {
                    data.message = data.message || 'voted failse';
                    Sand.alert.alert_error(data.message);
                    return {'success': false, 'message': data.message};

                }

            },

            /* general voting for samx. Here we will increase the votes and hide the vote button*/
            unvote_comment_success: function ($a, data, params) {
                if (typeof data != 'undefined'
                    && typeof data.success != 'undefined'
                    && data.success == true) {
                    data.message = data.message || 'unvoted successfull';
                    $voteWrapper = $a.closest('.voteWrapper');
                    var votes = parseInt($voteWrapper.attr('data-votes'));

                    if ($a.attr('id') === 'quora-unvote-up') {
                        votes -= 1;
                    } else {
                        votes += 1;
                    }
                    $voteWrapper.attr('data-votes', votes);
                    $voteWrapper.find('div span.votes').html(votes);
                    Sand.alert.alert_success(data.message);
                } else {
                    data.message = data.message || 'unvoted failse';
                    Sand.alert.alert_error(data.message);
                    return {'success': false, 'message': data.message};

                }
            },
            //*GENERAL-ONLY* appending new comment
            append_new_comment: function ($form, json, params) {
                $wrapper = $form.closest('.comments_area');
                result = json.result;
                pid = $form.find("input[name=pid]").val();
                if (pid == 0) //new root comment
                {
                    $wrapper.find('.comment_list').append(result);
                }
                else {
                    var kclass = 'alteven';
                    $parentComment = $("#" + pid);
                    $firstChild = $parentComment.find("div.comment_wrapper:first");
                    $firstChild.before($(result).fadeIn(1000));//.addClass('new_comment'));
                }
                //$form.resetForm();

                $form.find("a.cancel-reply").trigger('click');

                Sand.utils.init_timeago();
                //refresh_and_focus_tinymce($wrapper.find(".comment_list"), 'after');
            },

            //*GENERAL-ONLY* appending new comment
            append_new_take: function ($form, json, params) {
                result = json.result;
                $take_list = $('.comments_area .take_list').append(result);
                Sand.alert.alert_success("Bài tập nhập thành công");

                Sand.utils.init_timeago();
                //refresh_and_focus_tinymce($wrapper.find(".comment_list"), 'after');
            }

        }
    );

});


