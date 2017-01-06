function hide_modal_iframe_loading() {
    document.getElementById("sand-iframe-loading").style.display = 'none';
};

Sand.ajax = Sand.ajax || {};

$(document).ready(function () {
    Sand.set_html = function (sel, html, show) {
        Sand.clear_plugins();
        $(sel).html(html);
        if (html == '')
            $(sel).hide();
        else {
            if (show)
                $(sel).show();
            Sand.form.bind_plugins($(sel));
        }
    },
        Sand.clear_plugins = function () {
            if (typeof tinymce != 'undefined') {
                tinymce.remove("textarea.isEditor");
            }
        };

    function is_modal($el) {
        if ($el.data('sand-modal'))
            return true;
        else
            return false;
    }

    Sand.ajax.get_target_widget = function ($el) {
        var $widget; //target widget
        if ($el.hasClass('sand-ajax-widget')) {
            $widget = $el;
        } else {
            var widget_selector = get_widget_selector($el);
            $widget = $(widget_selector);
            if ($widget.size() == 0 && $el.data('sand-modal') /* must be created-on-the-fly modal*/) {
                //create modal here
                var widget_id = widget_selector.replace('#', '');
                var modalText = Sand.utils.create_modal(widget_id);
                $('body').append($(modalText));
                $widget = $(widget_selector);
            }
        }
        return $widget;
    }

    function get_widget_selector($el) {
        var widget_selector = '#sand-modal'; //default
        if ($el.data('sand-widget')) {
            widget_selector = $el.data('sand-widget');
        } else if ($el.data('sand-modal')) {
            var t = $el.data('sand-modal');
            if (t == 1 ||
                t == 'yes' ||
                t == 2 ||
                t == 3
            ) {
                widget_selector = "#sand-modal"; //default modal
            }
            else
                widget_selector = $el.data('sand-modal');
        }
        return widget_selector;
    }

    /**
     * All callbacks
     */
    Sand.callbacks = $.extend(
        Sand.callbacks,
        {
            follow_href: function ($el, json, params) {
                window.location = $el.attr('href');
            },
            javascript: function ($el, json, params) {
                eval(params);
                return {success: true};
            },

            //if we click on <a href='/user/login' class='cl_ajax' we
            // will go to #!/user/login
            goto_hashbang: function ($el, json, params) {
                var url_hash;
                if ($el.prop('tagName') == 'A') {
                    url_hash = $el.attr('data-href') || $el.attr('href');
                    Sand.url.goto_hashbang(url_hash);
                } else {

                }
            },

            /*
             * This widget is either a widget on the page
             * or a modal
             * Modal is basically a widget. The only difference is that modal has title
             * and it's shown via bootstrap's
             */
            show_widget_loading: function ($el, json, params) {
                // if it's a widget, it must either have
                // data-sand-widget & data-sand-target='#widget-area'
                // Or and data-sand-modal which implicitly means data-sand-target='#sand-modal'

                //if this is a <div class='widget_ajax self'
                $widget = Sand.ajax.get_target_widget($el);

                //now widget is available. Resize it
                //Resize modal if $el.data('modal-width');
                var w = $el.data('sand-widget-width') || $el.data('sand-modal-width');
                var $dialog = $widget.find('.modal-dialog');
                if (w) {
                    if (!$dialog.data('sand-original-width')) {
                        $dialog.data('sand-original-width', $dialog.width());
                    }
                    $dialog.css('width', w);//($dialog, w);
                } else if ($dialog.data('sand-original-width')) {//original width already stored
                    $dialog.css('width', $dialog.data('sand-original-width'));
                }

                //show widget/modal
                if ($el.data('sand-iframe')) {
                    var max_height = parseInt(window.innerHeight) - 150;

                    var h = $el.data('sand-iframe-height') || max_height + 'px';
                    var href = $el.attr('href');
                    if (href.indexOf('?') != -1)
                        href = href + '&_sand_modal_iframe=1';
                    else
                        href = href + '?_sand_modal_iframe=1';

                    var iframe = '<iframe src="' + href +
                        '" onload="javascript:hide_modal_iframe_loading()" style="width:100%;border:none;height:' + h + ';"/>';
                    var loading = "<div id='sand-iframe-loading'>" + Sand.utils.generate_loading_text(true) + "</div>";
                    if ($widget.find('.sand-body').size() > 0) {
                        $widget.find(".sand-body").html(loading + iframe);
                    } else {
                        $widget.html(loading + iframe);
                    }
                } else {
                    //before removing HTML. we have to cache it
                    if ($widget.data('sand-cache')) {
                        //get current cache ID and cache id into the key
                        var cacheId = $widget.attr('data-sand-cache-id');

                        if (cacheId) {
                            /*
                             //TODO : remove tinymce otherwise tinymce doesn't get re-inited
                             if (typeof tinymce != 'undefined')
                             {
                             //console.log('triggering save');
                             tinyMCE.triggerSave();
                             //tinymce.remove("textarea.isEditor");
                             }


                             //maybe show 'nprogress' or show a "loading..." text next to the buttons
                             //tinymce bug: before initing a textarea, the old textarea must be
                             //removed.
                             // see http://stackoverflow.com/a/22933421
                             if (typeof tinymce != 'undefined')
                             {
                             tinymce.remove("textarea.isEditor");
                             }
                             */

                            $widget = Sand.ajax.get_target_widget($el);

                            //Sand.ajax.cache[cacheId] = $widget.get(0).cloneNode(true);
                            Sand.ajax.cache[cacheId] = $widget.clone(true, true);
                            //Sand.ajax.cache[cacheId] = $widget.html(); //set cache
                        }
                    } else {
                        //maybe show 'nprogress' or show a "loading..." text next to the buttons
                        //tinymce bug: before initing a textarea, the old textarea must be
                        //removed.
                        // see http://stackoverflow.com/a/22933421

                        var sel = get_widget_selector($el);
                        if (typeof tinymce != 'undefined') {
                            tinymce.remove(sel + " textarea.isEditor");
                        }
                    }

                    if ($widget.find('.sand-body').size() > 0) {
                        $widget.find('.sand-body').html(Sand.utils.generate_loading_html());
                        $widget.find('.sand-title').html('');
                    } else {//Cacheable here
                        $widget.html(Sand.utils.generate_loading_html());
                    }
                }
                if ($el.data('sand-title'))
                    $widget.find(".sand-title").html($el.data('sand-title'));

                if (is_modal($el)) {
                    $widget.modal({backdrop: true}).on('hidden.bs.modal', function () {
                        Sand.url.back();
                    });
                } else {
                    $widget.show();
                }
            },

            populate_html_to_widget: function ($el, json, params) {
                Sand.callbacks.core_populate_html_to_widget($el, json, params);
            },

            core_populate_html_to_widget: function ($el, json, params) {
                //TODO: change cache id
                if (!$el.data('sand-iframe')) {
                    var $widget = Sand.ajax.get_target_widget($el);

                    //get HTML
                    var body, title;

                    if (json.success && json.widgets) {
                        var widgets = json.widgets || {};
                        if (widgets.content)
                            body = widgets.content;
                        if (widgets.title)
                            title = widgets.title;
                    } else if (json.message) {
                        body = json.message;
                    } else {
                        body = json;
                    }

                    /*
                     * TODO: document.title = title;
                     if (json.result && json.result.title)
                     title = json.result.title;
                     else
                     title = '';
                     */

                    //TODO: we need to bind all the plugins first. Then we will
                    //enable clicks...
                    if (json.cache_id) {
                        $widget.replaceWith(Sand.ajax.cache[json.cache_id]);

                        //$widget.html('');
                        //$widget.get(0).appendChild(Sand.ajax.cache[json.cache_id]);
                        //var $a = Sand.ajax.cache[json.cache_id].clone(true, true);//, true);
                        //$a.appendTo($widget);
                        //replace $widget with Sand.ajax.cache[cacheId]
                    } else {
                        if ($widget.find('.sand-body').size() > 0) {
                            Sand.clear_plugins($widget.find('.sand-body'));
                            $widget.find('.sand-body').html(body);

                            if (title != '')
                                $widget.find('.sand-title').html(title);
                        } else {
                            Sand.clear_plugins($widget);
                            $widget.html(body);
                        }
                        //setTimeout(function(){Sand.form.bind_plugins($widget, $el, json, params);}, 10);
                    }

                    if ($widget.data('sand-cache')) {
                        var cacheId = $el.data('sand-cache-id') || $el.attr('href');
                        $widget.data('sand-cache-id', cacheId);
                        //Sand.ajax.cache[cacheId];
                    }
                    //setTimeout(function(){
                    //var sel = get_widget_selector($el);
                    $widget = Sand.ajax.get_target_widget($el);
                    /*
                     var cacheId = $widget.attr('data-sand-cache-id');
                     if (cacheId && Sand.ajax.cache[cacheId])
                     {
                     //Do not bind plugins for
                     }
                     else
                     */
                    Sand.form.bind_plugins($widget, $el, json, params);
                    if ($el.data('sand-wac')) {
                        //widget-additional-callback
                        //same as PHP form's addAsCallback
                        Sand.callbacks_man.addAsCallback($widget.find('form'), $el.data('sand-wac'));
                    }
                    //}, 10);
                    //$widget.find('div.modal-body').find(":input:visible").first().focus();
                }
            },

            check_login: function ($el, json, params) {
                if (Sand.utils.is_guest()) {
                    window.location.href = "/user/login?b=" + window.location.href;
                    return {success: false};
                }
                else
                    return {success: true};
            },

            confirm: function ($el, json, params) {
                var confirm_msg = $el.data('sand-confirm');
                if (!confirm_msg || confirm_msg == 'yes' || confirm_msg == '1')
                    confirm_msg = Sand.translator.translate('are_you_sure_you_want_to_do_this');
                if (!confirm(confirm_msg)) {
                    return {success: false, err: 'not_confirm', stop_propagation: true};
                }
                else {
                    return {success: true};
                }
            },

            validate_form: function ($el, json, params) //TODO
            {
                return {success: true};
            },

            helloworld: function ($el, json, params) {
                return {success: true, result: {foo: 'Foo from helloworld', 'bar': 'Another bar'}};
            },

            //When element is clicked, show user that something's happening
            //and disable user's consequent clicks on the button/links
            show_loading: function ($el, json, params) {
                //changing the text to loading
                if ($el.prop('tagName') == 'FORM') {
                    var $btn = $el.find("[name='submit']");
                    $btn.data('orig-text', $btn.attr('value'));
                    var text = Sand.utils.generate_loading_text();
                    $btn.attr('value', text);
                }

                Sand.utils.show_ajax_loading();
                return {success: true};
            },

            hide_loading: function ($el, json, params) {
                //changing the text to loading
                var $item = $el;
                if ($el.prop('tagName') == 'FORM') {
                    $item = $el.find("[name='submit']");
                    var text = $item.data('orig-text') || 'Submit';
                    $item.attr('value', text);
                }
                Sand.utils.hide_ajax_loading();
            },

            enable_clicks: function ($el, json, params) {
                $el.removeClass('disabled');
                if ($el.prop('tagName') == 'FORM') {
                    $el.find("[name='submit']").removeClass('disabled');
                }
            },

            disable_clicks: function ($el, json, params) {
                $el.addClass('disabled');
                if ($el.prop('tagName') == 'FORM') {
                    $el.find("[name='submit']").addClass('disabled');
                }
            },

            // all the common actions that should be done when a form is submitted
            // such as refresh captcha, populate & highlight errors...
            // json will have json.message as the overall form message
            // json.err will contain all detailed messages of each form's element
            display_notification: function ($el, json, params) {
                Sand.callbacks.display_alert_notification($el, json, params);
                Sand.callbacks.highlight_element_form_error($el, json, params);
            },

            display_alert_notification: function ($el, json, params) {
                if (typeof params != 'undefined' && typeof params[0] != 'undefined') {
                    var msg = params[0];
                    var duration = params[2] || undefined;
                    if (typeof params[1] == 'undefined' || params[1])
                        Sand.alert.alert_success(msg, duration);
                    else
                        Sand.alert.alert_error(msg, duration);

                    return {success: true};
                }
                //for search form. By default don't alert this notification.

                if ($el.data('form-type') == 'search') {
                    return;
                }

                if ($el.prop('tagName') == 'FORM') {
                    var alertPosition = $el.data('alert-position') || 'popup';
                    var message;
                    if (json.success) {
                        message = json.message || Sand.translator.translate('operation_successful');
                        if (alertPosition == 'popup') {
                            Sand.utils.log("alert_success" + message);
                            Sand.alert.alert_success(message, json.duration);
                        } else {
                            Sand.form.highlight_alert_for_form($el, message, 1 /*success*/);
                            Sand.form.redraw_captcha($el);
                        }
                    } else {
                        message = json.message || Sand.translator.translate('operation_failed');
                        
                        if ($('#thecao_form').length && json.success) {
                            var balance = "$ " + json.result;
                            $('#user-balance span').html(balance);
                        }

                        if (alertPosition == 'popup') {
                            Sand.alert.alert_error(message);
                        } else {
                            Sand.form.highlight_alert_for_form($el, message, 0 /*failed*/);
                        }
                    }
                }
            },

            highlight_element_form_error: function ($el, json, params) {
                if ($el.prop('tagName') == 'FORM') {
                    Sand.form.remove_errors_for_all_form_elements($el);
                    var message;
                    
                    message = json.message || Sand.translator.translate('operation_failed');
                    if (!json.success && json.err) {
                        if (typeof(json.err) == 'object') {
                            $.each(json.err, function (i, msg) {
                                if (msg)
                                    Sand.form.high_light_error_form_element($el, i, msg);
                            });
                            Sand.form.redraw_captcha($el);
                        }
                    }
                }
            },

            /*** Can both be used for form.cl_ajax and a.cl_ajax **/
            redirect: function ($el, json, params) {
                if (json.success) {
                    if (params) {
                        if (typeof params[0] == 'string')
                            window.location.href = params[0];
                        //else if is an object
                    }
                    if (typeof json.objects != 'undefined' && typeof json.objects.data != 'undefined' &&
                        typeof(json.objects.data.url) != 'undefined') {
                        window.location.href = json.objects.data.url;
                    }
                    else if (typeof json.objects != 'undefined' && typeof(json.objects.url) != 'undefined')
                        window.location.href = json.objects.url;
                }
            },

            //params will be the selector
            simulate_click: function ($el, json, params) {
                if (typeof json != 'undefined' && typeof json.success != 'undefined' && !json.success) {

                } else {
                    $(params[0])[0].click();
                }

            },

            reload_page: function ($el, json, params) {
                if (json.success) {
                    window.location.reload();
                }
            },

            reset_form: function ($form, json, params) {
                $form.trigger('reset');
            },

            alert_message: function ($a, json, params) {
                if (typeof json != 'undefined' && typeof json.message != 'undefined') {
                    if (json.success) {
                        Sand.alert.alert_success(json.message || "Successful");
                    } else {
                        Sand.alert.alert_error(json.message);
                    }
                } else {
                    Sand.alert.alert_success("Successful");
                }
            },

            add_class: function ($a, data, params) {
                var levelUp = 0;
                if (params && params[1]) {
                    if (params[1]) {
                        levelUp = params[1];
                    }
                }
                if (isNaN(levelUp))
                    var $el = $(levelUp);
                else
                    var $el = Sand.utils.get_ancestor($a, levelUp);
                var toggleClass = params[0];
                $el.addClass(toggleClass);
            },

            remove_class: function ($a, data, params) {
                var levelUp = 0;
                if (params && params[1]) {
                    if (params[1]) {
                        levelUp = params[1];
                    }
                }
                if (isNaN(levelUp))
                    var $el = $(levelUp);
                else
                    var $el = Sand.utils.get_ancestor($a, levelUp);
                var toggleClass = params[0];
                $el.removeClass(toggleClass);
            },

            toggle_class: function ($a, data, params) {
                var levelUp = 0;
                if (params && params[1]) {
                    if (params[1]) {
                        levelUp = params[1];
                    }
                }
                if (isNaN(levelUp)) {
                    var $el = $(levelUp);
                } else {
                    var $el = Sand.utils.get_ancestor($a, levelUp);
                }

                var toggleClass = params[0];
                $el.toggleClass(toggleClass);
            },

            active_group_item: function ($a, data, params) {
                var levelUp = 0; //how many levels up to go before we
                var toggleClass = "active";    // process the list of classes in classes
                if (params) {
                    toggleClass = params[0];
                    if (params[1]) {
                        levelUp = params[1];
                    }
                }
                var $el = Sand.utils.get_ancestor($a, levelUp);
                $el.siblings().removeClass(toggleClass);
                $el.addClass(toggleClass);
            },

            /********************************callbacks*******************************/
            //When we request marking via ajaxModal, we need to bind the form to ajax
            rebind_rte: function ($a, data, params) {
                init_tinymce();
            },

            rebind_tinymce: function ($div, data, params) {
                //tinymce.init(Sand.editorConfigs[Sand.editorMode]);
                if (typeof Sand.tinymceIniter == 'function') {
                    //http://stackoverflow.com/a/18710059
                    tinyMCE.editors = [];
                    Sand.tinymceIniter();
                    tinymce.init(Sand.editorConfigs[Sand.editorMode]);
                }
                else {
                    Sand.utils.log('Sand.tinymceIniter is not a function');
                }
            },

            bulk_delete_bs: function ($a, data, params) {
                var arr = [];
                var tableSelector = $a.data('table-selector');
                $table = $(tableSelector);
                $table.find('.check-item').each(function () {
                    if ($(this).is(":checked") && $(this).is(":visible")) {
                        arr.push($(this).val());
                    }
                });

                return {
                    success: true,
                    result: {
                        ids: arr
                    }
                };
            },

            bulk_delete_as: function ($a, json, params) {
                if (json.success) {
                    //var count = 0;
                    $.each(json.ids, function (i, id) {
                        $('table tr#' + id).fadeOut();
                    });
                    //Sand.alert.alert_success('Successfully deleted ' + json.ids.length + ' items');
                    if (json.failcount && parseInt(json.failcount) > 0)
                        Sand.alert.alert_error(json.failcount_message);
                }
                else {
                    Sand.alert.alert_error(json.message);
                }
            },

            remove_avatar: function ($a, data, params) {
                $a.parent().parent().find('img').attr('src', data['result']);
                //$a.parent().hide();
                Sand.alert.alert_success(Sand.translator.translate('operation_successful'));
            },

            change_class: function ($a, data, params) {
                for (addorremove in params) {
                    listOfClasses = params[addorremove]; //array of multiple selectors
                    for (i in listOfClasses) {
                        klass = listOfClasses[i];//which is also an array like ['parent','next']
                        if (addorremove == 1)
                            $a.addClass(klass);
                        else
                            $a.removeClass(klass);
                    }
                }
            },

            password_retype_same: function ($form, json, params) {
                if ($form.find('[name="old_pass"]').val() == '') {
                    var t = Sand.translator.translate('passwords_do_not_empty');
                    return {success: false, err: {old_pass: t}};
                } else if ($form.find('[name="pass"]').val() == '') {
                    var t = Sand.translator.translate('passwords_do_not_empty');
                    return {success: false, err: {pass: t}};
                } else if ($form.find('[name="pass_retype"]').val() == '') {
                    var t = Sand.translator.translate('passwords_do_not_empty');
                    return {success: false, err: {pass_retype: t}};
                } else if ($form.find('[name="pass"]').val()
                    == $form.find('[name="pass_retype"]').val()) {
                    return {success: true};
                } else {
                    var t = Sand.translator.translate('passwords_do_not_match');
                    return {success: false, err: {pass: t, pass_retype: t}};
                }
            },

            /**************************form.cl_ajax***********************/
            /*After ajax form is submitted successfully, if any captchas on the form are there
             * we need to redraw it*/
            /* Populate view html to the preview_area*/
            preview_form: function ($form, json, params) {
                //$("#preview_area").html(json.data);
                var t = $form.data('sand-preview-target') || '#preview_area';
                $(t).append(json.data);
                $("#_sand_preview").remove();
            },

            //turn form into GET and submit the form without the _sand_step & submit params
            //used for /syllabus/prenew before redirecting to /syllabus/new
            /*
             prenew_form: function ($el, json, params) {
             var formData = $el.serializeObject($el.serializeArray());
             var url;
             if ($el.attr('action') == '')
             url = window.location.href;
             else
             url = window.location.protocol + '//' + window.location.host + $el.attr('action');
             url = url + '?';

             delete formData.submit;
             delete formData._sand_step;
             url = url + decodeURIComponent($.param(formData));
             window.location.href = url;
             return {success: true, stop_propagation: true};
             },
             */
            /*
             * Normally params is undefined.
             * It only is present in case of xform
             */
            prepare_form_data: function ($el, data, params) {
                //save those RTE editors first
                if (typeof tinyMCE != 'undefined'
                    && typeof tinyMCE.EditorManager != 'undefined'
                    && typeof tinyMCE.EditorManager.triggerSave === 'function') {
                    tinyMCE.EditorManager.triggerSave();
                }

                if (typeof CKEDITOR != 'undefined' && typeof CKEDITOR.instances === 'object') {
                    for (instance in CKEDITOR.instances)
                        CKEDITOR.instances[instance].updateElement();
                }

                var ret;

                if (typeof params != 'undefined' && params.length > 0) {
                    var $div = $(params[0]);
                    var keys;
                    if (typeof params[1] != 'undefined')
                        keys = params[1];
                    ret = Sand.form.get_xform_data($div, keys);
                } else {
                    ret = Sand.form.get_xform_data($el);
                }

                return {
                    success: true,
                    result: ret
                };
            },

            /*
             * params[0] should be the divWrapper selector.
             * params[1] should be the key ('items') to send  {items : list of sorted items here}
             * defaulted to items_order
             * params[2] are the array of extra keys to get from $(divWrapper > li.sortable-item)
             *  and send along as an ARRAY of objects
             * If params[2] not defined, send the id (data-item-id) of the .li by default as an ORDINARY ARRAY
             * [id1,id2,...]
             */
            /*
             prepare_sorted_items : function($form, json, params)
             {
             var targetDiv = params[0];
             var $target = $(targetDiv);
             var key = params[1] ? params[1] : 'items_order';

             var sorted, keys;
             if (typeof params != 'undefined' && params.length > 2)
             {
             keys = params[2];
             }
             sorted = Sand.form.get_sorted_items($target, keys);

             var ret = [];
             ret[key] = sorted;
             return  {success : true, result : ret};
             },
             */
            set_html: function ($el, json, params) {
                Sand.set_html(params[0], params[1]);
                return {success: true};
            },

            append_html: function ($el, json, params) {
                //append json.widgets.content to $(params[0]);
                if (json.success) {
                    var widgets = json.widgets || {};
                    if (typeof widgets.content != 'undefined' && widgets.content) {
                        $(params[0]).append(widgets.content);
                        Sand.form.bind_plugins($el);
                    }

                }

                if (json.success) {
                }
                return {success: true};
            },

            //#params[0] should be the selector of the current li.sortable-item
            append_html_to_sortable: function ($el, json, params) {
                //append json.content to $(params[0]);
                if (json.success) {
                    var widgets = json.widgets || {};
                    if (typeof widgets.content != 'undefined' && widgets.content) {
                        var content = widgets.content;
                        var $li = $(params[0]); //could be any thing
                        var depth = $li.data('sortable-depth');
                        var pos = params[1] || 'last';
                        if (pos == 'last') {
                            var $last;
                            if ($li.next('.sortable-item').size() > 0) {
                                $last = $li.nextUntil("[data-sortable-depth=" + depth + "]").last();
                                if ($last.size() == 0)
                                    $last = $li;
                            }
                            else
                                $last = $li;
                            $last.after(content);
                            Sand.form.bind_plugins($last.next(".sortable-item"));
                        }
                        else if (pos == 'first') {
                            //TODO: Potential bug here if after LI.sortable-item there is some hidden non-.sortable-li LI
                            //as a widget place holder
                            $li.after(content);
                            Sand.form.bind_plugins($li.next(".sortable-item"));
                        }
                    }
                }
                return {success: true};

            },

            close_modal: function ($el, json, params) {
                if ((typeof params != 'undefined' && params[0] ) ||
                    (typeof json.success != 'undefined' && json.success)
                ) {
                    $el.closest('.modal').modal('hide');
                    return {success: true};
                }
            },

            load_widget_ajax: function ($el, json, params) {
                Sand.ajax.handle_request($(params[0]));
            },

            populate_html_from_template: function ($el, json, params) {

            },

            generate_html_from_mustache: function ($el, json, params) {
                var template = $el.data('template');

                if (!template || template.indexOf('|') == -1)
                    return {'success': true, 'result': json};

                Sand.load_templates([
                        template,
                    ], function () {
                        var html = Sand.template.render(
                            Sand.get_template(template),
                            json);
                        json.widgets = json.widgets || {};
                        json.widgets.content = html;
                        if (typeof json.widgets.title == 'undefined')
                            json.widgets.title = $el.attr('title');
                    }
                );

                return {'success': true, 'result': json};
            },

            as_login_core : function($el, json, params)
            {
                //store auth token to localStorage
                if (json.success && json.result && json.result.token)
                {
                    Sand.localStorage.setItem('uid', json.result.id);
                    Sand.localStorage.setItem('uiid', json.result.iid);
                    Sand.localStorage.setItem('token', json.result.token);
                }

                return {'success': true, 'result': json};
            }
        }
    );
});
