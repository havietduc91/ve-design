$(document).ready(function () {
    CourseViewer = $.extend(CourseViewer, {
        hide: function (blockName) {
            var blocks = ['vocabset', 'exercise'];
            if (blocks.indexOf(block) !== -1)
                $("#" + block).hide();
        }
    });
});