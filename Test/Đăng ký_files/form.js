Sand.form = Sand.form || {};

$(document).ready(function () {
    // when new HTML is inserted to document, bind it to different core plugins
    // Some plugins are not "live": tinymce, .conceptTokens, .cl_avatar, .sortable.
    // we have to explicitly manually enable/re-enable them here
    Sand.form.bind_plugins = function ($widget, $el, json, params) {
        //Bind live element if it has any form...
        var plugins = Sand.dynamic_plugins || [];
        //sortable
        Sand.utils.log("bind_plugins: current plugins");
        Sand.utils.log(plugins);
        Sand.utils.log($widget);
        Sand.utils.log(json);
        setTimeout(function () {
            if ($widget.find(".sand-sortable").size() > 0) {
                Sand.utils.log("Sand.form.bind_plugins: Found .sand-sortable. Pushing plugin 'sortable'");
                plugins.push('sortable');
            }
            
            //sortable
            if ($widget.find(".date, .datepicker").size() > 0) {
                Sand.utils.log("Sand.form.bind_plugins: Found .date . datepicker. Pushing plugin 'datepicker'");
                plugins.push('datepicker');
            }

            //sortable
            if ($widget.find(".datetimepicker").size() > 0) {
                Sand.utils.log("Sand.form.bind_plugins: Found .date . datetimepicker. Pushing plugin 'datepicker'");
                plugins.push('datetimepicker');
            }

            if ($widget.find(".editable").size() > 0) {
                Sand.utils.log("Sand.form.bind_plugins: Found .isEditor. Pushing plugin 'editable'");
                plugins.push('editable');
            }
            //token input
            if ($widget.find("input.conceptTokens").size() > 0) {
                Sand.utils.log("Sand.form.bind_plugins: Found .conceptTokens. Pushing plugin 'token'");
                plugins.push('token');
            }
            if ($widget.find('.isEditor').size() > 0) {
                Sand.utils.log("Sand.form.bind_plugins: Found .isEditor. Pushing plugin 'tinymce'");
                plugins.push('tinymce');
            }

            if ($widget.find(".cl_upload, .edx_audio, .sand-upload").size() > 0) //TODO: this is edx-specific
            {
                Sand.utils.log("Sand.form.bind_plugins: Found .cl_upload, .edx_audio, .sand-upload. Pushing plugin 'upload'");
                plugins.push('upload');
            }

            if ($widget.find(".sand-attachments").size() > 0) {
                Sand.utils.log("Sand.form.bind_plugins: Found .sand-attachments. Pushing plugin 'mm'");
                plugins.push('mm');
            }
            //cl_upload
            if ($widget.find(".sand-avatar, .edx_avatar").size() > 0) {
                Sand.utils.log("Sand.form.bind_plugins: Found .sand-avatar, .edx_avatar. Pushing plugin 'avatarcrop'");
                plugins.push('avatarcrop');
            }

            if ($widget.find("#conversation-transcript").size() > 0) {
                Sand.utils.log("Sand.form.bind_plugins: Found #conversation-transcript. Pushing plugin 'avatarcrop'");
                plugins.push('recording');
            }
            if ($widget.find('input.inline_input').size() > 0) {
                Sand.utils.log("Sand.form.bind_plugins: Found .inline_input. Pushing plugin 'auto_grow_input'");
                plugins.push('auto_grow_input');
            }
            if (typeof Sand.form.bind_plugins_custom != 'undefined') {
                plugins = plugins.concat(Sand.form.bind_plugins_custom($widget, $el, json, params));
            }

            if (json && json.plugins && json.plugins.length > 0) {
                plugins = plugins.concat(json.plugins);
            }

            plugins = Sand.array.remove_dupes(plugins);

            Sand.utils.log('==============================');
            Sand.utils.log('Sand.form.bind_plugins : binding plugins: ', plugins);
            Sand.utils.log('==============================');

            if (plugins.length > 0) {
                var widget_callbacks = [];
                for (i in plugins) {
                    var p = plugins[i];
                    widget_callbacks.push({callback: 'init_plugin', params: p});
                }

                Sand.callbacks_man.chain_callbacks({}, widget_callbacks, $widget, json);
                //reset Sand.dynamic_plugins
                Sand.dynamic_plugins = [];
            }
            if ($widget.prop('tagName') != 'BODY')
                $widget.find(":input,textarea").not('button').filter(":visible").first().focus();

            Sand.utils.log("inside time out");
            Sand.utils.log(plugins);
        }, 10);
    };

    /* a is array , as a result of
     *  var a = this.serializeArray();
     */
    $.fn.serializeObject = function (a) {
        var o = {};
        $.each(a, function () {
            if (o[this.name] !== undefined) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
        return o;
    };


    /**
     * Parse the ul.sand-sortable and return array of objects, each object
     * parsed from the "ul.sand-sortable > li.sortable-item"
     * mode: simple|flat|tree or with _children
     */
    Sand.form.get_sorted_items = function ($ul) {

        //simple|flat|tree
        var xmode = $ul.data('sand-xmode') || 'simple';
        var ret = [];
        var simple_key = $ul.data('sand-simple-key') || 'id';

        $ul.find(">.sortable-item").not("[data-sand-template]").each(function () {
            if (xmode == 'simple') {
                if (simple_key == 'id')
                    ret.push($(this).data('id') || $(this).data('item-id'));
                else {
                    var tmp = Sand.form.get_xform_data($(this));
                    ret.push(tmp[simple_key]);
                    /*
                     //prioritize over inline editable element/input
                     if ($(this).find("[name='" + simple_key + "']").size() > 0)
                     ret.push($(this).find("[name='" + simple_key + "']").val());
                     else
                     {
                     ret.push($(this).data(simple_key));
                     }
                     */
                }
            }
            else if (xmode == 'flat') {
                //by default. We should add id if it exists
                ret.push(Sand.form.get_xform_data($(this)));
            }
        });

        if (xmode == 'tree') //group them together
        {
            var root_depth;
            //Get all the root elements. Then find its attributes.
            $ul.find(".sortable-item").not("[data-sand-template]").each(function () {
                var depth = parseInt($(this).data('sortable-depth'));
                if (typeof root_depth == 'undefined')
                    root_depth = depth;
                else if (depth < root_depth)
                    root_depth = depth;
            });

            var parse_sortable_li = function ($li) {
                var depth = $li.data('sortable-depth');
                var ret = Sand.form.get_xform_data($li);
                //tim _children
                ret._children = [];

                $li.nextAll(".sortable-item").not("[data-sand-template]").each(function () {
                    if ($(this).data('sortable-depth') == depth)
                        return false; // break out of .each loop;
                    else if ($(this).data('sortable-depth') == depth + 1) {
                        ret._children.push(parse_sortable_li($(this)));
                    }
                });
                return ret;
            };

            $ul.find("[data-sortable-depth=" + root_depth + "]").not("[data-sand-template]").each(function () {
                ret.push(parse_sortable_li($(this)));
            });

        }
        return ret;
    };

    Sand.form.is_form_children = function ($el, $xinput) {
        if (!$el.data('sand-xform-id')) {
            if ($xinput.data('sand-xform-parent'))
                return false;
            else
                return true;
        }
        else {
            if (!$xinput.data('sand-xform-parent') ||
                $xinput.data('sand-xform-parent') == $el.data('sand-xform-id'))
                return true;
            else
                return false;
        }

    };
    /*
     * @return JSON object : {key1: val1, key2: val2}
     *
     * $el is a FORM. It can also be a DIV, a LI or any other HTML element.
     * keys is the list of keys that we will get from inline Element. Like
     * <a name='foo'>bar</a> Then if keys = ['foo'] then this function will also
     * regard {foo:'bar'} as an input
     * This is useful for inline editable element
     */
    Sand.form.get_xform_data = function ($el, keys) {
        var ret = {};
        var a;

        var elData = $el.data();

        $.each(elData, function (i, v) {
            var key;
            if (i.indexOf('sandXparam') == 0) {
                key = i.replace('sandXparam', '').toLowerCase();

                ret[key] = v;
            }
        });

        if (false && $el.prop('tagName') == 'FORM') {
            a = $el.serializeArray();
        }
        else {
            //TODO #1: make sure if there are multiple :input .
            // This can happen if we have multiple nested UL.sand-sortable Such as nested :input inside LI items
            // could have the same name as the :input inside the $el, but outside the wrapper UL
            var $inputs = $el.find(":input").filter(function (i, input) {
                return Sand.form.is_form_children($el, $(this));
            });
            a = $inputs.serializeArray();
        }

        var ret2 = $el.serializeObject(a);

        ret = $.extend(ret, ret2);
        //TODO #2: Không truyền keys từ ngoài vào. Tìm ".sand-input"
        //Inline none-input elements. This could include the $el it self (mostly in case if it is not a FORM)
        $el.find("[data-sand-xinput]").each(function () {
            if (!Sand.form.is_form_children($el, $(this)))
                return;

            var $xinput = $(this);
            var n = $xinput.attr('name');
            var data_sand_x_input = $xinput.attr('data-sand-xinput');
            var val;
            //If $inlineElement is a ul.sand-sortable we need to get it differently
            //It will be an array of objects|items. Each object represents a LI
            if ($xinput.prop('tagName') == 'UL' && $xinput.hasClass('sand-sortable')) {
                val = Sand.form.get_sorted_items($xinput);
            }
            else if ($xinput.prop('tagName') == 'INPUT' && $xinput.prop('type') == 'checkbox') {
                //checkbox
                if ($xinput.is(":checked")) {
                    val = $xinput.val() || $xinput.data('value') || $xinput.html();
                    val = $.trim(val);
                }
                else
                    val = null;
            }
            else {
                val = $xinput.val() || $xinput.data('value') || $xinput.html();
                val = $.trim(val);
            }
            if (val) //not empty
            {
                var tmp;
                if (data_sand_x_input == 2) {
                    tmp = JSON.stringify(val);
                } else {
                    tmp = val;
                }

                //TODO: if n is something like menus[]
                if (n.endsWith('[]')) {
                    var n1 = n.replace('[]', '');
                    if (typeof ret[n1] == 'undefined') {
                        ret[n1] = [];
                    }
                    ret[n1].push(tmp);
                }
                else {
                    ret[n] = tmp;
                }
            }
        });

        //Special token input
        if ($el.find('.conceptTokens').size() > 0) {
            $el.find('.conceptTokens').each(function () {
                //Only get it if it's parent is $el
                if (Sand.form.is_form_children($el, $(this)))
                    ret[$(this).attr('name')] = $(this).tokenInput('get');
            });
        }

        //Special case: if $el is a li.sortable-item
        // be default, we add an 'id' key. TODO Why is this?
        if ($el.hasClass('sortable-item')) {
            ret.id = ret.id || $el.data('id') || $el.data('item-id') || $el.attr('id');
        }

        return ret;
    };

    Sand.form.set_x_object_as_param = function ($xinput, objectValue) {
        $.each(objectValue, function (i, val) {

            $xinput.data('sand-xparam-' + i, val);
        });
    }

    Sand.form.high_light_error_form_element = function ($form, i, msg) {
        if (i == 'captcha')
            i = 'captcha[input]';
        var $el = $form.find("[name='" + i + "']");

        $el.closest('dd, div.form-group, .form-element-row').addClass('has-error');
        //$el.addClass('error');
        var $err = '';
        if (typeof(msg) == 'object') {
            $.each(msg, function (j, val) {
                $err += '<li>' + val + '</li>';
            });
        }
        else if (typeof (msg) == 'string')
            $err = '<li>' + msg + '</li>';

        //Append err to the input box
        /*
         <ul class="errors"><li>Please provide a valid email address.</li></ul>
         */
        $next = $el.next("ul.errors"); //ZF-specific decorators
        if ($next.size() > 0) {
            $next.html($err);
        }
        else {
            if ($el.prop('type') == 'checkbox')
            {
                //insert after the <label>, not the $el
                $el.parent().after('<ul class="errors">' + $err + '</ul>');
            }
            else 
            {
                $el.after('<ul class="errors">' + $err + '</ul>');
            }
        }

    };

    //alert type success or failure (1 or 0)
    Sand.form.highlight_alert_for_form = function ($form, msg, alertType) {
        var $el = $form.find('.form-messages');
        if ($el.size() == 0) {
            $form.prepend("<div class='form-messages'>1312312</div>");
            $el = $form.find('.form-messages');
        }
        $el.removeClass('display-none');
        $el.html(msg);
        if (!$el.is(":visible"))
            $el.closest('.display-none').removeClass('display-none');

        $el.removeClass('alert-success').removeClass('alert-danger');
        if (alertType == 1)
            $el.addClass('alert alert-success');
        else
            $el.addClass('alert alert-danger');
    };

    Sand.form.remove_errors_for_all_form_elements = function ($form) {
        $form.find(".has-error").removeClass('has-error');
        $form.find("ul.errors").html('');
        $form.find("ul li.error").html('');
    };

    Sand.form.remove_form_element_error = function ($el) {
        $el.closest('.has-error').removeClass('has-error').find('ul.errors').html('');
    };

    Sand.form.populate_json_to_select = function (data, sel, selected) {
        var html = '';

        for (i in data) {
            if (i == selected)
                html += '<option selected value="' + i + '">' + data[i] + '</option>';
            else
                html += '<option value="' + i + '">' + data[i] + '</option>';
        }
        $(sel).html(html);
    };


    Sand.form.populate_array_to_select = function (data, sel, selected) {
        var html = '';

        for (i in data) {
            if (data[i] == selected)
                html += '<option selected value="' + data[i] + '">' + data[i] + '</option>';
            else
                html += '<option value="' + data[i] + '">' + data[i] + '</option>';
        }
        $(sel).html(html);
    };

    Sand.form.populate_json_to_multicheckbox = function (data, name, sel) {
        var html = '';

        for (i in data) {
            html += ' <input type="checkbox" value="' + i + '" name="' + name + '[]" />  ' + data[i];
        }
        $(sel).html(html);
    };


    //ZF captcha
    $(document).on('click', '.zf-captcha-dd img', function (e) {
        var that = $(this); //image
        $.ajax({
            url: '/captcha.php?captcha=Image',
            dataType: 'json',
            success: function (jsonData) {
                if (jsonData.success) {
                    that.closest('dd').find("input[type='hidden']").attr('value', jsonData.result.sessId);
                    that.replaceWith(jsonData.result.image);
                }
            }
        });
    });

    var sel1 = "form[data-sand] input,form[data-sand] select,form[data-sand] textarea";
    $(document).on('change keypress', sel1, function (e) {
        Sand.form.remove_form_element_error($(this));
    });

    $(document).on('click', '.accordion-explan', function (e) {
        var isExplan = $(this).attr('is-explan');
        if (isExplan == 1) {
            $('.accordion-wrap  .panel-collapse').collapse('toggle');
            $(this).attr('is-explan', 0);
            $(this).find('i').attr('class', 'glyphicon glyphicon-resize-full');
        } else {
            $('.accordion-wrap  .panel-collapse').collapse('toggle');
            $(this).attr('is-explan', 1);
            $(this).find('i').attr('class', 'glyphicon glyphicon-resize-small');
        }
    });
});
