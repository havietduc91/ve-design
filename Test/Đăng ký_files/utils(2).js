$(document).ready(function () {
    CourseViewer = $.extend(CourseViewer, {
        convertStringToSecond: function (str) {
            var time = 0;
            if (typeof str !== 'undefined') {
                var agr = str.split(":");
                time += parseInt(agr[0]) * 60;
                time += parseInt(agr[1]);
            }
            return time;
        },
    });
});