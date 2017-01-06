/**
 * - Contains common stuff.
 * - Fix Zend Form Element quirks and stuff
 *
 */
var populate_dynamic_array;

$(document).ready(function () {

    $.fn.moveTo = function ($selector) {
        return this.each(function () {
            var cl = $(this).clone();
            $(cl).appendTo($selector);
            $(this).remove();
        });
    };

    if (typeof $.fn.popover != 'undefined') {
        /** Trigger initial callbacks for twitter bootstrap */
        $('.ispopover').popover({
            placement: "top",
            trigger: 'hover'
        });
    }

    $(document).on('click', 'table input.checkall', function () {
        var $table = $(this).closest('table');
        $table.find('tbody tr').each(function (i, j) {
            //check value checkbox
            var $checkbox = $(this).find('td input.check-item');
            if ($checkbox.is(':checked')) {
                $checkbox.prop('checked', false);
            } else {
                $checkbox.prop('checked', true);
            }
        });
    });

    //we have window.title = (1) Viewing course xyz"
    //where 1 is the number of notifications. When we have clicked on the notif symbol
    //we should change title to "View course xyz" only

    $("html").on('click', ".toggle-dom", function (e) {
        var t;
        if ($(this).data('target'))
            t = $(this).data('target');
        else if ($(this).data('target-id') || $(this).attr('target-id')) {
            t = $(this).data('target-id') || $(this).attr('target-id');
            t = '#' + t;
        }

        if ($(this).attr('data-toggle-into') == 'modal') {
            //toogle DOM into a dialog
            $("#ajaxModal").find('.modal-title').html($(this).text());
            $("#ajaxModal").find('.modal-body').html($(t).html());
            $("#ajaxModal").modal('show');
        }
        else {
            $(t).toggle();
        }

        e.preventDefault();
        return false;
    });
});
