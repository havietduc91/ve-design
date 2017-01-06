Sand.plugins = {
    'jquery-ui': {
        css: [
            Sand.configs.SAND_ASSETS_CDN + "/js/bower_components/jquery-ui/themes/base/core.css"
        ],
        js: [
//            Sand.configs.SAND_ASSETS_CDN + "/js/bower_components/jquery-ui/jquery-ui.min./mouse.js",
            Sand.configs.SAND_ASSETS_CDN + "/js/jquery.ui.core.widget.mouse.js"
            /*
             Sand.configs.SAND_ASSETS_CDN + "/js/bower_components/jquery-ui/ui/minified/core.min.js",
             Sand.configs.SAND_ASSETS_CDN + "/js/bower_components/jquery-ui/ui/minified/widget.min.js",
             Sand.configs.SAND_ASSETS_CDN + "/js/bower_components/jquery-ui/ui/minified/mouse.min.js",
             */
        ],
    },
    'datepicker': {
        dependencies: ['jquery-ui'],
        css: [
            Sand.configs.SAND_ASSETS_CDN + "/js/bower_components/jquery-ui/themes/ui-lightness/jquery-ui.min.css",
            Sand.configs.SAND_ASSETS_CDN + "/js/bower_components/jquery-ui/themes/ui-lightness/theme.css"
        ],
        js: [
            Sand.configs.SAND_ASSETS_CDN + "/js/bower_components/jquery-ui/ui/datepicker.js",
            Sand.configs.SAND_ASSETS_CDN + "/js/sand/plugins/jquery-datepicker.js",
        ],
        init: 1
    },
    'tinymce': {
        js: [
            Sand.configs.SAND_ASSETS_CDN + "/js/bower_components/tinymce/tinymce.min.js",
            Sand.configs.SAND_ASSETS_CDN + "/js/sand/plugins/tinymce4-init.js",
        ],
        init: 1
    },
    'sortable': {
        dependencies: ['jquery-ui'],
        js: [
            Sand.configs.SAND_ASSETS_CDN + "/js/bower_components/jquery-ui/ui/minified/sortable.min.js",
            Sand.configs.SAND_ASSETS_CDN + "/js/sand/plugins/sortable.js",
            Sand.configs.SAND_ASSETS_CDN + "/js/3rdparty/jquery-ui-touch-punch/jquery.ui.touch-punch.min.js",
        ],
        init: 1
    },
    'draggable': {
        dependencies: ['jquery-ui'],
        js: [
            Sand.configs.SAND_ASSETS_CDN + "/js/bower_components/jquery-ui/ui/minified/draggable.min.js",
            Sand.configs.SAND_ASSETS_CDN + "/js/sand/plugins/draggable.js",
        ],
        init: 1
    },
    'droppable': {
        dependencies: ['jquery-ui'],
        js: [
            Sand.configs.SAND_ASSETS_CDN + "/js/bower_components/jquery-ui/ui/minified/draggable.min.js",
            Sand.configs.SAND_ASSETS_CDN + "/js/bower_components/jquery-ui/ui/minified/droppable.min.js",
            Sand.configs.SAND_ASSETS_CDN + "/js/sand/plugins/droppable.js",
        ],
        init: 1
    },
    'editable': {
        js: [
            Sand.configs.SAND_ASSETS_CDN + "/js/sand/plugins/bootstrap.editable.js",
        ],
    },
    'pagination': {
        js: [
            Sand.configs.SAND_ASSETS_CDN + "/js/sand/plugins/pagination.js",
        ],
    },
    /*
     'category' : {
     js : [
     Sand.configs.SAND_ASSETS_CDN + "/js/sand/plugins/category.js",
     ],
     },
     */
    'token': {
        css: [
            //Sand.configs.SAND_ASSETS_CDN + "/js/3rdparty/plugins/tokeninput/styles/token-input-facebook-v2.css"
            Sand.configs.SAND_ASSETS_CDN + "/js/bower_components/jquery-tokeninput/styles/token-input-facebook.css"
        ],
        js: [
            Sand.configs.SAND_ASSETS_CDN + "/js/bower_components/jquery-tokeninput/build/jquery.tokeninput.min.js",
            Sand.configs.SAND_ASSETS_CDN + "/js/sand/plugins/sand-input-token.js",

        ],
        init: 1
    },
    'upload': {
        css: [
            //Sand.configs.SAND_ASSETS_CDN + "/js/3rdparty/plugins/tokeninput/styles/token-input-facebook-v2.css"
            //Sand.configs.SAND_ASSETS_CDN + "/js/sand/mm/mm.css"
        ],
        js: [
            //Sand.configs.SAND_ASSETS_CDN + "/js/sand/mm/mm.js",
            Sand.configs.SAND_ASSETS_CDN + "/js/sand/plugins/upload.js"
        ],
        init: 1

    },
    'mm': {
        dependencies: ['upload'],
        css: [
            //Sand.configs.SAND_ASSETS_CDN + "/js/3rdparty/plugins/tokeninput/styles/token-input-facebook-v2.css"
            Sand.configs.SAND_ASSETS_CDN + "/js/sand/mm/mm.css"
        ],
        js: [
            Sand.configs.SAND_ASSETS_CDN + "/js/sand/mm/mm.js",
            Sand.configs.SAND_ASSETS_CDN + "/js/sand/plugins/plugin-mm.js"
        ],
        init: 1
    },
    'videojs': {

        css: [
            "http://vjs.zencdn.net/4.12/video-js.css"
            //Sand.configs.SAND_ASSETS_CDN + "/js/sand/mm/mm.css"
        ],
        js: [
            "http://vjs.zencdn.net/4.12/video.js",
            //Sand.configs.SAND_ASSETS_CDN + "/js/bower_components/videojs/plugin-mm.js"
        ],
        init: 1

    },
    'bootstro': {
        css: [
            Sand.configs.SAND_ASSETS_CDN + "/js/3rdparty/plugins/bootstrap/bootstro.js/bootstro.css"
        ],
        js: [
            Sand.configs.SAND_ASSETS_CDN + "/js/3rdparty/plugins/bootstrap/bootstro.js/bootstro.js",
            Sand.configs.SAND_ASSETS_CDN + "/js/sand/plugins/bootstro-help.js",
        ],
        init: 1
    },
    'tablesorter': {
        css: [
            Sand.configs.SAND_ASSETS_CDN + "/js/3rdparty/plugins/tablesorter/tablesorter.css"
        ],
        js: [
            Sand.configs.SAND_ASSETS_CDN + "/js/3rdparty/plugins/tablesorter/jquery.tablesorter.min.js",
            Sand.configs.SAND_ASSETS_CDN + "/js/sand/plugins/tablesorter.js",
        ],
        init: 1
    },
    'list': {
        js: [
            Sand.configs.SAND_ASSETS_CDN + "/js/sand/plugins/list-order-items.js",
        ],
    },
    'preloaded': [], //those which are already included in all.js
    'datetimepicker' : {
        css : [
            Sand.configs.SAND_ASSETS_CDN + "/js/bower_components/eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.min.css",
        ],
        js : [
            Sand.configs.SAND_ASSETS_CDN + "/js/bower_components/moment/min/moment.min.js",
            Sand.configs.SAND_ASSETS_CDN + "/js/bower_components/eonasdan-bootstrap-datetimepicker/build/js/bootstrap-datetimepicker.min.js",
            Sand.configs.SAND_ASSETS_CDN +  "/js/sand/plugins/bootstrap-datepicker.js",
        ],
        init : 1
    }
};