$(document).ready(function () {
    $(document).on("click", ".fix-iid-submit", function (e) {
        e.preventDefault();
        var exThis = $(this);
        var exParent = exThis.closest('.fdi-li1');
        var trParent = exThis.closest('.fdi-ul1');
        var item = exParent.find('.fix-iid-item');
        var para = {};
        para.iid = item.attr('data-iid');
        para.id = item.attr('data-id');
        para.ntype = item.attr('data-ntype');
        para.parent = [];
        $.each(exParent.find('input'), function (i, e) {
            if (this.checked) {
                para.parent.push({
                    id: $(this).attr('data-id'),
                    ntype: $(this).attr('data-ntype')
                });
            }
        });
        Sand.ajax.ajax_request({
            url: '/site/data/fix-duplicate-iids',
            type: 'POST',
            data: {data: para},
            beforeSend: function () {
                trParent.css({'pointer-events': 'none'});
            },
            dataType: 'json',
            success: function (e) {
                if (e.success) {
                    exParent.remove();
                    $.each(e.parent, function (i, parentId) {
                        trParent.find('li[data-parent="' + parentId + '"]').remove();
                        if (trParent.find('.fid-snippet').length == 0) {
                            trParent.closest('tr').remove();
                        }
                    });
                }
                trParent.css({'pointer-events': 'auto'});
            }
        })
    });

    $(document).on("click", ".fix-iid-get-info-parent", function (e) {
        $('#fdi-parent-display').html('');
        var exThis = $(this);
        var parent = exThis.closest('.fdi-li2');
        var html = parent.find('.display-parent-by-iid').html();
        $('#fdi-parent-display').html('<div class="tree-content">' + html + '</div>');
    });

    $(document).on('click', ".fix-iid-show-one", function (e) {
        $('#fix-duplicate-iid').find('tr').hide();
        var iid = $('#fix-iid-search').val();
        $('#fix-duplicate-iid').find('tr[data-fix-iid="' + iid + '"]').show();
    });

    $(document).on("click", ".fix-iid-show-all", function (e) {
        $('#fix-duplicate-iid').find('tr').show();
    });

    $(document).on("click", ".fix-iid-hidden-row", function (e) {
        $(this).closest('tr').hide();
    });
});