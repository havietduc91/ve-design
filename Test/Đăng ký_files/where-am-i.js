//by clicking a ` key sand will show you where the .phtml scripts are
//also this is to be used with zeroboardclip so we can just copy the .phtml file path
//right away so we can paste it in editor (eclipse)
if (Sand.configs.APPLICATION_ENV.indexOf('development') != -1) {
    Sand.where_am_i = function () {

        $(document).ready(function () {
            /*
             var zc = new ZeroClipboard( $("#click-to-copy"), {
             moviePath: Sand.configs.SAND_ASSETS_CDN + "/js/3rdparty/zeroclipboard/dist-2.1.6/ZeroClipboard.swf",
             debug: true
             });
             zc.on( "ready", function(readyEvent)
             {
             zc.on( "aftercopy", function(event) {
             Sand.alert.alert_success(event.data["text/plain"]);
             });
             });
             */

            //Can be used
            //Show whereami
            $.fn.selectText = function () {
                var doc = document
                    , element = this[0]
                    , range, selection
                    ;
                if (doc.body.createTextRange) {
                    range = document.body.createTextRange();
                    range.moveToElementText(element);
                    range.select();
                } else if (window.getSelection) {
                    selection = window.getSelection();
                    range = document.createRange();
                    range.selectNodeContents(element);
                    selection.removeAllRanges();
                    selection.addRange(range);
                }
            };

            //show both whereami and sand-dev-info
            $(document).keydown(function (event) {
                if (event.which == 192) // ` keystroke
                {
                    if ($("div.whereami:visible, div.sand-dev-info:visible").size() > 0) {
                        $("div.whereami, div.sand-dev-info").hide();
                        $("#zeroboard-copy-btn").hide();
                    }
                    else {
                        $("[data-whereami]").each(function (i, el) {
                            var $this = $(this);
                            var whereami = $(this).attr('data-whereami');
                            $("<div class='whereami alert alert-info bold' id='whereami-" + i + "'>" + whereami + "</div>").insertBefore($this);
                        });
                        $("div.sand-dev-info").show();
                        $("#zeroboard-copy-btn").show();
                    }
                }
            });

            $(document).on('click', 'div.whereami,.sand-dev-selecttext', function () {
                $(this).selectText();
                //zc.setText($(this).text());
            });
        });
    };
}
