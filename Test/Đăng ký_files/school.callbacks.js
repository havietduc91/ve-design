$(document).ready(function () {
    Sand['callbacks'] = $.extend(
        Sand['callbacks'],
        {

            assign_teacher_role: function ($a, data, params) {
                if (data.success) {
                }
                else {
                }
            },
            //LINKS
            apply_teacher_success: function ($a, data, params) {
                $("#become-teacher").hide();
                $("#become-teacher-success").show();
            },


        }
    );
});