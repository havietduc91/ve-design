$(document).ready(function () {
    Sand.plugins = $.extend(Sand.plugins,
        {
            'tinymce': {
                js: [
                    Sand.configs.SAND_ASSETS_CDN + "/js/bower_components/tinymce/tinymce.min.js",
                    Sand.configs.ASSETS_CDN + "/js/home/tinymce4-init.js",
                ],
                init: 1
            },
            'avatarcrop': {
                js: [
                    Sand.configs.SAND_ASSETS_CDN + "/js/3rdparty/plugins/jcrop/0.9.12/js/jquery.Jcrop.js",
                    Sand.configs.ASSETS_CDN + "/js/home/crop-avatar.js",
                ],
                css: [
                    Sand.configs.SAND_ASSETS_CDN + "/js/3rdparty/plugins/jcrop/0.9.12/css/jquery.Jcrop.css"
                ],
                init: 1
            },
            'exercise-template': {
                js: [
                    Sand.configs.ASSETS_CDN + "/js/home/exercise/exercise-template.js",
                ],
                init: 1
            },
            'courseviewer': {
                //dependencies : ['sortable'],
                js_dev: [
                    Sand.configs.SAND_ASSETS_CDN + "/js/3rdparty/plugins/jquery.autoGrowInput.js",
                    Sand.configs.ASSETS_CDN + "/js/home/test/hints.js",
                    Sand.configs.ASSETS_CDN + "/js/home/test/navigation.js",
                    //Sand.configs.ASSETS_CDN + "/js/home/test/timer.js",
                    Sand.configs.ASSETS_CDN + "/js/home/test/categorized.js",
                    Sand.configs.ASSETS_CDN + "/js/home/test/vocabulary.js",
                    Sand.configs.ASSETS_CDN + "/js/home/test/mc.js",
                    Sand.configs.ASSETS_CDN + "/js/home/test/inline.js",
                    Sand.configs.ASSETS_CDN + "/js/home/test/matching_pairs.js",
                    Sand.configs.ASSETS_CDN + "/js/home/test/open_ended.js",
                    Sand.configs.ASSETS_CDN + "/js/home/test/reorder.js",
                    Sand.configs.ASSETS_CDN + "/js/home/test/utils.js",
                    Sand.configs.ASSETS_CDN + "/js/home/test/test.js",

                    Sand.configs.ASSETS_CDN + "/js/home/syllabus/tree.js",
                    Sand.configs.ASSETS_CDN + "/js/home/course/courseview.js",
                    Sand.configs.ASSETS_CDN + "/js/home/course/init.js",
                    Sand.configs.ASSETS_CDN + "/js/home/course/search.js",
                    Sand.configs.ASSETS_CDN + "/js/home/course/dictation.js",
                ],
                js: [
                    Sand.configs.ASSETS_CDN + "/js/courseview.all.min.js",
                ],
                init: 1
            },
            'question-inline-dragdrop': {
                dependencies: ['jquery-ui', 'draggable', 'droppable'], //droppable includes draggable
                js: [
                    //Sand.configs.ASSETS_CDN + "/js/home/test/reorder.js", //deprecated
                    Sand.configs.ASSETS_CDN + "/js/home/test/inline-dragdrop.js",
                ],
                init: 1
            },
            'question-inline-sortable': {
                dependencies: ['jquery-ui', 'sortable'],
                js: [
                    Sand.configs.ASSETS_CDN + "/js/home/test/inline-sortable.js",
                ],
                init: 1
            },
            'knobify': {
                js: [
                    Sand.configs.SAND_ASSETS_CDN + "/js/3rdparty/jquery-knob/jQuery-Knob-1.2.11/js/jquery.knob.js",
                    Sand.configs.ASSETS_CDN + "/js/home/plugins/knobify.js",
                ],
                init: 1
            },
            'course-staff': {
                js: [
                    Sand.configs.ASSETS_CDN + "/js/home/course/staff.js",
                ],
            },
            'recording': {
                js: [
                    Sand.configs.ASSETS_CDN + "/js/home/recorder/assets/main.js",
                ],
            },
            'play-dictation': {
                js: [
                    Sand.configs.ASSETS_CDN + "/js/home/lesson/play-dictation.js",
                ],
                init: 1
            },
            'edit-dictation': {
                js: [
                    Sand.configs.ASSETS_CDN + "/js/home/exercise/edit-dictation.js",
                ],
                //init : 1
            },
            'phonetic-keyboard': {
                js: [
                    Sand.configs.ASSETS_CDN + "/js/home/en.rp.phonemes.js",
                ],
            },
            'highcharts': {
                js: [
                    Sand.configs.ASSETS_CDN + "/js/vendor/highcharts.js"
                ]
            },
            'chart-tracking': {
                js: [
                    Sand.configs.ASSETS_CDN + "/js/home/chart-tracking.js"
                ],
                init: 1
            },
            'chart_course_progress': {
                js: [
                    Sand.configs.ASSETS_CDN + "/js/home/chart-tracking.js"
                ],
                init: 1
            },
            'vocabset-new': {
                js: [
                    Sand.configs.ASSETS_CDN + "/js/home/vocabset/new.js"
                ]

            },
            'auto_grow_input': {
                js: [
                    Sand.configs.ASSETS_CDN + "/js/home/test/inline.js",
                ],
                init: 1
            }
        });
});
