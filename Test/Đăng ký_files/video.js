$(document).ready(function () {
    CourseViewer = $.extend(CourseViewer, {
        display_video: function (iid, from, type) {
            var item = Tree.get_node(iid);
            EdxPlayer.stop();
            CourseViewer.stop_video();
            $("#play-video-area").jPlayer("stop");
            CourseViewer.display_title(item);

            $('#check-answer').hide();
            $('#video-content-wrap').html('');

            var jplayShow = false;
            if (typeof item.videos != 'undefined' && typeof item.videos[0] == 'object') {
                jplayShow = true;
                $("#play-video-area").jPlayer("destroy");
                $("#play-video-area").jPlayer({
                    ready: function () {
                        $(this).jPlayer("setMedia", {
                            title: item.name,
                            mp4: item.videos[0].path,
                            webmv: item.videos[0].path
                        });
                    },
                    size: {
                        width: "800px",
                        height: "400px",
                        cssClass: "jp-video-360p"
                    },
                    playlistOptions: {
                        autoPlay: true
                    },
                    supplied: "mp4,webmv",
                    globalVolume: true,
                    useStateClassSkin: true,
                    autoBlur: false,
                    smoothPlayBar: true,
                    keyEnabled: true
                });
                $("#play-video").show();
                $("#play-video-area").jPlayer("play");
            } else {

                //TODO: we might have to hide question content
                var vid;
                var p;
                $("#play-youtube").show();
                //move youtube to near top
                // window.scrollTo(0, 0);

                CourseViewer.play_video.st = CourseViewer.convertStringToSecond(item.st);
                CourseViewer.play_video.et = CourseViewer.convertStringToSecond(item.et);
                CourseViewer.play_video.duration = CourseViewer.convertStringToSecond(item.duration);
                if (CourseViewer.play_video.et == 0) {
                    CourseViewer.play_video.et = CourseViewer.play_video.duration;
                }
            }

            if (type == "dictation") {
                if(Recorder.blockSpeak) {
                    CourseViewer.display_check_next('next-item');
                } else {
                    CourseViewer.display_check_next('show-speak');
                }
                if (item.svid) {
                    vid = item.svid;
                } else if (item.vid_gb) {
                    vid = item.vid_gb;
                } else {
                    vid = item.vid_us;
                }
            } else {
                CourseViewer.display_check_next('next-item');
                if (item.svid) {
                    vid = item.svid
                } else {
                    vid = item.vid;
                }
                CourseViewer.display_title(item);
                if (jplayShow) {
                    return;
                }
                $('#video-content-wrap').html('<div class="content-grammar">' + item.content + '</div>');
            }

            CourseViewer.play_video.vid_current = vid;

            CourseViewer.play_video.currentIid = iid;

            if ('loadVideoById' in CourseViewer.play_video) {
                // CourseViewer.check_display_video = true;
                CourseViewer.play_video.loadVideoById({
                    videoId: CourseViewer.play_video.vid_current,
                    suggestedQuality: 360,
                    playerVars: {rel: 0},
                    startSeconds: CourseViewer.play_video.st,
                    endSeconds: CourseViewer.play_video.et
                });

                CourseViewer.auto_play_video();
            } else {
                CourseViewer.check_video_ready();
            }
            if (!Sand.utils.is_mobile()) {
                // var hight = $('#top-nav-course').height();
                // if($('#blackboard-sub-nav').is(":visible")){
                //     hight += $('#blackboard-sub-nav').height();
                // }

                // $('#dictation-timeline-ul').scrollTo(0);
                // $('#video-content-wrap').html("<h4>" + item.name +"</h4>").show();
                // var h0 = $('#dictation-timeline-ul').height();
                // var h1 = $('.timeline-ul.timeline-ul-sub:eq(0)').offset();
                // var h2 = $('.timeline-ul.timeline-ul-sub:visible').find('.timeline-li.vocab.active').offset();
                // if(h2.top - h1.top >= h0)
                //     $('#dictation-timeline-ul').scrollTo(h2.top - hight);

                // window.scrollBy(0,hight);
            }
            Loading.disable();
        },
        display_slide: function (iid, from) {
            EdxPlayer.stop();
            CourseViewer.stop_video();
            $("#play-video-area").jPlayer("stop");
            $("#play-video").hide();
            var item = Tree.get_node(iid);
            CourseViewer.display_check_next('next-item');
            CourseViewer.display_title(item);
            var slideLink = item.type == 'pdf' ? item.pdf : item.ppt;
            var html = '<iframe src="' + Sand.configs.ASSETS_CDN + 'slide/view.html#' + Sand.configs.STATIC_CDN + slideLink + '" width="800px" height="450px" allowfullscreen="" webkitallowfullscreen=""></iframe>'
            Sand.set_html('#slide-content-wrap', html, true);
        }
    });
});