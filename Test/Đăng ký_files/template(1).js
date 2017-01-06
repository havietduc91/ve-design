$(document).ready(function () {
    Sand.initial_templates = Sand.initial_templates || [];
    //either you can pass
    // 'module|tpl' or [mod, tpl]
    Sand.get_template = function (module, tpl) {
        var template = typeof tpl == 'undefined' ? module : module + '|' + tpl;
        Sand.templates = Sand.templates || {};
        return Sand.templates[template];
    };

    Sand.templates_to_load = function (mod, arr) {
        var tplsToLoad = [];
        for (var i in arr) {
            tplsToLoad.push(mod + '|' + arr[i]);
        }
        return tplsToLoad;
    };

    //templates = ['vocabset.tpl1']
    Sand.load_templates = function (templates, cb, ignoreCache) {
        var toLoad = [];
        ignoreCache = !!ignoreCache;
        Sand.templates = Sand.templates || [];
        for (var i in templates) {
            var tpl = templates[i];
            if (!Sand.get_template(tpl) || ignoreCache)
                toLoad.push(tpl);
            else {
                Sand.utils.log(tpl, " is already cached");
            }
        }
        if (toLoad.length > 0) {
            Sand.ajax.ajax_request({
                url: "/sitex/index/tpl",
                data: {
                    _sand_modal_ajax: 1,
                    tpl: toLoad
                },
                success: function (json) {
                    if (json.widgets) {
                        //cache the templates
                        for (var j in json.widgets) {
                            Sand.templates[j] = json.widgets[j];
                        }
                        cb(json.widgets);
                    }
                }
            });
        }
        else {
            cb();
        }
    }

    Sand.load_initial_templates = function (cb) {
        if (Sand.initial_templates.length > 0) {
            //download initial templates...
            Sand.load_templates(Sand.initial_templates, cb);
        }
        else
            cb();
    }
});