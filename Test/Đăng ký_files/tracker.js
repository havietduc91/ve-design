var timer_started = false;

$(document).ready(function () {
    Tracker = {
        //return 'locked', 'notyet', 'completed', 'struggling'
        get_progress: function (iid, progress) {
            if(typeof progress != 'undefined' && progress && typeof Tracker.progress[iid] != 'undefined') {
                return Tracker.progress[iid].p;
            }
            if (typeof Tracker.progress[iid] != 'undefined') {
                return Tracker.get_tco_level(Tracker.progress[iid].p);
            }
        },
        progress: {},
        start_tracking: function (iid, tco_type) {
            if (typeof CourseViewer.notTracking != 'undefined') {
                return;
            }
            if (!Sand.utils.is_guest()) {
                Sand.utils.log("start_tracking");
                if (!timer_started) {
                    //Initialize new TimeMe
                    TimeMe.initialize();
                    timer_started = true;
                }
                else {
                    //Clear TimeMe
                    TimeMe.resetAllRecordedPageTimes();
                    //Start new TimeMe
                    TimeMe.initialize();
                }
                Tracker.tco_iid = iid;
                Tracker.tco_type = tco_type;
            }
        },
        save_tracking: function () {
            if (typeof CourseViewer.notTracking != 'undefined') {
                return;
            }
            if (!Sand.utils.is_guest() && Tracker.tco_iid) {
                Sand.utils.log("save_tracking");
                // - Get total time of previous timePage info
                var tco_iid = Tracker.tco_iid;
                var tco_type = Tracker.tco_type;

                //var timeSpentInfo = TimeMe.getTimeOnAllPagesInSeconds();
                var timeSpentOnPage = TimeMe.getTimeOnCurrentPageInSeconds();
                /*
                 * - set info into tcoProgres in redis
                 *  + total time
                 *  + last time is now()
                 */
                //var courseCurrentLink = window.location.href.toString();
                var courseCurrentLink = window.location.pathname.toString() + window.location.hash;

                var url = Tracker.url('save_time');
                var d = {
                    tco_iid: tco_iid,
                    timeSpentOnPage: timeSpentOnPage,
                    ciid: Edx.course_iid,
                    tco_type: tco_type,
                    courseCurrentLink: courseCurrentLink //last visited link for course
                }
                Sand.ajax.ajax_request({
                    type: "POST",
                    url: url,
                    data: d,
                    dataType: 'json',
                    success: function (data) {
                        //do nothing
                    }
                });
                //TODO: If it's vocabset
                if (tco_type == 'vocabset')
                    Vocabset.saveProgress();
                else //refresh the tcos
                {
                    Tracker.get_tracking(Edx.tcos);
                }
            }
        },

        get_tcos_price: function (tcos, callback) {
            Sand.ajax.ajax_request({
                url: "/course/api/get-tcos-price",
                data: {
                    _sand_modal_ajax: 1,
                    tcos: tcos,
                    ciid: Edx.course_iid,
                },
                success: function (json) {
                    Edx.tcos_price = json;
                    callback();
                }
            });
        },
        //p is an array of {tco_iid : id, progress : p}
        save_progress_multi: function (p, callback, skill) {
            if (typeof CourseViewer.notTracking != 'undefined' || Sand.utils.is_guest()) {
                return;
            }
            if (typeof skill != 'undefined') {
                var data = {
                    skill: skill,
                    progress: p,
                    ciid: Edx.course_iid
                };
            } else {
                var data = {
                    progress: p,
                    ciid: Edx.course_iid
                };
            }
            var url = Tracker.url('save_progress_multi');
            Sand.ajax.ajax_request({
                type: "POST",
                url: url,
                dataType: 'json',
                data: data,
                success: function (data) {
                    /*
                     //Get result from server
                     $.each(data.result, function(tco_iid, p){
                     var progress = p.mp > 0 ? p.mp : p.p;
                     Tracker.update_tco_progress(tco_iid, progress);
                     })
                     */
                    //Reload tracking
                    if (typeof callback != 'undefined' && callback !== null) {
                        callback(data.result);
                    } else {
                        Tracker.get_tracking(Edx.tcos);
                    }
                },
                error: function (data) {
                    Sand.alert.alert_error('error loading progress');
                }
            });
        },
        /*
         //p : out of 100
         save_progress : function(tco_iid, p)
         {
         var url = '/?_sand_tracking=save_progress';
         Sand.ajax.ajax_request({
         type: "POST",
         url: url,
         dataType: 'json',
         data : {
         tco_iid : tco_iid,
         progress : p
         },
         success: function(data)
         {
         //Get result from server
         $.each(data.result, function(tco_iid, p){
         var progress = p.mp > 0 ? p.mp : p.p;
         Tracker.update_tco_progress(tco_iid, progress);
         })
         //Reload tracking.
         Tracker.get_tracking(Edx.tcos);
         },
         error: function(data)
         {
         Sand.alert.alert_error('error loading progress');
         }
         });
         },
         */
        /*Update tco progress
         * progress : integer out of 100.
         */
        update_tco_progress: function (tco_iid, progress) {
            var level = Tracker.get_tco_level(progress);

            Tracker.change_icon(tco_iid, level, progress);
            if (Sand.page == 'lesson/index/view' &&
                progress > 100 &&
                tco_iid == Sand.course.syllabus_iid) {
                //course completed. We have to show something
                $("#course-completed").show();
                $("#course-trigger")[0].click();
            }
        },
        update_progress_syllabus: function () {
            var user = User.get_user();
            if (!user['iid'] || user['iid'] == 'undefined') {
                return;
            }
            var syllabusIid = Edx.syllabus_iid;
            if (typeof syllabusIid != 'undefined') {
                Tracker.get_tracking([syllabusIid], {where: 0}, function (result) {
                    var data = result[syllabusIid];
                    var progress = data.mp > 0 ? data.mp : data.p;
                    Tracker.update_tco_progress(syllabusIid, progress);
                });
            }
            if ($('#course-overview-user').length > 0) {
                Tracker.render_overview();
            }
        },
        progress_thresholds: function () {
            locked = [-1, 0];
            notyet = [0, 1];
            struggling = [1, 50];
            completed = [50, 101];

            var obj = {
                'locked': locked,
                'notyet': notyet,
                'struggling': struggling,
                'completed': completed,
            };

            return obj;
        },
        get_tco_level: function (progress) {
            var progress_thresholds = Tracker.progress_thresholds();
            var level = 'locked';
            for (var key in progress_thresholds) {
                $value = progress_thresholds[key];
                if (progress >= $value[0] && progress < $value[1]) {
                    level = key;
                    break;
                }
            }
            return level;
        },
        get_progress_title: function (level, progress) {
            switch (level) {
                case 'locked' :
                    return 'Bài học đã bị khóa';
                case 'notyet' :
                    return 'Bạn chưa học phần này';
                case 'struggling' :
                    return 'Bạn đang học dở phần này với ' + progress + '%';
                default:
                    return 'Bạn đã hoàn thành phần này với ' + progress + '%';
            }
        },
        get_progress_class: function (level) {
            var ret = 'progress-' + level;
            //if (level == 'completed')
            return ret;
        },
        is_main_progress: function ($item) {
            if ($item.attr('id') == 'course-progress-header')
                return true;
        },
        update_progress_class: function ($item, level) {
            switch (level) {
                case 'completed' :
                    $item.removeClass('h-view m-view l-view').addClass('o-view');
                    break;
                case 'struggling' :
                    $item.removeClass('m-view o-view l-view').addClass('h-view');
                    break;
                case 'locked' :
                    $item.removeClass('m-view o-view h-view').addClass('l-view');
                    break;
                default : /* not yet*/
                    $item.removeClass('h-view o-view m-view l-view');
                    break;
            }

        },
        //either change the icon, or update the progress-bar if it's a progress bar
        change_icon: function (tco_iid, level, progress) {
            var $trackItems = $(".tco-tracking[data-tco='" + tco_iid + "']");
            var title = Tracker.get_progress_title(level, progress);
            var klass = Tracker.get_progress_class(level);

            $trackItems.each(function () {
                var $item = $(this);

                if ($item.hasClass('progress-syllabus')) {
                    $item.find('#syl-progress').html(progress + '%');
                }
                else if ($item.hasClass('progress-line')) {
                    $item.find('.current-line').css({'width': progress + '%'});
                }
                else if ($item.hasClass('c-progress-line')) {
                    $item.find('.c-progress-line').css({'width': progress + '%'});
                }
                else if ($item.hasClass('progress-course-user')) {
                    if (Tracker.is_main_progress($item)) //the top course progress
                    {
                        $("#course-progress-header").html(progress + '%');
                    }
                    else
                        $item.attr('style', "width:" + progress + '%');//.css('width', progress);
                }
                else if ($item.hasClass('current-progress-learn')) {
                    var item_parent = $(this).closest('.ft-item');
                    item_parent.find('.percent-learn-run').css({'width': progress + '%'});
                    item_parent.find('span').html(progress + '%');
                }
                else if ($item.hasClass('current-progress-overview')) {
                    var item_parent = $(this);
                    item_parent.find('.count').html(progress + '%');
                    item_parent.find('.progress-run').css({'width': progress + '%'});
                }
                else if ($item.hasClass('current-progress-overview-item')) {
                    Tracker.update_progress_class($item, level);
                }
                else if ($item.hasClass('progress')) {
                    var $progress = $item.find('.progress-bar');
                    $progress.attr('style', "width:" + progress + '%');
                    $progress.html(progress + '%').attr('aria-valuenow', progress);
                }
                else {
                    /*
                     var $base = $item.find('.icon-stack-base');
                     var $inner = $item.find('.inner');
                     */
                    //update the color of the circle
                    Tracker.update_progress_class($item, level);
                    /*
                     if (level == 'completed') {
                     $item.removeClass('h-view m-view').addClass('o-view');
                     } else if(level == 'struggling'){
                     $item.removeClass('m-view o-view').addClass('h-view');
                     } else {
                     $item.removeClass('h-view o-view m-view');
                     }
                     */
                    //   if (level == 'completed' || level == 'struggling')
                    //   {
                    //       if ($base.hasClass('icon-circle-blank'))
                    //           $base.removeClass('icon-circle-blank').addClass('icon-circle');

                    //       if ($inner.hasClass('nothing')) //empty circle: icons will be changed depending on progress
                    //       {

                    //           if (level == 'completed')
                    //               $inner.addClass('icon-ok white');
                    //           else
                    //               $inner.addClass('white').removeClass('icon-ok');
                    //       }
                    //       else
                    //       {
                    //           $inner.addClass('white');
                    //       }
                    //   }
                    //   else
                    //   {
                    //       if ($base.hasClass('icon-circle'))
                    //           $base.removeClass('icon-circle').addClass('icon-circle-blank');
                    //       $inner.removeClass('icon-ok white');//.addClass('nothing');
                    //   }

                    //   if ($inner.hasClass('icon-time')) //exam
                    //   {
                    //       if (level == 'notyet')
                    //           title = "Bạn chưa làm bài thi này";
                    //       else
                    //           title = "Bạn đã làm bài thi này đạt " + progress + '%';
                    //   }
                    //   $item.attr('title', title)
                    //    .removeClass('progress-struggling progress-completed')
                    //    .addClass(klass).attr('data-progress', progress);
                }
            });
        },
        //where : if set, only get the where the user was on a course
        get_tracking: function (tcos, params, callback) {
            if (Sand.utils.is_guest()) {
                if (typeof callback != 'undefined')
                    callback(false);
                return;
            }

            //send ajax to /progress.php?concepts = Sand.concepts_on_page
            var url = Tracker.url('get');
            var data = {
                tcos: tcos
            };
            if(typeof Edx.course_iid && Edx.course_iid) {
                data['ciid'] = Edx.course_iid;
            }
            if (params) {
                data = $.extend(data, params);
            }

            Sand.ajax.ajax_request({
                type: "POST",
                url: url,
                dataType: 'json',
                data: data,
                success: function (data) {
                    //Get result from server. Update the TCO
                    if (typeof callback != 'undefined') {
                        callback(data.result);
                        return;
                    }
                    else if (data.result && !params) {
                        $.each(data.result, function (tco_iid, p) {
                            var progress = p.mp > 0 ? p.mp : p.p;
                            Tracker.update_tco_progress(tco_iid, progress);
                        })
                    }
                    Tracker.progress = $.extend(Tracker.progress, data.result);
                    Tracker.update_progress_syllabus();
                    //update render view

                },
                error: function (data) {
                    Sand.alert.alert_error('error loading progress');
                }
            });
        },
        get_tracking_vocabset: function (tco_iid, callback) {
            var url = Tracker.url('get');
            Sand.ajax.ajax_request({
                url: url,
                data: {
                    tcos: tco_iid,
                    ciid: Edx.course_iid,
                    vocabset: 1,
                    children: 1,
                },
                dataType: 'json',
                success: function (data) {
                    if (data.result) {
                        callback(data.result);
                    }
                },
                error: function () {

                }
            });
        },
        url: function (action) {
            return "/tracker?a=" + action;
        },
        render_overview: function () {
            var syl_iid = $('#course-overview-user').data('syl');
            var pr = Tracker.progress[syl_iid];
            if (pr.p > 0) {
                $('#prov-count').html(pr.p + '%');
                $('#prov-width').css({'width': pr.p + '%'});
                $('.is_registry_false').hide();
                $('.is_registry_true').show();
            }
        },

        save_recently_editing_syllabus_action: function (iid) {
            var url = Tracker.url('save_recently_editing_syllabus');
            Sand.ajax.ajax_request({
                url: url,
                data: {iid: iid},
                dataType: 'json',
                success: function (data) {
                },
                error: function () {
                }
            });
        }
    };

    if (Edx.tcos.length > 0) {
        Tracker.get_tracking(Edx.tcos);
    }
});