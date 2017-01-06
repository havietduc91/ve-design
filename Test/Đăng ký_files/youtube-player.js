/**
 * TODO: Re-name space to Youtube, in stead of CourseViewer
 */

$(document).ready(function () {
    CourseViewer = $.extend(CourseViewer, {
        id_check_video_ready: '',
        yt_ready: 1,// = 0 khi ready, tăng thêm khi được call
        play_video: {
            vid_current: '',
            width: '800px',
            height: '450px',
            display_full: false,
            auto_play: true,
            pause: true,
            play_type: 'default',
            st: 0,
            et: 0,
            duration: 0
        },

        stop_video: function () {
            $('#play-youtube').hide();
            if ('loadVideoById' in CourseViewer.play_video) {
                CourseViewer.play_video.stopVideo();
            }
        },
        check_video_ready: function () {
            if (typeof YT != 'undefined' && YT.Player != 'undefined') {
                CourseViewer.yt_ready = 0;
                var width_video = $('#play-youtube').width();
                var height_video = (width_video * 9) / 16;
                CourseViewer.play_video.width = width_video + 'px';
                CourseViewer.play_video.height = height_video + 'px';
                CourseViewer.play_video = new YT.Player('ytplayer', {
                    width: width_video + 'px',
                    height: height_video + 'px',
                    videoId: CourseViewer.play_video.vid_current,
                    suggestedQuality: 'large',
                    playerVars: {
                        rel: 0,
                        start: CourseViewer.play_video.st,
                        end: CourseViewer.play_video.et
                    },
                    events: {
                        onReady: function () {
                            CourseViewer.auto_play_video();
                        },
                        onStateChange: function (event) {
                            if (event.data === 0) {
                                if (Dictation.isWatchIntro) {
                                    Dictation.isWatchIntro = false;
                                    $('#skip-snippet').trigger('click');
                                } else {
                                    if (CourseViewer.ntype == 'dictation') {
                                        $('#show-speak').trigger('click');
                                    } else {
                                        $('#next-snippet').trigger('click');
                                    }
                                }
                            }
                        }
                    }
                });
            }

            if (CourseViewer.yt_ready >= 1 && CourseViewer.yt_ready < 30) {
                if (CourseViewer.yt_ready == 1) {
                    CourseViewer.id_check_video_ready = self.setInterval(CourseViewer.check_video_ready, 1000);
                }
                CourseViewer.yt_ready++;
                var count_down = 30 - CourseViewer.yt_ready;
                $('#msg-loading-youtube').html('Vui lòng chờ thêm <strong>' + count_down + 's</strong> để tải video...');
                // console.log('waiting youtube api : '+CourseViewer.yt_ready);
            } else if (CourseViewer.yt_ready == 0) {
                clearInterval(CourseViewer.id_check_video_ready);
            } else {
                var href = window.location.href;
                clearInterval(CourseViewer.id_check_video_ready);
                $('#msg-loading-youtube').html('Xin xem lại đường truyền internet hoặc <a href="javascript:window.location.reload();"><strong>bấm vào đây</strong></a> để tải lại trang');
            }

            return;
        },
    });
});