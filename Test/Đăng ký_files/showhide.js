/** Core callbacks related to show/hide/remove elements*/
$(document).ready(function () {
    Sand.callbacks = $.extend(
        Sand.callbacks,
        {
            //params will be the selector
            hide_element: function ($el, json, params) {
                $(params[0]).hide();
            },
            //params will be the selector
            show_element: function ($el, json, params) {
                $(params[0]).show();
            },
            //params will be the selector
            remove_element: function ($el, json, params) {
                $(params[0]).remove();
            },
            //params will be the selector
            toggle_element: function ($el, json, params) {
                $(params[0]).toggle();
            },
            //collapse all elements 
            collapse_all: function ($el, json, params) {
                $(params[0]).hide();
            },
            //expand all elements
            expand_all: function ($el, json, params) {
                $(params[0]).show();
            },
            hide_me: function ($el, json, params) {
                $el.hide();
            },
            show_me: function ($el, json, params) {
                $el.show();
            },
            remove_me: function ($el, json, params) {
                $el.remove();
            },

            show_next: function ($el, json, params) {
                $el.next().show();
            },
            hide_next: function ($el, json, params) {
                $el.next().hide();
            },
            toggle_next: function ($el, json, params) {
                $el.next().toggle();
            },
            remove_next: function ($el, json, params) {
                $el.prev().remove();
            },

            show_prev: function ($el, json, params) {
                $el.prev().show();
            },
            hide_prev: function ($el, json, params) {
                $el.prev().hide();
            },
            toggle_prev: function ($el, json, params) {
                $el.prev().toggle();
            },
            remove_prev: function ($el, json, params) {
                $el.prev().remove();
            },

            show_prev_uncle: function ($element, json, params) {
                var $el = Sand.utils.get_ancestor($element, params);
                $el.prev().show();
            },
            hide_prev_uncle: function ($element, json, params) {
                var $el = Sand.utils.get_ancestor($element, params);

                $el.prev().hide();
            },
            remove_prev_uncle: function ($element, json, params) {
                var $el = Sand.utils.get_ancestor($element, params);

                $el.prev().remove();
            },

            show_next_uncle: function ($element, json, params) {
                var $el = Sand.utils.get_ancestor($element, params);
                $el.next().show();
            },
            hide_next_uncle: function ($element, json, params) {
                var $el = Sand.utils.get_ancestor($element, params);
                $el.next().hide();
            },
            remove_next_uncle: function ($element, json, params) {
                var $el = Sand.utils.get_ancestor($element, params);
                $el.next().remove();
            },


            hide_my_parent: function ($element, json, params) {
                var $el = Sand.utils.get_ancestor($element, params);
                $el.hide();
                return {success: true};
            },
            remove_my_parent: function ($element, json, params) {
                if ((typeof json != 'undefined' && json.success) || (typeof json == 'undefined' && typeof params != 'undefined')) {
                    var $el = Sand.utils.get_ancestor($element, params);
                    $el.remove();
                    return {success: true};
                }
            },

            show_my_parent: function ($element, json, params) {
                var $el = Sand.utils.get_ancestor($element, params);
                $el.show();
                return {success: true};
            },
        });
});        
