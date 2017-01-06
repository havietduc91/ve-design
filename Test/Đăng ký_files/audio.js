$(document).ready(function () {
    CourseViewer = $.extend(CourseViewer, {
        play_audio_new: function (edx_id) {
            var edx_item = EdxJplayer[edx_id];
            if (!edx_item.is_list) {
                $("#ejplay-" + edx_id).jPlayer({
                    ready: function () {
                        $(this).jPlayer("setMedia", {
                            title: "Hidden",
                            mp3: EdxJplayer[edx_id].path,
                        }).jPlayer("play");
                    },
                    play: function () { // To avoid multiple jPlayers playing together.
                        $(this).jPlayer("pauseOthers");
                    },
                    swfPath: Sand.configs.ASSETS_CDN + "/v2/js",
                    supplied: "mp3",
                    cssSelectorAncestor: "#ejcon-" + edx_id,
                    wmode: "window",
                    globalVolume: true,
                    useStateClassSkin: true,
                    autoBlur: false,
                    smoothPlayBar: true,
                    keyEnabled: true,
                    autoplay: true
                });
            } else {
                new jPlayerPlaylist({
                        jPlayer: "#ejplay-" + edx_id,
                        cssSelectorAncestor: "#ejcon-" + edx_id
                    }, edx_item.paths
                    , {
                        playlistOptions: {
                            autoPlay: true,
                            enableRemoveControls: true
                        },
                        swfPath: Sand.configs.ASSETS_CDN + "/v2/js",
                        supplied: "mp3",
                        wmode: "window",
                        globalVolume: true,
                        useStateClassSkin: true,
                        autoBlur: false,
                        smoothPlayBar: true,
                        keyEnabled: true
                    });
            }
        }
    });

    $(document).on('click', '.exjp-load', function (e) {
        e.preventDefault();
        var edx_this = $(this);
        var edx_id = edx_this.attr('data-id');
        edx_this.removeClass('exjp-load');
        CourseViewer.play_audio_new(edx_id);
    });
});