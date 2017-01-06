$(document).ready(function () {
    Test = $.extend(Test, {

        timer: {
            timeout: null, //setInterval timeout variable
            duration: 0,//number of seconds.
            seconds_passed: 0,
            warning_threshold: 10,
            time_used: 0,
            //countdown_direction : 'up',
            show_timer: function () {
                /*
                 if ($('#x-timer').size() == 0)
                 {
                 $('body').append("<span id='x-timer'></span>");
                 $('#x-timer').css({
                 position: 'absolute',
                 right: '20px;',
                 bottom: '20px',
                 "font-size": '300%',
                 border: '1px solid gray'
                 });
                 }
                 $('#x-timer').show();
                 */
            },
            show_timesup_warning: function () {
                $("#title-timer").css({color: 'red'});
            },
            update_timer: function (seconds, minutes) {
                var secondsLeft = Test.timer.duration - Test.timer.seconds_passed;
                if (secondsLeft < Test.timer.warning_threshold) {
                    Test.timer.show_timesup_warning();
                }
                if (secondsLeft == 0) {
                    var d = new Date();
                    Test.exam_tend = d.getTime();
                }

                if (secondsLeft == -1) {
                    Test.timer.stop();
                }

                if (Test.finished) {
                    return;
                }

                var html;
                html = '<i class="fa fa-clock-o"></i> ';
                html += Sand.utils.parse_digital_clock_string_from_duration(secondsLeft);

                Sand.set_html("#title-timer", html, true);
            },
            start: function () {
                Test.finished = false;
                Test.timer.show_timer();
                Test.timer.seconds_passed = Test.timer.time_used || 0;

                //this duration is already set somewher else before calling start
                if (Test.timer.duration > 0) {
                    Test.timer.timeout = setInterval(function () {
                        Test.timer.seconds_passed = Test.timer.seconds_passed + 1;
                        Test.timer.update_timer();
                    }, 1000); //tick every second
                }
                var d = new Date();
                Test.exam_tstart = d.getTime();
                Test.exam_tend = 0;
            },
            //===========================================Timer=================================================
            stop: function (hideSummary) {
                //TODO: disable exam
                //TODO submit exam or Show submit screen
                if (typeof hideSummary == 'undefined' || !hideSummary) {
                    Test.show_exercise_summary('exam-summary');
                }
                Test.finish_test(Test.exam_iid);
                clearInterval(Test.timer.timeout);
            }
        }
    });
});