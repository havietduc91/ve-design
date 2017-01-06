$(document).ready(function () {
    CourseViewer = $.extend(CourseViewer, {
        prev_snippet: function () {
            // get prev sibling
            // if (yes) trigger click
            // if no: get parent => trigger click

            var i = Edx.tracking_line.indexOf(CourseViewer.current_iid.toString());
            if (i != -1 && i > 0) {
                var j = i - 1;
                var prev = Edx.tracking_line[j];
                var pid = Tree.get_pid(CourseViewer.current_iid);

                if (pid == prev) {
                    j--;
                    prev = Edx.tracking_line[j];
                }

                check_prev = CourseViewer.check_prev_visible(prev);
                while (!check_prev) {
                    j--;
                    if (j < 0) {
                        check_prev = true;
                        prev = Edx.tracking_line[0];
                    } else {
                        prev = Edx.tracking_line[j];
                        check_prev = CourseViewer.check_prev_visible(prev);
                    }
                }

                if (prev)
                    $(".snippet[data-iid='" + prev + "']")[0].click();
                else
                    alert("Beginning");
            } else {
                alert("Beginning");
            }

            // var i = Edx.tracking_line.indexOf(CourseViewer.current_iid.toString());
            // if (i != -1 && i > 0)
            // {
            //     var prev = Edx.tracking_line[i - 1];
            //TODO: if prev is parent of current_iid, then find prev_sibling of prev
            // var pid = Tree.get_pid(CourseViewer.current_iid);
            // if (pid == prev)
            // {
            //     prev = Tree.prev_sibling(Tree.get_pid(prev), prev);
            // }
            // prev = pid;
            // prev = i;
            //     if (prev) {
            //         if($(".snippet[data-iid='" + prev + "']").length > 0) {
            //             $(".snippet[data-iid='" + prev + "']")[0].click();
            //         } else {
            //             CourseViewer.current_iid = prev;
            //             CourseViewer.prev_snippet();
            //         }
            //     }
            //     else
            //         alert("Beginning");
            // } else {
            //     alert("Beginning");
            // }
        },
        //khong cho phep thuc hien next hoac prev
        disable_snippet_click: function () {
            $('#next-snippet').css({'pointer-events': 'none'});
            $('#prev-snippet').css({'pointer-events': 'none'});
        },
        //cho phep thuc hien next hoac prev
        enable_snippet_click: function () {
            $('#next-snippet').css({'pointer-events': 'auto'});
            $('#prev-snippet').css({'pointer-events': 'auto'});
        },
        next_snippet: function (exam_iid) {
            //sco voi level = 1 thi khong co snippet nhung trong tracking-line van ton tai
            var current_iid;
            if (Test.exam_iid && Test.finished) {
                current_iid = Test.exam_iid;
            }
            if (typeof exam_iid != 'undefined') {
                item = Tree.get_node(exam_iid);
                current_iid = item.childrenIids[item.childrenIids.length - 1];
            } else {
                current_iid = CourseViewer.current_iid;
            }
            var i = Edx.tracking_line.indexOf(current_iid.toString());
            if (i != -1 && i < Edx.tracking_line.length - 1) {
                var next = Edx.tracking_line[i + 1];
                if ($(".snippet[data-iid='" + next + "']").length > 0) {
                    //Truong hop neu no la sco lev # 1
                    $(".snippet[data-iid='" + next + "']")[0].click();
                } else {
                    //Neu truong hop khong ton tai snippet do no la sco level = 1
                    CourseViewer.current_iid = next;
                    CourseViewer.next_snippet();
                }
            }
            else {
                CourseViewer.finish_course();
            }
        },
        allowed_to_view_item: function (iid, ntype, from) {
            // không bắt buộc học qua chương này mới học chương khác hoặc học item đầu tiên.
            if (typeof Edx.progress_algorithm == 'undefined' || Edx.progress_algorithm != CourseViewer.algorithm_proprotion || !CourseViewer.current_iid) {
                return true;
            }
            var pid = Tree.get_pid(CourseViewer.current_iid);
            // các item trong một chương
            if (pid == iid || pid == Tree.get_pid(iid) || pid == Edx.syllabus_iid) {
                return true;
            }
            var i = Edx.tracking_line.indexOf(pid.toString());
            var y = Edx.tracking_line.indexOf(iid.toString());
            // là chương trước đã pass
            if (i > y) {
                return true;
            }
            while (y >= i) {
                if (i != -1 && i < Edx.tracking_line.length - 1) {
                    var next_iid = CourseViewer.get_next_uncle(i);
                    //chương hiện tại hoặc tiếp theo chưa pass
                    if (next_iid == iid || next_iid == Tree.get_pid(iid)) {
                        return true;
                    }
                    if (next_iid == -1 || !CourseViewer.is_sco_passed(next_iid)) {
                        return false;
                    }
                    i = Edx.tracking_line.indexOf(next_iid.toString()) + 1;
                } else {
                    return false;
                }
            }
            return false;
        },
        // là sco tiếp theo trong dánh danh sách các
        get_next_uncle: function (index) {
            if (typeof Edx.tracking_line[index] == 'undefined') {
                return -1;
            }
            var node = Tree.get_node(Edx.tracking_line[index]);
            if (typeof node != 'undefined' && node.ntype == 'sco') {
                return node.iid;
            }
            return CourseViewer.get_next_uncle(index + 1);
        },
        is_sco_passed: function (iid) {
            if (Tracker.get_progress(iid, true) == 100) {
                return true;
            }
            var node = Tree.get_node(iid);
            // kiểm tra điều kiện còn lại, trong sco không có bài tập.
            for (var i in node.children) {
                if (node.children[i].ntype == 'exercise') {
                    return false;
                }
            }
            return true;
        },
        check_prev_visible: function (iid) {
            if ($(".snippet[data-iid='" + iid + "']").length > 0) {
                return true;
            }
            return false;
        },

    });

    /*********************** NAVIGATION *************************/
    $(document).on('click', '#next-snippet', function () {
        //TODO: if it's loading something we have to return...
        CourseViewer.next_snippet();

    });

    $(document).on('click', '#prev-snippet', function () {
        //TODO: if it's loading something we have to return...
        CourseViewer.prev_snippet();
    });

});