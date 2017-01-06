var Champion;
$(document).ready(function () {
    Champion = {
        change_multi_options: function ($data, $elShow, callback) {
            Champion.disable_select_option($elShow);
            if (!$data.id) {
                return;
            }
            Sand.ajax.ajax_request({
                url: "/category/api/get-data-child-level",
                data: $data,
                dataType: 'json',
                success: function (json) {
                    if (json.success) {
                        Sand.load_templates(['category|select-branch-box'], function () {
                            var html = Sand.template.render(Sand.get_template('category', 'select-branch-box'), json);
                            Sand.set_html($elShow, html, true);
                            Sand.form.remove_form_element_error($($elShow).parent());
                            if (typeof callback != 'undefined') {
                                callback();
                            }
                        });

                    }
                }
            });
        },

        render_select_box_option: function ($el) {
            var json = {
                result: [
                    {iid: '', name: Sand.translator.translate('select', 1) + ' ' + Sand.translator.translate($el, 1)}
                ]
            };
            Sand.load_templates(['category|select-branch-box'], function () {
                var html = Sand.template.render(Sand.get_template('category', 'select-branch-box'), json);
                Sand.set_html($el, html, true);
            });
        },

        disable_select_option: function ($el) {

            if ($el == '#school__grade') {
                return;
            }
            $($el).find('option:eq(0)').prop('selected', true);
            Champion.render_select_box_option($el);
            if ($el == '#school__district') {
                Champion.disable_select_option('#school__id');
            }
        },

        upload_file_user_group_cb: function (json, $el) {
            if (json.success) {
                var link = json.result.attachments[0].link;
                $('#guest-formter-information').find('input[name=file]').val(link);
                $('#guest-formter-information').find('input[name=submit]').trigger('click');
                Champion.show_upload_loading();
                Champion.hide_import_info();
            } else {

            }
        },

        import_temp_result: function ($el, json, params) {
            if (json.success) {
                Sand.load_templates(['user|guest-turn-import-result'], function () {
                    var $template = Sand.get_template('user', 'guest-turn-import-result');
                    var html = Sand.template.render($template, json);
                    Sand.set_html('#guest-formter-information_result', html, true);
                    $('#school_form_user_temp_import').find('input[name=submit]').trigger('click');
                });
            }
            Champion.hide_upload_loading();
        },

        view_detail_users_import: function ($el, json, params) {
            if (json.success) {
                Sand.callbacks.populate_search_result($el, json, params);
            } else {
                Sand.callbacks.alert_message($el, json, params);
            }
            Champion.hide_upload_loading();
            Champion.show_import_info();
        },

        show_import_info: function () {
            $(".import-info").show();
            $(".champion-form table").show();
            $("#guest-formter-information_result .ul-wrapper").show();
        },

        hide_import_info: function () {
            $(".import-info").hide();
            $(".champion-form table").hide();
            $("#guest-formter-information_result .ul-wrapper").hide();
        },

        show_upload_loading: function () {
            $(".blockUI.blockOverlay").show();
            $(".blockUI.blockMsg.blockPage").show();
        },

        hide_upload_loading: function () {
            $(".blockUI.blockOverlay").hide();
            $(".blockUI.blockMsg.blockPage").hide();
        },

        before_upload_file: function () {
            var ok = true;
            var name = $('#importer__name').val();
            var mail = $('#importer__mail').val();

            var phone = $('#importer__phone').val();
            if (!name) {
                Sand.form.high_light_error_form_element($('#guest-formter-information'), 'importer__name', emptyError);
                ok =  false;
            }

            if (!phone) {
                Sand.form.high_light_error_form_element($('#guest-formter-information'), 'importer__phone', emptyError);
                ok =  false;
            }

            if (!mail) {
                Sand.form.high_light_error_form_element($('#guest-formter-information'), 'importer__mail', emptyError);
                ok =  false;
            }
            return ok;
        },

        bindClickEvents: function () {

            //span onclick
            $(document).on('click', 'span', function () {
                var $el = $(this).find('a');
                if ($(this).hasClass('btn') && $el.length == 1) {
                    $el.trigger('click');
                }
            });

            $(document).on('click', '#district, #school__district, #school__id', function () {
                var field = $(this).attr('name');
                var fieldParent = '';
                var message = '';
                switch (field) {
                    case 'district':
                        fieldParent = 'province';
                        message = messages.province.required;
                        break;
                    case 'school__district':
                        fieldParent = 'school__province';
                        message = messages.school__province.required;
                        break;
                    case 'school__id':
                        fieldParent = 'school__district';
                        message = messages.school__district.required;
                        var message2 = messages.school__grade.required;
                        break;
                    default:
                }
                var value = $("#" + fieldParent).val();
                if (value == 'undefined' || !value) {
                    Sand.form.high_light_error_form_element($('#user_form_register, #user_form_update'), field, message);
                }
                if (typeof message2 != 'undefined' && message2 && !$("#school__grade").val()) {
                    Sand.form.high_light_error_form_element($('#user_form_register, #user_form_update'), field, message2);
                }
            });

            $(document).on('change', 'form #province', function () {
                var data = {id: $(this).val(), type: 'district'};
                Champion.change_multi_options(data, '#district');
                var province = $('form #school__province').val();
                if (typeof province != 'undefined' && !province) {
                    $('form #school__province').val($(this).val());
                    var data = {id: $(this).val(), type: 'district'};
                    Champion.change_multi_options(data, '#school__district');
                }
            });

            $(document).on('change', 'form #school__province', function () {
                var data = {id: $(this).val(), type: 'district'};
                Champion.change_multi_options(data, '#school__district'
                    /*, function () {
                     var data = {id: $('#school__district').val(), type: 'school'};
                     Champion.change_multi_options(data, '#school__id');
                     }*/
                );
            });

            /*         $(document).on('change', 'form #district', function () {
             var province = $('form #school__district').val();
             if (typeof province != 'undefined' && !province) {
             $('form #school__district').val($(this).val());
             var data = {id: $(this).val(), type: 'school'};
             Champion.change_multi_options(data, '#school__id');
             }
             });*/

            $(document).on('change', 'form #school__district', function () {
                var data = {id: $(this).val(), type: 'school'};
                var grade = $('form #school__grade').val();
                if (typeof grade != 'undefined' && grade) {
                    data.grade = grade;
                }
                Champion.change_multi_options(data, '#school__id');
            });

            $(document).on('change', 'form #school__grade', function () {
                var district = $('form #school__district').val();
                var data = {id: district, type: 'school', grade: $(this).val()};
                Champion.change_multi_options(data, '#school__id');
            });

            $(document).on('change', '.capitalise-first-letter', function () {
                $(this).val(Sand.string.capitalise_title_case($(this).val()));
            });

            $(document).on('change', '#parent__phone', function () {
                var str = $(this).val().replace(/\s/g, '');
                $(this).val(str);
            });

            $(document).on('change', '#survey__english_center', function () {
                if ($(this).val() == 1) {
                    $('#survey__english_center_name-element').show();
                } else {
                    $('#survey__english_center_name-element').hide();
                }
            });

            $(document).on('change', '#survey__consulting', function () {
                if ($(this).val() == 1) {
                    $('#survey__consult_content-element').show();
                } else {
                    $('#survey__consult_content-element').hide();
                }
            });

            $(document).on('change', '.replace-all-spaces', function () {
                $(this).val(Sand.string.replace_all_spaces($(this).val()));
            });

            $(document).on('change', '.multiple-spaces-to-one', function () {
                $(this).val(Sand.string.multiple_spaces_to_one($(this).val()));
            });

            $(document).on('change', '#survey__gpa', function () {
                $(this).val($(this).val().replace(',', '.'));
            });

            $(document).on('click', '#try_import', function () {
                $(".upload-file-register .upload-button").trigger('click');
            });

            $(document).on('change', 'input[name=importer__relative]', function () {
                var check = $(this).data('toggle-element');
                if (typeof check == 'undefined' || !check) {
                    $('#other_relative-element').hide();
                } else {
                    $('#other_relative-element').show();
                }
            });

            $("#upload-file-register").cl_upload({
                url: '/file/index/upload',
                callback: function (json, $el) {
                    Champion.upload_file_user_group_cb(json, $el);
                },
                params: {
                    access: 'public',
                    type: 'attachment',
                    folder: 'import-user-group',
                    _sand_step: 'register-user-group',
                    size_limit: 2
                },
                behavior: 'change'
            });

            $('#duplicated-users #stop').on('click', function () {
                $('#sand-modal').modal('hide');
            });

            $('#duplicated-users #continue').on('click', function () {
                $('#sand-modal').modal('hide');
                $('#is_check_duplicated').val('');
                $('#user_form_register #submit').trigger('click');
            });
        }
    };
    Champion.bindClickEvents();
});