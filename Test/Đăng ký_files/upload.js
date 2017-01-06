//upload file plugin. Into an iframe
(function ($) {
    Sand.upload_trigger = function ($el, json, params) {
        if (!$('#guest-formter-information').is(":visible") || typeof Champion.before_upload_file == 'undefined' || Champion.before_upload_file()) {
            $el.closest('.btn-upload-container').find("input[type='file']").trigger('click');
        }
    }

    var addUploadButton = function ($obj) {
        var text = $obj.attr('data-upload-label') ? $obj.attr('data-upload-label') : Sand.translator.translate('upload_files', 1);
        var title = $obj.attr('data-upload-title') ? $obj.attr('data-upload-title') : Sand.translator.translate('click_to_select_files_to_upload', 1);
        var btnClass = $obj.attr('data-upload-btn-class') ? $obj.attr('data-upload-btn-class') : 'btn btn-primary btn-xs fileinput-button';
        text = Sand.utils.gen_icon('upload') + ' ' + text;

        var str = '<div>' +
            '<a data-sand-fake=1 href="#" data-sand-bs="Sand.upload_trigger" title="' + title + '" class="upload-button">' + text + "</a>" +
            '<span><input style="display:none;" type="file" name="files_list[]" multiple="true"/></span>' +
            '</div>';

        //var wraptext = $('<div class="btn-upload-container clearfix clear"></div>');
        var wraptext = $('<div class="btn-upload-container clearfix clear"><span class="' + btnClass + '"></span></div>');

        $obj.wrap(wraptext);

        $(str).insertBefore($obj);
        var $elm = $obj.closest('.fileinput-button').find('input[type=file]');

        return $elm;
    };

    /*
     $.fn.cl_upload_unbind = function()
     {
     $("#iframe-file-upload").remove();
     return this.each(function(){
     if ($(this).closest('div.btn-upload-container').length != 0)
     {
     $(this).siblings().remove();
     $(this).unwrap('.fileinput-button');
     $(this).unwrap('div.btn-upload-container');
     }
     });
     };
     */

    $.fn.cl_upload = function (options) {
        if ($('#loading_upload').length === 0) {
            var html = '<div class="loading_cover_upload" style="display: none;"><div id="loading_upload">' +
                '</div></div>';
            $('body').append(html);
        }
        //refresh each time its called
        if ($("iframe#iframe-file-upload").length != 0) {
            //$("#iframe-file-upload").remove();
            this.each(function () {
                if ($(this).closest('div.btn-upload-container').length != 0) {
                    $(this).siblings().remove();
                    $(this).unwrap().unwrap();
                }
            });
        }

        if ($("iframe#iframe-file-upload").length == 0) {
            $('body').append('<iframe style="display: none;" onload="" name="iframe-file-upload" id="iframe-file-upload"></iframe>');
        }

        var defaults = {
            url: '/file/index/upload',
            //callback : avatar_upload_callback,
            params: {},
            behavior: 'change',
            //form_id: 'uploadFile',
            //selector: '',
        };

        var options = $.extend(defaults, options);

        var params = $.param(options.params);

        var $frame = $('iframe#iframe-file-upload');

        //loop through each .cl_upload input items
        return this.each(function () {
            var $that = $(this);
            var url = $that.attr('data-upload-url') ? $that.attr('data-upload-url') : options.url;

            var $form = '<form action="' + url + "?" + params + '" method="post" enctype="multipart/form-data" target="iframe-file-upload" />';
            var $inputFileObj = addUploadButton($(this));
            $inputFileObj.wrap($form);

            var $formWrapper = $inputFileObj.closest('form');//.clone();

            $inputFileObj.unwrap();
            $inputFileObj.on(options.behavior, function (e) {
                e.preventDefault();
                // options.params.size_limit : MB
                if (typeof options.params != 'undefined' && typeof options.params.size_limit != 'undefined' && this.files[0].size > options.params.size_limit * 1024 * 1024) {
                    var messages = Sand.translator.translate('upload_file_size_exceeds_the_permitted_level.', 1)
                        + Sand.translator.translate('limit_file_size_upload:', 1)
                        + options.params.size_limit + "MB";
                    Sand.callbacks.alert_message($(this), {'success': false, 'message': messages});
                    return;
                }

                var extension = $(this).val().replace(/^.*\./, '');
                if (typeof options.params._sand_step !== 'undefined' && options.params._sand_step == 'register-user-group' && jQuery.inArray(extension, ['xls', 'xlsx']) == -1) {
                    var messages = Sand.translator.translate('only_allowed_to_upload_files_xls_or_xlsx', 1);
                    Sand.callbacks.alert_message($(this), {'success': false, 'message': messages});
                    return;
                }

                if (typeof MM != 'undefined')
                    MM.beginLoading();
                var doc = $frame[0].contentWindow.document;
                var $body = $('body', doc);

                $formWrapper.html($(this));
                $body.html($formWrapper);

                $frame.unbind("load").load(function () {
                    var data = $frame.contents().find('body').html();
                    var json = JSON.parse(data);

                    if (options.callback) {
                        options.callback(json, $that);
                    }
                });

                $formWrapper.submit();
                if (typeof MM != 'undefined')
                    MM.endLoading();
                $that.closest('.fileinput-button').append($(this));
                $formWrapper.remove();

                $(this).val('');
                return false;
            });
        });
    };
    //$(".cl_upload").cl_upload();
})(jQuery);

$(document).ready(function () {
    Sand.callbacks.init_plugin_upload = function () {
        $(".cl_upload,.sand-upload").cl_upload();
    };
});