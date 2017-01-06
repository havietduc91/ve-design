$(document).ready(function () {
    Sand['callbacks'] = $.extend(
        Sand['callbacks'],
        {
            spent_success_cb: function ($form, json, params) {
                User.change_token_balance(-1 * json.token.money, -1 * json.token.vmoney);
            },
            recharge_success_cb: function ($form, json, params) {
                if (json.success) {
                    $wrapper = $form.closest('div.gateway-wrapper');
                    //$form.hide();
                    $wrapper.find("div.recharge_success").show();

                    $wrapper.find("span.new_tokens").html(json.token);
                    User.change_token_balance(json.result, 0);
                    //Sand.alert.alert_success("Bạn đã nạp thành công " + json.result + " tokens");
                }
            },
            pay_not_enough_tokens: function ($a, data, params) {
                Sand.ajax.ajax_request({
                    url: '/user/pay?step=1&_sand_modal_ajax=1&alert=1',
                    success: function (data) {
                        $("#ajaxModal div.modal-body").html(data.result.content);
                        $("#ajaxModal form.cl_ajax").ajaxForm(form_ajax_options);
                        $('#ajaxModal').modal();
                    }
                });
            },
            unlocked_callbacks: function ($a, data, params) {
                if (data.success == false) {
                    if (data.err_code == 'MONEY_NOT_ENOUGH') {
                        $('#alert-warning').show();
                    } else {//other reasons
                        //do something
                    }
                } else {
                    $('#alert-success').show();
                }
            }

        }
    );
});