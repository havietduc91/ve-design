$(document).ready(function(){
    Sand.init = function () {
        if (Sand.configs.autoload_plugins) {
            setTimeout(function () {
                Sand.form.bind_plugins($('body'));
            }, 10);
        }

        if (Sand.trigger_snippet)
            Sand.init_trigger_snippet();

        $(".sand-ajax-widget").each(function () {

            //if it specifies data-autoload=0, don't request
            if ($(this).data('autoload') !== 0 && $(this).data('autoload') !== '0'
                && $(this).data('autoload') !== false && $(this).data('autoload') !== 'false'
            ) {
                Sand.ajax.handle_request($(this));
            }
        });
    };

    Sand.init_trigger_snippet = function()
    {
        var hash = window.location.hash;
        if (hash && hash.indexOf('#!') === 0) {
            hash = hash.substring(2);
            var sel = '[data-sand-widget][href="' + hash + '"]:eq(0)';
            if ($(sel).size() > 0)
                $(sel).trigger('click');
            else if ($(".sand-widget-trigger").size() == 1) {
                $(".sand-widget-trigger").trigger('click');
            }

            /*
             else
             {
             var id = 'sand-fake-sandjax';

             if ($('#' + id).size() == 0)
             {
             var a = '<a id="' + id + '" href="' + hash + '" data-sand-widget="#mainstage" style="display:none;">fake click</a>';
             $('body').append($(a));
             }
             $('#' + id).trigger('click');
             }
             */
        }
        else if ($(".sand-widget-trigger").size() == 1) {
            $(".sand-widget-trigger").trigger('click');
        }
    }

});