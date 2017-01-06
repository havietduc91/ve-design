$(document).ready(function () {
    Sand.ajax = Sand.ajax || {};
    Sand.ajax.cache = [];
    Sand.ajax.handle_request = function ($el, event) {
        Sand.utils.log("Sand.ajax.handle_request:", $el.attr('href'));
        //var $el = $(this);
        var is_form = false;

        if ($el.attr('type') == 'submit') {
            $el = $el.closest('form');
            is_form = true;
        }

        if ($el.hasClass('disabled')) {
            //User clicked twice on this.
            //TODO: add please wait, we're still working.....
            return false;
        }

        var bs_callbacks, as_callbacks;

        bs_callbacks = Sand.callbacks_man.get_bs_callbacks($el, is_form);
        as_callbacks = Sand.callbacks_man.get_as_callbacks($el, is_form);

        //now execute these callbacks
        Sand.utils.log("BS");
        var ret = Sand.callbacks_man.chain_callbacks({}, bs_callbacks, $el);

        if (ret.stop_propagation) {
            Sand.callbacks_man.chain_callbacks({},
                Sand.callbacks_man.get_as_core_callbacks_when_propagation_stopped($el),
                $el, {success: false}
            );
        }
        else if (!ret.success ||
            $el.hasClass('sand-fake') ||
            $el.data('sand-fake') ||
            ($el.attr('href') && $el.attr('href').toLowerCase().indexOf('javascript:') === 0)
        ) {
            Sand.utils.log("Fake AS", as_callbacks);
            Sand.callbacks_man.chain_callbacks({}, as_callbacks, $el, ret);
        }
        else //real ajax request
        {
            var url;
            var method = 'GET';
            if (is_form) {
                method = $el.attr('method') || 'POST';
                url = $el.attr('action') || window.location.href;
            }
            else {
                url = $el.data('url') || $el.attr('href');
            }
            //Now pass the ret along to the request if any
            //If it's an achor, most likely ret.result is empty
            //If it's a form, most likely it will be the extra data
            data = ret.result || {};
            data['_sand_ajax'] = 1;
            if (is_form)
                data['submit'] = 1;
            else if ($el.prop('tagName') == 'SELECT' || $el.prop('tagName') == 'INPUT') //anchor or others
            {
                data[$el.attr('name')] = $el.val();
            }

            if (Sand.callbacks_man.is_widget($el))// load a page into modal
            {
                var $widget = Sand.ajax.get_target_widget($el);
                if ($widget.data('sand-cache')) {
                    var cacheId = $el.attr('data-sand-cache-id') || $el.attr('href');
                    if (cacheId && Sand.ajax.cache[cacheId]) //DO NOT request, returns cache rightaway
                    {
                        json = {success: true, cache_id: cacheId};
                        return Sand.callbacks_man.chain_callbacks({}, as_callbacks, $el, json);
                    }
                }

                data['_sand_modal_ajax'] = $el.attr('data-sand-modal') || 1;
            }

            var options = {
                url: url,
                //dataType: 'json', //always. we love JSON
                method: method,
                data: data,
                success: function (json) {
                    Sand.utils.log("=========REQUESTED. Success and Now AS===========");
                    Sand.callbacks_man.chain_callbacks({}, as_callbacks, $el, json);
                },
                error: function (err) {
                    Sand.utils.log("===========REQUESTED. Errored and Now AS===========");
                    json = {
                        success: false,
                        err: err
                    };
                    Sand.callbacks_man.chain_callbacks({}, as_callbacks, $el, json);
                }
            };
            if (!$el.data('sand-plaintext')) {
                options.dataType = 'json';
            }
            Sand.ajax.ajax_request(options);
        }
    };

    var ajaxable = "a[data-sand], a[data-sand-as], a[data-sand-bs], " +  //normal ajax
        "a[data-sand-widget], " +  //widget ajax
        "a[data-sand-modal], " +   //widget ajax to modal
        "input[data-sand], input[data-sand-as], input[data-sand-bs], input[data-sand-widget], input[data-sand-modal], " +  //checkbox
        "form[data-sand] [name='submit'], " + //ajax form
        "form[data-sand-as] [name='submit'], " +
        "form[data-sand-bs] [name='submit'], " +
        "form[data-sand-widget] [name='submit'], " + //widget form. Results will go to a widget
        "form[data-sand-modal] [name='submit']"; //modal form

    //live event
    $(document).on("click", ajaxable, function (event) {
        Sand.ajax.handle_request($(this), event);
        //by default, prevent default
        if (($(this).is('input') && $(this).attr('name') != 'submit')
            ||
            $(this).data('propagate')
        ) {

        }
        else {
            event.preventDefault();
            return false;
        }
    });


    var ajaxableChange = "select[data-sand], select[data-sand-as], select[data-sand-bs], select[data-sand-widget], select[data-sand-modal]";

    $(document).on("change", ajaxableChange, function (event) {
        Sand.ajax.handle_request($(this), event);
        //DO NOT PREVENT DEFAULT. Otherwise the select will not change at all
    });

    //Initialization moved inside init.js

    Sand.ajax.modal_ajax_request = function (url) {
        if ($("#sand-fake-modal-ajax-link").size() == 0) {
            $("<a data-sand-modal=1 id='sand-fake-modal-ajax-link' href='#'></a>").appendTo('body');
        }
        $("#sand-fake-modal-ajax-link").attr('href', url).trigger('click');
    };

    Sand.ajax.ajax_request = function (options) {
        options.data = options.data || {};
        options.dataType = options.dataType || 'json';
        options.data._sand_ajax = 1;
        options.data._sand_web_app_id = Sand.configs.WEB_APP_ID;
        options.data._sand_app_name = Sand.configs.WEB_APP_NAME;
/*
        if (Sand.localStorage.getItem('uiid'))
            options.data._sand_uiid = Sand.localStorage.getItem('uiid');

        if (Sand.localStorage.getItem('token'))
            options.data._sand_token = Sand.localStorage.getItem('token');

        if (Sand.localStorage.getItem('uid'))
            options.data._sand_uid = Sand.localStorage.getItem('uid');
        
        if (options.url.indexOf('http') === -1)
            options.url = Sand.configs.SITE_URL + options.url;
*/  

        if (Sand.is_system !== 'undefined' && Sand.is_system) {
            options.data._sand_is_system = Sand.is_system;
        }

        $.ajax(options)
    };

    Sand.api_link = function (module, action, params) {
        var version = Sand.api_version || 1;
        var url = "/api/v" + version + "/" + module + "/" + action;

        if (params) {
            url = url + "?" + $.param(params);
        }
        return url;
    }

});
