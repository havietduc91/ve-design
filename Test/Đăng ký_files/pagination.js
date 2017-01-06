$(document).ready(function () {
    //common pagination trigger
    $("html").on('click', ".pagination a", function () {
        //All search form by default has id = '#search_form'. See Cl_Form_Search
        var $ul = $(this).closest('.pagination');
        var targetSelector = $ul.attr('data-target-form-selector') ? $ul.attr('data-target-form-selector') : '#search_form';
        var $el = $(targetSelector);
        //alert(formSelector);
        var page = $(this).attr('data-page') || $(this).attr('page');
        page = $.trim(page);

        //trigger the submit
        if ($el.prop('tagName') == 'FORM')
        {
            $el.find("[name='page']").val(page);
            $el.find("[name='submit']").trigger('click');
        }
        else
        {
            $el.data('page', page);
            $el.attr('href', $el.attr('href') + '&page=' + page);
            $el.trigger('click');
        }
    });

    $("html").on('change', ".pagination-per-page [name='items_per_page']", function () {
        //All search form by default has id = '#search_form'. See Cl_Form_Search
        var $ul = $(this).closest('.pagination-per-page');
        var targetSelector = $ul.attr('data-target-form-selector') ? $ul.attr('data-target-form-selector') : '#search_form';
        var $el = $(targetSelector);
        //alert(formSelector);
        var items_per_page = $(this).val();

        //trigger the submit
        if ($el.prop('tagName') == 'FORM')
        {
            $el.find("[name='items_per_page']").val(items_per_page);
            $el.find("[name='submit']").trigger('click');
        }
        else
        {
            $el.data('items_per_page', items_per_page);
            $el.attr('href', $el.attr('href') + '&items_per_page=' + items_per_page);
            $el.trigger('click');
        }
    });

    $(document).on('change', "form[data-form-type='search'] :input", function () {
        $(this).closest('form').find("[name='page']").val(1);
    });
});