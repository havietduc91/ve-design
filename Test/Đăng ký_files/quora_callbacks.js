$(document).ready(function () {

    Sand['callbacks'] = $.extend(
        Sand['callbacks'],
        {
            quora_index_loaded: function ($div, data) {
                Sand.utils.init_timeago();
                $(".title-popover").each(function (e) {
                    $quora_row_closest = $(this).closest('.quora-row');
                    var content = $quora_row_closest.find('.content-popover').html();
                    var o = {
                        content: content,
                        placement: 'bottom',
                        html: true,
                        trigger: 'hover',
                    };
                    $(this).popover('destroy').popover(o);
                });
            }
        }
    );
});    
