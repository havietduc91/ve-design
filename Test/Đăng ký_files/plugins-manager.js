Sand.plugins_man = {
    //return list of scripts, css, pluginInits,
    // plugin Name , a string
    load_plugin: function (p) {
        Sand.utils.log("---------------load_plugin: " + p + " -------------------");
        var ret = {
            js: [],
            css: [],
            pluginInits: []
        };

        var pConfig = Sand.plugins[p] || {};

        if (Sand.plugins.preloaded.indexOf(p) == -1) {
            if (typeof pConfig.dependencies != 'undefined') {
                for (i in pConfig.dependencies) {
                    v = pConfig.dependencies[i];
                    ret = Sand.plugins_man.merge_plugin_resources(
                        ret, Sand.plugins_man.load_plugin(v))
                }
            }
            if (pConfig.css) {
                for (i in pConfig.css) {
                    ret.css.push(pConfig.css[i]);
                }
            }

            if (pConfig.js_dev && Sand.configs.APPLICATION_ENV.indexOf('development') != -1) {
                for (i in pConfig.js_dev) {
                    ret.js.push(pConfig.js_dev[i]);
                }
            }
            else if (pConfig.js) {
                for (i in pConfig.js) {
                    ret.js.push(pConfig.js[i]);
                }
            }
            //dev
        }

        if (pConfig.init) {
            Sand.utils.log("load_plugin: will init plugin: ", p);
            ret.pluginInits.push(p);
        }
        Sand.plugins.preloaded.push(p);
        return ret;
    },
    merge_plugin_resources: function (ret, ret2) {
        for (j in ret2) {
            ret[j] = ret[j].concat(ret2[j]);
        }
        return ret;
    },
    //callbacks is an array
    filter_plugins: function (callbacks) {
        Sand.utils.log('------------filter_plugins-----------------');
        Sand.utils.log(callbacks);

        var ret = {
            js: [],//array of scripts to load
            css: [], //css to load
            pluginInits: [], //list of plugins which need to be init'ed
            callbacks: [], //normal callbacks.
        };
        var p, cb;
        for (i in callbacks) {
            cb = callbacks[i];

            if (cb['callback'] == 'init_plugin') {
                p = cb['params'];//plugin name
                if (typeof p == 'string') {
                    var tmp = Sand.plugins_man.load_plugin(p);
                    ret = Sand.plugins_man.merge_plugin_resources(ret, tmp);
                }
                else {
                    for (j in p) {
                        Sand.utils.log("*******");
                        Sand.utils.log(typeof p[j]);
                        if (typeof p[j] == 'string') {
                            var tmp = Sand.plugins_man.load_plugin(p[j]);
                            ret = Sand.plugins_man.merge_plugin_resources(ret, tmp);
                        }
                        else if (typeof p[j] == 'object') {
                            for (k in p[j]) {
                                if (typeof p[j][k] == 'string')
                                    var tmp = Sand.plugins_man.load_plugin(p[j][k]);
                                ret = Sand.plugins_man.merge_plugin_resources(ret, tmp);
                            }
                        }
                    }
                }
            }
            else if (cb['callback'] == 'load_script') {
                for (j in cb['params']) {
                    if (Sand.callbacks_man.loaded_scripts.indexOf(cb['params'][j]) === -1) {
                        ret.js.push(cb['params'][j]);
                    }
                }
            }
            else {
                ret.callbacks.push(cb);
            }
        }
        return ret;
    },

};