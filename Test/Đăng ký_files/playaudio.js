var EdxPlayer;
$(document).ready(function () {
    EdxPlayer = {
        init: function () {
            // EdxPlayer.aud = $('#play-audio-sing').get(0);
            EdxPlayer.aud = new Audio();
            EdxPlayer.play_load_audio_background();
        },
        source: '',
        is_pause: false,
        is_playing: false,
        aud: {},
        list: {},
        is_playList: true,
        stop: function () {
            if (typeof EdxPlayer.aud.pause == 'function') {
                EdxPlayer.aud.pause();
                EdxPlayer.source = '';
                EdxPlayer.removeTime();
            }
        },
        playList: function (item) {
            var ex_this = item;
            var ex_parent = ex_this.closest('.conversation-transcript');
            var ex_list = ex_parent.find('.recording');
            if (ex_list.length > 0) {
                $(ex_list[0]).trigger('click');
                // EdxPlayer.play(ex_list[0]);
            }
            // var ex_parent = $('.play-conversation:visible').closest('.conversation-transcript');
            // var ex_list = ex_parent.find('.recording');
            // if(ex_list.length > 0) {
            //     console.log(ex_list[0]);
            // }
            // var list_play = $('.recording:visible');
            // if(list_play.length == 1) {
            //     EdxPlayer.play(list_play[0]);
            //     return true;
            // }
        },
        play: function (item) {
            var ex_source = EdxPlayer.loadLink(item);
            // console.log(ex_source);
            //neu load file audio moi
            if (EdxPlayer.source != ex_source) {
                //hien thi time
                EdxPlayer.DisplayTime(item);

                EdxPlayer.source = ex_source;
                EdxPlayer.is_pause = false;
                EdxPlayer.is_playing = true;
                //play audio
                EdxPlayer.aud.setAttribute('src', ex_source);
                EdxPlayer.aud.load();
                EdxPlayer.aud.play();
            } else {
                //khong phai audio moi
                //neu dang play
                if (EdxPlayer.is_playing) {
                    EdxPlayer.aud.pause();
                    EdxPlayer.is_pause = true;
                    EdxPlayer.is_playing = false;
                    return false;
                } else {
                    //neu dang pause
                    EdxPlayer.aud.play();
                    EdxPlayer.is_pause = false;
                    EdxPlayer.is_playing = true;
                    return false;
                }
            }

            EdxPlayer.CountTime();
            return true;
        },
        nextList: function () {
            var play_next = $('.play_real_time_div').next();
            if (play_next.length == 0) {
                EdxPlayer.is_playList = false;
                EdxPlayer.removeTime();
            } else {
                var next_item = play_next.find('.recording');
                EdxPlayer.play(next_item);
            }
        },
        removeTime: function () {
            var remove_time = $('body').find('.play_real_time_div');
            var remove_time_overlay = $('body').find('.playing_overlay');
            if (remove_time.length > 0) {
                remove_time.removeClass('play_real_time_div');
            }

            if (remove_time_overlay.length > 0) {
                remove_time_overlay.remove();
            }
        },
        DisplayTime: function (item) {
            EdxPlayer.removeTime();
            var play_wrap = item.closest('div');
            var get_height = play_wrap.attr('data-height');
            if (get_height == undefined) {
                var height_wrap = play_wrap.height();
                play_wrap.attr('data-height', height_wrap);
            } else {
                var height_wrap = get_height;
            }
            $('.play_real_time_div').removeClass('play_real_time_div');
            play_wrap.addClass('play_real_time_div').css({'height': height_wrap + 'px'});
            //play_wrap.find('span').css({'height' : height_wrap + 'px', 'line-height' : height_wrap + 'px', 'padding' : '0px'});
            play_wrap.append('<span class="playing_overlay" style="height: ' + height_wrap + 'px;line-height: ' + height_wrap + 'px;padding: 0px;"></span>');
        },
        loadTime: function (widthx) {
            var playing_time = $('.playing_overlay');
            // var parent = playing_time.closest('div');
            // var play_icon = ['fa fa-volume-off', 'fa fa-volume-down', 'fa fa-volume-up'];
            // var play_icon_random = play_icon[Math.floor(Math.random()*play_icon.length)];
            if (playing_time.length > 0) {
                playing_time.css("width", widthx + "%");
            }
            // parent.find('i').attr('class', play_icon_random);
        },
        CountTime: function () {
            //xu ly khi play het audio
            EdxPlayer.aud.addEventListener('timeupdate', function (evt) {
                var time_ceil_current = Math.ceil((EdxPlayer.aud.currentTime / EdxPlayer.aud.duration) * 100);
                EdxPlayer.loadTime(time_ceil_current);

                if (EdxPlayer.aud.currentTime == EdxPlayer.aud.duration) {
                    EdxPlayer.source = '';
                    //neu dang play list
                    if (EdxPlayer.is_playList) {
                        EdxPlayer.nextList();
                    } else {
                        EdxPlayer.removeTime();
                    }
                }
            });
        },
        loadLink: function (item) {
            // var audioDemo = '/ufiles/nhu-khuc-tinh-ca.mp3';
            // return audioDemo;
            var ex_source = item.attr('data-id');
            if ((ex_source.indexOf('http://') !== 0) || (ex_source.indexOf('http://') !== 0)) {
                ex_audio_type = ex_this.attr('data-type');
                if (ex_audio_type == 'dictionary') {
                    ex_source = Sand.configs.DICT_CDN + '/' + ex_source + '.mp3';
                }

            }
            return ex_source;
        },
        play_load_audio_background: function () {
            EdxPlayer.play_audio_background_element = new Audio();
            EdxPlayer.play_audio_background_element.load();
        },
        play_audio_background_element: {},
        play_audio_background: function (file) {
            if (!Sand.utils.is_mobile()) {
                EdxPlayer.play_audio_background_element.src = Sand.utils.get_static_mp3_path() + file + '.mp3';
                EdxPlayer.play_audio_background_element.play();
            }
            return false;
        }
    };

    EdxPlayer.init();
    $('body').on('click', '.recording', function (e) {
        ex_this = $(this);
        e.preventDefault();
        EdxPlayer.is_playList = false;
        EdxPlayer.play(ex_this);
    });

    $('body').on('click', '.play-conversation', function (e) {
        ex_this = $(this);
        e.preventDefault();
        EdxPlayer.is_playList = true;
        EdxPlayer.playList(ex_this);
    });

    Sand.utils = $.extend(Sand.utils, {
        playBackground: function (file) {
            EdxPlayer.play_audio_background(file);
        }
    });
});
