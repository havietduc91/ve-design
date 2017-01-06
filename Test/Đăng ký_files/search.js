$(document).ready(function ($) {

    //TODO : lam search trong lean
    //Show list mot so tu
    Search =
    {
        type: 'dictionary',
        subject: 'eng',
        typeahead: 1,
        school: 've',
        success: {},
        list: {},
        suggest: function (value, callback) {
            if (value != '') {
                Search.success = {};
                Sand.configs.SITE_URL = 'https://vieted.net/suggest?ntype=dictionary&term=' + value;
                Sand.ajax.ajax_request({
                    url: Sand.configs.SITE_URL,
                    data: {
                        // term : value,
                        // type : Search.type,
                        // typeahead : Contest.typeahead,
                        // school : Search.school,
                        // subject : Search.subject,
                    },
                    success: function (json) {

                        Search.success = json;
                        Search.list = json;
                        callback();
                    },
                });
            }
        },
        displaySugget: function () {
            var html = Sand.template.render(
                Sand.get_template('course', 'search_suggest'),
                {dictionary: Search.list.result});
            $('#search-suggest').html(html);

        },
        // displayDictionary : function(id,name){
        // 	if(name != ''){
        // 		Sand.ajax.ajax_request({
        //                 url : "/dict/en-vn/download.html?_sand_ajax=1&_sand_modal_ajax=1",
        //                 success : function(json)
        //                 {
        //                 },
        //         	});
        // 	}

        // },
        bindAnswerEvents: function () {
            $(document).on("keydown", "#search-page-course", function () {
                Search.suggest($('#search-page-course').val(), function () {
                    Search.displaySugget();
                });
            });
            // $(document).on('click','.view_suggest',function(){
            // 	Search.displayDictionary($(this).attr('iddict'),$(this).attr('name'));
            // });
        },
        get_detail: function (item) {
            var slug = item.data('slug');
            $.each(Search.list, function (e, r) {
                if (r.slug == slug) {
                    Sand.ajax.modal_ajax_request(Sand.utils.node_link('concept', r));
                    return;
                }
            });
        }
    };
    Search.bindAnswerEvents();
    $(document).on('click', '.search-detail-word', function (e) {
        Search.get_detail($(this));
    });

});
