var Tree;
$(document).ready(function () {
    Tree = {
        /*
         One item looks like this
         {
         iid : 'int',
         ntype : 'sco',
         name : '',
         ....
         children : [
         {
         //node that each child shouldn't contain any thing else
         //other than metadata for that child
         duration : '10:00',
         compulsory : 'y',
         iid : 'int'
         }
         ]
         }
         */
        syllabus_iid: '',
        syllabus_exam: 0,
        syllabus_staff: {},
        is_editing_syllabus: function () {
            if (typeof Teacher != 'undefined' && typeof Teacher.is_editing_syllabus != 'undefined')
                return true;
            else
                return false;
        },
        tree: {}, //data containing all the nodes, 1 level

        pids: {},
        needs_reload: function (node) {
            if (typeof node == 'undefined')
                return true;
            else {
                if (typeof node !== 'object') //number
                {
                    node = Tree.get_node(node);
                }
                if (typeof node == 'undefined')
                    return true;

                if (Tree.is_list(node.ntype)) {
                    if (node.depth == 'undefined' || node.depth == 0)
                        return true;
                }
            }
            //if normal node, what do we do...
            return false;
        },
        //=============================end GUI =========================
        get_pid: function (iid) {
            return Tree.pids[iid];
        },
        load_async: function (params, cb) {
            //params = {iid : iid, ntype : ntype, depth : 1};
            // syllabus/api/v2/get..
            if (typeof Edx.editing_syllabus !== 'undefined' && Edx.editing_syllabus == 1) {
                params = $.extend(params, {editing_syllabus: Edx.editing_syllabus});
            }
            Sand.ajax.ajax_request({
                url: Sand.api_link("syllabus", "get", params),
                success: function (json) {
                    if (json.result) {
                        Tree.save_node(json.result, params);
                        cb(json.result);
                    }
                }
            });
        },
        aggregate_children_sw: function (node) {
            var sw = 0;
            if (typeof node.children != 'undefined') {
                for (var i in node.children) {
                    if (typeof node.children[i]['sw'] != 'undefined')
                        sw = sw + parseInt(node.children[i]['sw']);
                    /*
                     else if (node.ntype == 'exercise')
                     sw = sw + 1;
                     */
                }
            }
            return sw;

        },
        metadata_fields: ['duration', 'group', 'display_group'],
        is_metadata_field: function (f) {
            if (Tree.metadata_fields.indexOf(f) != -1)
                return true;
            return false;
        },
        beautify_node: function (node) {
            node._admin_sortable_class = '';
            node._has_edit = true;
            node._has_duration = true;

            if (!node.duration || node.duration == '')
                node.duration = '00:00';
            if (typeof node.weighted == "undefined" && Tree.syllabus_exam) {
                node.weighted = 1;
            } else if (typeof node.weighted == "undefined") {
                node.weighted = '- - -';
            }

            /*
             if (node.ntype == 'syllabus') {
             node._has_vocab
             }
             */


            if (node.ntype == 'vocab' && node.avatar) {
                if (node.avatar.indexOf(Sand.configs.STATIC_CDN) == -1) {
                    node.avatar = Sand.configs.STATIC_CDN + node.avatar;
                }
            }
            if (node.ntype == 'exercise') {
                node.question_mode = node.question_mode || 'one_by_one';

                //node.sw = node.sw || node.count;
                node.sw = Tree.aggregate_children_sw(node);

                // Find out if this exercise is an exam
                var pid = Tree.get_pid(node.iid);
                var parentNode = Tree.get_node(pid);
                if (parentNode && typeof parentNode.is_exam != 'undefined' && parentNode.is_exam) {
                    node.exam_iid = parentNode.iid;
                    node._admin_sortable_class = 'exam';
                }
            }
            //TODO: improve performance here
            if (node.ntype == 'sco' && typeof node.is_exam != 'undefined' && node.is_exam) {
                node.sw = Tree.aggregate_children_sw(node);
                node._admin_sortable_class = 'exam';
            }

            if (node.ntype == 'question') {
                var pid = Tree.get_pid(node.iid);
                if (pid) {
                    var ex = Tree.get_node(pid);
                    var i = ex.childrenIids.indexOf(node.iid);
                    node.name = "#" + parseInt(parseInt(i) + 1);
                }
                if (node.type == Question.TYPES.INTRODUCTION) {
                    if (node.sticky == 1)
                        node._admin_sortable_class = 'introduction-question-normal';
                    else if (node.sticky == 2)
                        node._admin_sortable_class = 'introduction-question-sticky';
                    else if (node.sticky == 3) {
                        node._has_duration = false;
                        node._has_edit = false;
                        node._admin_sortable_class = 'introduction-question-sticky-end';
                    }
                }

                node._short_preview = Tree.question_short_preview(node);
            }

            return node;
        },
        get_node: function (iid, depth) {
            var node = Tree.tree[iid];
            var depth = depth || 0;
            depth = parseInt(depth);

            if (!node)
                return node;
            //TODO: find out pid tree and then navigate top down
            if (depth == 0)
                return Tree.beautify_node(node);
            else //Depth =1
            {
                //Check if level depth is already loaded or not
                //node.depth might be = 1 and we now need to load 2.
                var children = [];
                if (typeof node.childrenIids != 'undefined'
                    && node.childrenIids.length > 0) {
                    for (var i in node.childrenIids) {
                        var childIid = node.childrenIids[i];
                        var child = Tree.get_node(childIid);
                        var childMeta = node.children[i];
                        child = $.extend(childMeta, child);
                        child.pid = iid;
                        child.idx = i;
                        child.idx_display = parseInt(i) + 1;
                        children.push(child);
                    }
                }
                node.children = children;
                return Tree.beautify_node(node);
            }
        },
        save_node: function (node, requestParams) {
            if (!node || typeof node.iid == 'undefined'
                || typeof node.ntype == 'undefined'
            )
                return;

            //delete empty metadata field
            var k;
            for (var i in Tree.metadata_fields) {
                //either null, '', [] we will delete the field
                // just to avoid it overriding the current data
                k = Tree.metadata_fields[i];
                if (typeof node[k] != 'undefined' &&
                    (node[k] == '' ||
                        (typeof node[k] == 'array' && node[k].length == 0)
                    )
                )
                    delete node[k];
            }

            //TODO: unset the children.
            //node.syllabusId = Sand.syllabusId;
            node.subject = Edx.subject;
            var iid = node.iid;

            if (node.ntype == 'syllabus' && typeof node.is_exam != 'undefined' && node.is_exam) {
                Tree.syllabus_exam = 1;
                node.weighted = 100;
            } else if (node.ntype == 'syllabus') {
                Tree.syllabus_exam = 0;
            }
            if (node.children && node.children.length > 0) {
                node.childrenIids = [];
                node.count_weighted = 0;
                for (var i in node.children) {
                    //also save the children here.
                    Tree.save_node(node.children[i]);
                    //store the relationship
                    node.count_weighted += parseInt(node.children[i].weighted | 0)
                    Tree.pids[node.children[i].iid] = iid;
                    node.childrenIids.push(node.children[i].iid);
                }
            }

            if (node.ntype == 'syllabus' && Tree.is_editing_syllabus()) {
                Tree.syllabus_iid = node.iid;
                Tree.syllabus_staff = node.staff;
                Tree.syllabus_staff.push({iid: 0, name: '_______'});
            } else if (node.ntype == 'vocabset') {
                var pNode = Tree.tree[node.pid];
                if (typeof node.phonic_learning == 'undefined') {
                    node.phonic_learning = 'phonic';
                }
                if (typeof node.speaker == 'undefined') {
                    node.speaker = 'speaker';
                } else {
                    var key = "speaker-" + node.speaker;
                    node[key] = 1;
                }
                if (typeof node.xpeak_fluency == 'undefined') {
                    node.xpeak_fluency = "% xpeak_fluency";
                }
                if (typeof pNode != 'undefined' && pNode._is_exercise) {
                    node.children_exercise = 1;
                }
                node.teacher = Tree.syllabus_staff;
            } else if (node.ntype == 'question') {
                if (node.type == 0) {
                    if (typeof node.display_group == 'undefined')
                        node.display_group = 1;
                    var key = 'display_group-' + node.display_group;
                    if (typeof node.intro_sticky != 'undefined' && node.intro_sticky) {

                    } else {
                        delete node.intro_sticky;
                    }
                    node[key] = 1;
                    node.question_intro = 1;
                }
                if (typeof node.group == 'undefined') {
                    node.group = 1;
                }
                var key = 'group-' + node.group;
                node[key] = 1;
            } else if (node.ntype == 'exercise') {
                if (typeof node.display_platform == 'undefined') {
                    node.display_platform = 1;
                }
                var val = "web_mobile";
                if (node.display_platform == 2) {
                    val = 'web';
                } else if (node.display_platform == 3) {
                    val = 'mobile'
                }
                node[val] = 1;
            } else if ((node.ntype == 'video' || node.ntype == 'vocab') && Tree.is_editing_syllabus()) {
                var selected = node.teacher || 0;
                var tmp = [];
                for (var i in Tree.syllabus_staff) {
                    if (Tree.syllabus_staff[i].iid == selected) {
                        tmp.push({iid: Tree.syllabus_staff[i].iid, name: Tree.syllabus_staff[i].name, selected: 1});
                    } else {
                        tmp.push({iid: Tree.syllabus_staff[i].iid, name: Tree.syllabus_staff[i].name});
                    }
                }
                node.teachers = tmp;
            } else if (node.ntype == 'end_intro_sticky') {
                node.end_intro_sticky = 1;
            }

            if (typeof Tree.tree[iid] !== 'undefined') {
                node = $.extend({}, Tree.tree[iid], node);
            }


            if (Tree.is_list(node.ntype) && typeof node.children == 'undefined') {
                node.children = [];
                node.childrenIids = [];
            }

            if (node.ntype != 'sco' && !node.is_exam) {
                node.is_exam = Tree.syllabus_exam;
            }

            Tree.tree[iid] = node;

            /* If we're loading exercise information for frontend */
            if (Edx.is_student_view) {
                Tree.filter_exercise_questions(iid);
            }

            //if (Syllabus.is_editing_syllabus)
            //{
            Tree.add_links_for_editing(iid);
            //}
        },

        question_type_string: function (t) {
            switch (t) {
                case Question.TYPES.INTRODUCTION:
                    return 'intro';
                case Question.TYPES.MC:
                    return 'mc';
                case Question.TYPES.INLINE:
                    return 'inline';
                case Question.TYPES.REORDER:
                    return 'reorder';
                case Question.TYPES.MATCHING_PAIRS:
                    return 'pairs';
                case Question.TYPES.OPEN_ENDED:
                    return 'open_ended';
                case Question.TYPES.SPEAKING:
                    return 'speaking';
            }

            return '';
        },

        question_short_preview: function (node) {
            var t = Tree.question_type_string(node.type);
            var c = node.content;
            c = Sand.string.strip_html_tag(c);

            if (node.type == Question.TYPES.REORDER) {
                if (node.reoders && node.reoders.length > 0)
                    c = c + node.reoders.join(',');
            }
            else if (node.type == Question.TYPES.MC) {
                var arr = [];
                for (var i in node.mc_answers) {
                    arr.push(node.mc_answers[i].text);
                }
                c = c + ' [' + arr.join(',') + ']';
            }


            t = '[' + t + '] ';
            if (c.length > 100) {
                return t + c.slice(0, 100);
            }
            else
                return t + c;
        },
        filter_exercise_questions: function (iid) {
            var node = Tree.tree[iid];
            var ntype = node.ntype;
            //node.children
            if (typeof node.children != 'undefined' && node.children.length > 0) {
                var content_null = false;
                var sticky;
                var iidFilter = [];
                var childrenFilter = [];
                var itemTemp;
                var intro_key = '';
                $.each(node.children, function (i, r) {
                    ntype = r['type'];
                    sticky = r['sticky'];

                    if (r['ntype'] == 'end_intro_sticky') {
                        intro_key = '';
                    } else if (ntype == 0 && r['intro_sticky']) {
                        itemTemp = r;
                        intro_key = 'sticky-' + r['iid'];
                        itemTemp.iid_sticky = intro_key;
                        if (typeof r['audio'] != 'undefined') {
                            itemTemp.audio_display = CourseViewer.display_audio(r);
                        }
                        node[intro_key] = Sand.template.render(
                            Sand.get_template('question', 'intro_stick'),
                            itemTemp);
                    } else {
                        if (intro_key != '') {
                            r['iid_sticky'] = intro_key;
                        }
                        iidFilter.push(r['iid']);
                        if (typeof Take != 'undefined' && typeof Take.attempts.answers != 'undefined' &&
                            Take.attempts.answers && Take.attempts.answers[r['iid']]) {
                            var result = Take.attempts.answers[r['iid']];
                            if (result.type == Question.TYPES.REORDER) {
                                var reorders = [];
                                for (var i = 0; i < result.answer.length; i++) {
                                    $.each(r.reorders, function (x, y) {
                                        if (y.id == result.answer[i]) {
                                            reorders.push(y);
                                        }
                                    })
                                }
                                r.reorders = reorders;
                            } else if (result.type == Question.TYPES.MATCHING_PAIRS) {
                                var r_pair = [];
                                for (var i = 0; i < result.answer.length; i++) {
                                    $.each(r.r_pair, function (x, y) {
                                        if (y.id == result.answer[i]) {
                                            r_pair.push(y);
                                        }
                                    })
                                }
                                r.r_pair = r_pair;
                            }

                        }
                        childrenFilter.push(r);
                    }
                })
                node.children = childrenFilter;
                node.childrenIids = iidFilter;
                Tree.tree[iid] = node;
            }
        },
        add_links_for_editing: function (iid) {
            var node = Tree.tree[iid];
            var ntype = node.ntype;
            //add links and stuff
            if (Tree.is_editing_syllabus()) {
                //we have to reset _is_* here otherwise
                // mustache will inherit from the parent key
                var all = ['sco', 'syllabus', 'exercise',
                    'vocabset', 'koncept', 'path', 'exam', 'vocab',
                    'question'
                ];
                for (i in all)
                    node['_is_' + all[i]] = false;

                node['_is_' + ntype] = true;

                if (ntype == 'question') {
                    node.name = '';
                    delete node.name_editable;
                }
                else
                    node.name_editable = true;


                if (ntype == 'question' || ntype == 'vocab') {
                    delete node._has_compulsory;
                }
                else
                    node._has_compulsory = 1;

                if (ntype != 'vocab')
                    node._has_duration = 1;
                else
                    delete node._has_duration;

                node.editLink = '/' + ntype + '/update?id=' + node.id;
                node.deleteLink = '/' + ntype + '/delete?id=' + node.id;
                node.attachmentLink = '/' + ntype + '/update?id=' + node.id + "&_sand_step=attachments";
                node.updateNameLink = '/' + ntype + '/update?id=' + node.id + "&_sand_step=name";
            }
            if (ntype == 'video') {
                var video_icon = 'video_' + node.type;
                node['icon'] = Tree.gen_icon(video_icon);
            } else {
                node['icon'] = Tree.gen_icon(ntype);
            }
            Tree.tree[iid] = node;
        },
        //gen icon from ntype
        gen_icon: function (ntype) {
            var icon_list = {
                "video": "video-camera",
                "video_video": "video-camera",
                "video_pdf": "file-pdf-o",
                "video_ppt": "file-image-o",
                "video_text": "file-text",
                "sco": "folder",
                "syllabus": "book",
                "exercise": "star",
                "section": "folder",
                "vocabset": "tags",
                "question": "question-sign"
            };
            var icon = '<i class="fa fa-' + icon_list[ntype] + '"></i>';
            return icon;
        },
        //add (newly added) child iid to pid
        add_child: function (iid, pid) {
            //console.log('==================add_child======================', iid, pid);
            if (iid == 'end_intro_sticky') {
                Tree.get_node_end_intro_sticky();
            } else {
                var parent = Tree.get_node(pid, 1 /* with children*/);
                var child = Tree.get_node(iid);
            }
            parent.children = parent.children || [];
            parent.childrenIids = parent.childrenIids || [];
            parent.children.push(child);
            parent.childrenIids.push(iid);
            //console.log(parent.children);
            Tree.save_node(parent);
        },
        is_list: function (ntype) {
            var list = ['sco', 'syllabus', 'exercise', 'vocabset', 'koncept', 'path'];
            return list.indexOf(ntype) != -1;
        },
        //find the next sibling in the pid tree node
        next_sibling: function (pid, iid) {
            var node = Tree.get_node(pid, 1);
            var iidString = iid.toString;
            if ($.isNumeric(iid))
                iid = parseInt(iid);
            var i;
            var iid_next = '';
            if (typeof node.childrenIids != 'undefined'
                && node.childrenIids.length > 0) {
                i = node.childrenIids.indexOf(iid);
                if (i != -1 && i < node.childrenIids.length - 1) {
                    iid_next = node.childrenIids[i + 1];
                }

                i = node.childrenIids.indexOf(iidString);
                if (i != -1 && i < node.childrenIids.length - 1 && iid_next == '') {
                    iid_next = node.childrenIids[i + 1];
                }

                if ($(".question_wrapper[data-iid='" + iid_next + "']").is(":visible")) {
                    iid_next = Tree.next_sibling(pid, iid_next);
                }

                Test.current_question = iid_next;

                return iid_next;
            }
        },
        //find the next sibling in the pid tree node
        prev_sibling: function (pid, iid) {
            var node = Tree.get_node(pid, 1);
            if (typeof node.childrenIids != 'undefined'
                && node.childrenIids.length > 0) {
                var i = node.childrenIids.indexOf(iid);
                if (i != -1 && i > 0)
                    return node.childrenIids[i - 1];
                var i = node.childrenIids.indexOf(iid.toString());
                if (i != -1 && i > 0)
                    return node.childrenIids[i - 1];

            }
        },
        get_next_sibling: function (iid) {
            var pid = Tree.get_pid(iid);
            //console.log("get_next_sibling", pid, iid);
            return Tree.next_sibling(pid, iid);
        },

        get_node_end_intro_sticky: function () {
            return {
                iid: 0,
                name: '-------------------------------------------------------------------end_intro_sticky-------------------------------------------------------------------',
                ntype: 'end_intro_sticky',
                end_intro_sticky: 1
            }
        }
    };
});
