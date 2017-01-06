/**
 Core callbacks to implement
 */
$(document).ready(function () {
    Sand['callbacks'] = $.extend(
        Sand['callbacks'],
        {
            mainstage_category_submitted: function ($form, json, params) {
                var t = $form.find("[name='type']").val();
                var dmn = $form.find("[name='dmn']").val();
                var href = "/category/index/search?dmn=" + dmn + "&type=" + t;
                if ($("[data-sand-widget='#mainstage'][href='" + href + "']").size() > 0) {
                    $("[data-sand-widget='#mainstage'][href='" + href + "']").trigger('click');
                }

            },

            mainstage_category_modal_submitted: function ($form, json, params) {
                if (json.success) {
                    $("#sand-modal-close").trigger('click');
                }
            }
        })
});
