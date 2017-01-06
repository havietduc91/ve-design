$(function () {
    // only active if user is not logged in
    if (Sand.utils.is_guest()) {
        //====================================Login box =============================
        $(document).on('click', "#show_signup", function (e) {
            e.preventDefault();
            $("#login-help,#login_form, #show_signup_wrapper").hide();
            $("#register-help, #signup_form,#show_login_wrapper").show();
            $("#signup_form").find("input[type='text']:first").focus();
            $("#show_signup").addClass('active');
            $("#show_login").removeClass('active');
        });

        $(document).on('click', "#show_login", function (e) {
            e.preventDefault();
            $("#login-help,#login_form, #show_signup_wrapper").show();
            $("#register-help, #signup_form,#show_login_wrapper").hide();
            $("#show_signup").removeClass('active');
            $("#show_login").addClass('active');
            $("#login_form").find("input[type='text']:first").focus();
        });
        //===========================================+End login box==================================
    }
});