$(document).ready(function () {
    //user-search-box-hocvl  auto complete.feature-upgrading
    $('#mytabquora1').on('click', 'li', function () {
        $('#mytabquora1').find("li").each(function (e) {
            $(this).removeClass('active');
        });

        $(this).addClass('active');
        $("#mytabquora1 li.ask-new-question").addClass('active');
    });
    $("#users-search-box-hocvl input[type='text']").on('keyup', function (e) {
        $("#search_status").empty();
        var kw = $(this).val();
        var isEmail = ''
        if ($("#isEmail").is(":checked")) {
            isEmail = true;
        }
        Sand.ajax.ajax_request({
            type: "POST",
            url: "/topusersearch",
            data: {
                name: kw,
                isEmail: isEmail
            },
            statusCode: {
                404: function () {
                    $("#search_status").addClass("alert-danger");
                    $("#search_status").html("no response from server");
                    $("#search_status").show();
                },
                500: function () {
                    $("#search_status").addClass("alert-danger");
                    $("#search_status").html("something happend with server");
                    $("#search_status").show();
                }

            },
            error: function () {
                $("#search_status").addClass("alert-danger");
                $("#search_status").html("error while searching");
                $("#search_status").show();
            },
            success: function (data) {
                var templ = $("#user-list-templ").text();
                $.each(data.result, function (i, item) {
                    if (item.avatar == "")
                        data.result[i].avatar = Sand.DEFAULT_AVATAR;
                    data.result[i].counter.karma.total = Math.ceil(data.result[i].counter.karma.total);
                });
                var html = Sand.template.render(templ, data);
                $("#users-list").empty();
                $("#users-list").html(html);
                $("#search_status").addClass("alert-success");
                $("#search_status").html("some result below here");
                $("#search_status").show();
                $("#users-list").siblings('b').html('Total: ' + data['count']);
            }
        });
    });

    if (typeof Sand.HOCVL != 'undefined' && Sand.HOCVL == 1) {
        var uname = getCookie('_sand_uname');
        var uid = getCookie('_sand_uid');
        var uiid = getCookie('_sand_uiid');
        var is_admin = getCookie('_sand_is_admin');

        if (Sand.page == 'quora/index/view' && Sand.posterId == uid) {
            $("#edit-quora-link").show();
        }
        //populate_username();
    }
});

