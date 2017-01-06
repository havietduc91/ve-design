$(function () {
    var concepts;
    var subject;
    var $conceptSearchInput = $("#concept-search-input");
    subject = Edx.subject || 'eng';
    var originalWidth = $conceptSearchInput.width();
    var blurTimeout = null;
    var clickedOnFilter = false;

    var expand_search_box = function () {
        if ($conceptSearchInput.attr('data-where') == 'top-search-box')
            $conceptSearchInput.animate({width: 400}, 100);

        $conceptSearchInput.typeahead('lookup');
    }
    var collapse_search_box = function () {
        if (!clickedOnFilter) {
            if ($conceptSearchInput.attr('data-where') == 'top-search-box') {
                $("#ddl-div-wrapper").css('visibility', 'hidden');
                $conceptSearchInput.animate({width: originalWidth}, 100);
                $("#user-top-menu > li[id!='concept-search-li']").show(400);
            }
        }
    }
    /*
     //===============hover=============================
     $conceptSearchInput.focus(function()
     {
     if ($conceptSearchInput.attr('data-where') == 'top-search-box')
     {
     $("#user-top-menu > li[id!='concept-search-li']").hide();
     //$("#btn_filter").attr('style',"border-color: #51a7e8;box-shadow: inset 0 0px 5px rgba(0,0,0,0.075),0 0 6px rgba(81,167,232,0.5);outline: none;transition: all .2s linear;");
     $("#ddl-div-wrapper").css('visibility', 'visible');
     }
     expand_search_box();

     }).blur(function()
     {
     //$("#btn_filter").removeAttr('style',"border-color: #51a7e8;box-shadow: inset 0 0px 5px rgba(0,0,0,0.075),0 0 6px rgba(81,167,232,0.5);outline: none;transition: all .2s linear;");
     // $("#ddl-div-wrapper").css('visibility', 'hidden');

     setTimeout( function(){
     blueTimer =  collapse_search_box();
     }, 300); //3 seconds
     });
     //=====================end of hover========================
     */
    $("#btn_filter").attr('data-value', $("#filter_ddl li:first-child a").attr('data-value'));


    //=============Topbox Search Filter============================
    $("#ddl-div-wrapper").click(function () {
        clickedOnFilter = true;
        setTimeout(function () {
            clickedOnFilter = false;
        }, 600);

        $conceptSearchInput.trigger('focus');

    });

    $('#filter_ddl li a').on('click', function () {
        $("#btn_filter").attr('data-value', $(this).attr('data-value'));
        $("#ddl-display").html($(this).html());

        $conceptSearchInput.trigger('focus');
    });
    //============End of Topbox search filter=====================
    firstHeaderTemplate = '<h4 class="sco-title">';
    //TODO: v3 lastHeaderTemplate = '<a href="#">Xem thêm</a></h4>';

    videoTemplate = '<a href="{{link}}"> <div class="image">' +
        '<img src="{{avatar}}"> </div>' +
        '<h4>{{name}}</h4>' +
        '<p>{{vname}}</p></a>';

    courseTemplate = '<a href="{{link}}">' +
        '<h4>{{name}}</h4>' +
        '<p>{{vname}}</p></a>';

    dictTemplate = '<a href="javascript:void(0)" data-sand-modal=1>' +
        '<h4>{{name}}</h4>' +
        '<p>{{vname}}</p></a>';

    $conceptSearchInput.typeahead([
            {
                name: 'dict',
                remote: {
                    url: '/suggest',
                    replace: function (url, query) {
                        return "/suggest?ntype=dictionary&term=" + query +
                            "&typeahead=1&_sand_app_name=" + Sand.configs.WEB_APP_NAME +
                            "&_sand_web_app_id=" + Sand.configs.WEB_APP_ID;
                    },
                    filter: function (data) {
                        return data;
                    }
                },
                selected: function (e, data) {
                    //dictionary not found;
                },
                header: firstHeaderTemplate + '<span>Từ điển Anh-Việt </span>',
                valueKey: 'name',
                template: dictTemplate,
                engine: Hogan

            },
            {
                name: 'course',
                remote: {
                    url: '/suggest',
                    replace: function (url, query) {
                        return "/suggest?ntype=course&term=" + query +
                            "&typeahead=1&_sand_app_name=" + Sand.configs.WEB_APP_NAME +
                            "&_sand_web_app_id=" + Sand.configs.WEB_APP_ID;
                    },
                    filter: function (data) {
                        return data;
                    }
                },
                selected: function (e, data) {
                    //dictionary not found;
                },
                header: firstHeaderTemplate + '<span>Khóa học</span>',
                valueKey: 'name',
                template: courseTemplate,
                engine: Hogan

            },
            {
                name: 'video',
                remote: {
                    url: '/suggest',
                    replace: function (url, query) {
                        return "/suggest?ntype=video&term=" + query +
                            "&typeahead=1&_sand_app_name=" + Sand.configs.WEB_APP_NAME +
                            "&_sand_web_app_id=" + Sand.configs.WEB_APP_ID;
                    },
                    filter: function (data) {
                        return data;
                    }
                },
                selected: function (e, data) {
                    //dictionary not found;
                },
                header: firstHeaderTemplate + '<span>Video bài giảng</span>',
                valueKey: 'name',
                template: videoTemplate,
                engine: Hogan

            }
        ]
    );
    $('.tt-hint').addClass('form-control');

    $(document).on('typeahead:selected', "#concept-search-input", function (e, data) {
        if (data.type == 'dictionary') {
            Sand.ajax.modal_ajax_request(Sand.utils.node_link('concept', data));
        }
    });

    //affix top if it's a normal exercise
    $("#concept-search-input").change(function () {
        var key = $(this).val();
        //good     job => good-job
        key = key.trim();
        key = key.replace(/\s{1,}/g, '-');
        $('.form_search').attr('action', Sand.configs.SEARCH_URL + key + '.html');
    });
});