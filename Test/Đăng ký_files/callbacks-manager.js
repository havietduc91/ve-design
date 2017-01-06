$(document).ready(function () {
    Sand.callbacks_man = {
        loaded_scripts: [],
        loaded_css: [],
        load_css: function (href) {
            if (Sand.callbacks_man.loaded_css.indexOf(href) == -1) {
                var cssLink = $("<link rel='stylesheet' type='text/css' href='" + href + "'>");
                $("head").append(cssLink);
                Sand.callbacks_man.loaded_css.push(href);
            }

        },
        is_widget: function ($el) {
            if ($el.data('sand-modal') || $el.data('sand-widget'))
                return true;
            if ($el.hasClass('sand-ajax-widget')) //TODO: completely remove this
                return true;
            return false;
        },
        addAsCallback: function ($form, callbackString) {
            var cb = $form.attr('data-sand-as') || '';
            cb = cb + '|' + callbackString;
            $form.attr('data-sand-as', cb);
            return {success: true};
        },
        //turn all the callbacks of the form cb('abc')
        //into {callback : cb, params : ['abc']};
        //or init_plugin('helloworld') into {callback : 'init_plugin', params : 'helloworld'}
        normalize_callbacks_into_array: function (callbacks) {
            var ret = [];
            var cb, tmp, cback, params;
            for (i in callbacks) {
                //TODO: If first callback is load_script, we'll have to wait until the script
                // is loaded
                cb = callbacks[i];
                if (typeof cb == 'string') {
                    cb = $.trim(cb);
                    if (cb == '') {
                        continue;
                    }
                    tmp = Sand.callbacks_man.parse_params(cb);
                    cback = tmp.callback;
                    params = tmp.params || undefined;
                    ret.push({callback: cback, params: params});
                }
                else {
                    ret.push(cb);
                }
            }
            return ret;
        },
        combine_scripts: function (arr, t) {
            arr = Sand.array.remove_dupes(arr);
            var ret = "/sand-combine?";

            for (j in arr) {
                var tmp = arr[j];
                if (tmp.indexOf(Sand.configs.SAND_ASSETS_CDN) == 0) {
                    ret = ret + "core_urls[]=" + tmp.replace(Sand.configs.SAND_ASSETS_CDN, '') + "&";
                }
                else if (tmp.indexOf(Sand.configs.ASSETS_CDN) == 0) {
                    ret = ret + "urls[]=" + tmp.replace(Sand.configs.ASSETS_CDN, '') + "&";
                }
            }
            return ret + "type=" + t;
        },
        /**
         * Executing callbacks in a chain.
         * Chain breaks when a callback return false;
         * result as in the {success : true, result : result}
         */
        chain_callbacks: function (result, callbacks, $el, json) {
            var i, tmp, cb;
            result = result || {};
            var ret = {
                success: true,
                result: result
            };
            if (!callbacks || callbacks == '')
                return ret;

            //Sand.utils.log("before normalize_callbacks_into_array", callbacks);
            var cbs = Sand.callbacks_man.normalize_callbacks_into_array(callbacks);
            //Sand.utils.log("after normalize_callbacks_into_array", cbs);
            Sand.utils.log($el);
            cbs = Sand.plugins_man.filter_plugins(cbs);


            //now cbs has list of normal callbacks, scripts to load and init Plugins
            //Sand.utils.log("chain_callbacks: ");
            //Sand.utils.log(callbacks);
            Sand.utils.log("-------------executing the callbacks--------------------");
            Sand.utils.log(cbs);

            //TODO: load css
            if (cbs.css && cbs.css.length > 0) {
                var combined = Sand.callbacks_man.combine_scripts(cbs.css, 'css');
                Sand.callbacks_man.load_css(combined);
            }
            if (cbs.js && cbs.js.length > 0) {
                var combined = Sand.callbacks_man.combine_scripts(cbs.js, 'js');

                Sand.utils.log("...................................................");
                Sand.utils.log("............Loading the combined script now........");
                Sand.utils.log("...................................................");
                Sand.utils.log(combined);
                Sand.utils.log("...................................................");
                $.ajax({
                    url: combined,
                    dataType: "script",
                    async: false,
                    success: function () {
                        Sand.callbacks_man.loaded_scripts =
                            Sand.callbacks_man.loaded_scripts.concat(cbs.js);

                        //Init the plugins
                        if (cbs.pluginInits && cbs.pluginInits.length > 0) {
                            for (k in cbs.pluginInits) {
                                var p = cbs.pluginInits[k];
                                //Now init the plugin
                                Sand.utils.log("pushing plugin init");
                                Sand.utils.log({callback: 'init_plugin_' + p.replaceAll('-', '_')});
                                cbs.callbacks.push({callback: 'init_plugin_' + p.replaceAll('-', '_')});
                            }
                        }
                        Sand.utils.log("combined script loaded. Now executing the normal callbacks");
                        Sand.utils.log(cbs);
                        ret = Sand.callbacks_man.execute_callback_chain(ret.result, cbs.callbacks, $el, json);
                    }
                });
            }
            else {
                //Init the plugins
                if (cbs.pluginInits && cbs.pluginInits.length > 0) {
                    for (k in cbs.pluginInits) {
                        var p = cbs.pluginInits[k];
                        //Now init the plugin
                        Sand.utils.log("pushing plugin init");
                        Sand.utils.log({callback: 'init_plugin_' + p.replaceAll('-', '_')});
                        cbs.callbacks.push({callback: 'init_plugin_' + p.replaceAll('-', '_')});
                    }
                }
                ret = Sand.callbacks_man.execute_callback_chain(ret.result, cbs.callbacks, $el, json);
            }
            //Now execute the plugins loaded
            return ret;
        },
        execute_callback_chain: function (result, callbacks, $el, json) {
            result = result || {};
            var ret = {
                success: true,
                result: result
            };
            var cback;
            for (i in callbacks) {
                cback = callbacks[i]['callback'];
                params = callbacks[i]['params'];
                //Sand.utils.log("Executing..." , cback);
                tmp = Sand.callbacks_man.execute_callback(cback, $el, json, params);

                if (tmp !== undefined) {
                    if (tmp.stop_propagation)
                        return tmp;
                    if (tmp.success === false) {
                        var msg = "Error for callback " + callbacks[i];
                        if (tmp.message) {
                            msg = msg + " : " + tmp.message;
                        }
                        Sand.utils.log(msg);
                        return tmp; //returns immediately
                    }
                    else {
                        if (tmp.result)
                            $.extend(true, ret.result, tmp.result);
                        if (tmp.objects)
                        {
                            ret.objects = ret.objects || {};
                            $.extend(true, ret.objects, tmp.objects);
                        }

                    }
                }
            }
            return ret;
        },
        /**
         * cb: callback function's name, such as "hide_me"
         * $el : $a or $form;
         * json : data returned from server...
         * TODO: if
         */
        parse_params: function (cb) {
            if (cb.indexOf("javascript:") == 0) {
                var params = cb.split('javascript:');
                return {callback: 'javascript', params: params[1]};
            }
            else {
                var params = cb.split('(');
                if (params.length > 1) {
                    params = cb.split('(');
                    if (params.length > 1) {
                        cb = $.trim(params[0]);
                        params.shift();

                        params = params.join('(');
                        //remove the last ')'
                        params = params.substring(0, params.length - 1);
                        if (params.length == 0)
                            params = undefined;
                    }
                    else
                        params = undefined;
                }
                else
                    params = undefined;

                if (params != undefined && params != '') {
                    //always string
                    params = '[' + params + ']';
                    params = eval(params);
                }
                var ret = {callback: cb};
                if (typeof params != 'undefined')
                    ret.params = params;
                return ret;
            }
        },
        // cb : function name, params
        execute_callback: function (cb, $el, json, params) {
            Sand.utils.log("execute_callback: " + cb);
            //params = Sand.callbacks_man.parse_params(params);
            if (cb.indexOf('.') != -1) {
                //cb is something like "Test.somecallback"
                var tmp = cb.split('.');
                if (typeof window[tmp[0]] != 'undefined' &&
                    typeof window[tmp[0]][tmp[1]] == 'function') {
                    return window[tmp[0]][tmp[1]]($el, json, params);
                }
            }
            else if (typeof Sand['callbacks'][cb] != 'undefined') {
                return Sand['callbacks'][cb]($el, json, params);
            }
            else if (typeof Sand['globals'][cb] != 'undefined') {
                return Sand['globals'][cb]($el, json, params);
            }

            //TODO eval();
            Sand.utils.log('invalid_callback: ' + cb + ' (not in Sand.callbacks, not in Sand.globals)');
            //console.log(params);
            return {success: true};

        },
        get_callbacks_from_attribute: function ($el, attrName) {
            var callbacks = [];
            var cb = $el.data(attrName) || '';
            cb = $.trim(cb);
            if (cb !== '')
                callbacks = cb.split('|');
            return callbacks;
        },
        /* $el is either <a> or <form>*/
        get_bs_callbacks: function ($el, is_form) {

            var coreCallbacks = ['disable_clicks'];

            if (!$el.data('sand-fake'))
                coreCallbacks.push('show_loading');

            if ($el.data('sand-confirm'))
                coreCallbacks.push('confirm');
            if ($el.data('sand-login'))
                coreCallbacks.push('check_login');
            if (Sand.callbacks_man.is_widget($el))
                coreCallbacks.push('show_widget_loading');
            if (is_form)
                coreCallbacks.push('validate_form');

            var callbacks = Sand.callbacks_man.get_callbacks_from_attribute($el, 'sand-bs');
            callbacks = coreCallbacks.concat(callbacks);

            if (is_form) {
//                var $form = $el.closest('form');
//                if ($form.data('form-type') != 'search')
                callbacks.unshift('prepare_form_data'); //at the beginning
            }
            return callbacks;
        },
        get_as_core_callbacks: function ($el) {
            var coreCallbacks = ['enable_clicks'];
            if (!$el.data('sand-fake'))
                coreCallbacks.push('hide_loading');

            if ($el.data('only-show-alert')) {
                coreCallbacks.push('display_alert_notification');
            } else if ($el.data('only-highlight-element-form')) {
                coreCallbacks.push('highlight_element_form_error');
            } else if (!$el.data('no-alert')) {
                coreCallbacks.push('display_notification');
            }

            if (Sand.callbacks_man.is_widget($el) && $el.data('sand-modal') != 2)//TODO
                coreCallbacks.push('populate_html_to_widget');

            var href = $el.attr('href') || $el.data('url') || $el.attr('action');
            if (href && href.toLowerCase().indexOf('javascript:') !== 0
                && !$el.data('sand-fake')
                && !$el.data('no-hashbang')
            )
                coreCallbacks.push('goto_hashbang');
            return coreCallbacks;
        },
        //get core callbacks that get executed AFTER the user's callbacks
        get_as_core_callbacks2: function ($el) {
            var coreCallbacks = [];

            if (
                /*$el.data('sand-modal') == 2*/
                $el.data('template')
            ) {
                coreCallbacks.push('generate_html_from_mustache');
                coreCallbacks.push('populate_html_to_widget');
            }

            return coreCallbacks;
        },

        get_as_core_callbacks_when_propagation_stopped: function ($el) {
            var coreCallbacks = ['enable_clicks'];
            if (!$el.data('sand-fake'))
                coreCallbacks.push('hide_loading');

            if ($el.data('only-show-alert')) {
                coreCallbacks.push('display_alert_notification');
            } else if ($el.data('only-highlight-element-form')) {
                coreCallbacks.push('highlight_element_form_error');
            } else if (!$el.data('no-alert')) {
                coreCallbacks.push('display_notification');
            }

            return coreCallbacks;
        },
        get_as_callbacks: function ($el) {
            var coreCallbacks = Sand.callbacks_man.get_as_core_callbacks($el);

            var callbacks = Sand.callbacks_man.get_callbacks_from_attribute($el, 'sand-as');

            // core callbacks which get executed after element's callback
            var coreCallbacks2 = Sand.callbacks_man.get_as_core_callbacks2($el);

            callbacks = coreCallbacks.concat(callbacks);
            callbacks = callbacks.concat(coreCallbacks2);
            Sand.utils.log(callbacks);
            return callbacks;
        },
        get_callbacks_by_attribute: function ($el, attr) {
            var cb = $el.data(attr);
            cb = $.trim(cb);
            var cbs = '';
            if (cb !== '')
                cbs = cb.split('|');
            return cbs;
        }
    };
});
