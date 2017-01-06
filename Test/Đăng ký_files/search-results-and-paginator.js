var AdminSearch;
$(document).ready(function () {
    AdminSearch = {
        defaults: {
            items_per_page: 10
        },
        /*
         json is the full object returned from server:
         {
         success : true,
         result : [{}] //list of rows
         objects : {
         count : x,
         total : x
         }
         }
         we need to slice it based on perPage & page to return
         the corresponding json.result & json.objects.count

         */
        slice: function (json, perPage, page) {
            perPage = parseInt(perPage);
            page = parseInt(page);

            if (json.result.length > 0) {
                if (perPage != -1) {
                    ret = json.result.slice((page - 1) * perPage, page * perPage);
                    json.result = ret;
                    json.objects.count = perPage;
                }
                else {
                    json.objects.count = json.result.length;
                }
            }

            return json;
        },

        //default search form id
        //e.g '#syllabus_form_search'
        formId: function (mod) {
            return mod + '_form_search';
        },

        storage_key: function (t, m) {
            m = m.replace('|', '_');
            m = m.replace('-', '_');
            var ret = "search_" + t + "_" + m;
            return ret;
        },

        populate_results_and_pagination: function (resultSel, //#mainstage
                                                   template, //syllabus|search-results
                                                   //sitex|search-results where you have pagination
                                                   //which looks like this {{{results}}} {{{pagination}}}
                                                   resultsAndPaginationWrapperTemplate,
                                                   paginationTemplate, //sitex|pagination
                                                   perPage, //items per page
                                                   page, // current page number
                                                   formId,
                                                   json, //json returned by server
                                                   paginateFrontend //if true => we're doing frontend pagination, meaning we will
                                                   //have the whole list already available and we have to slice the data here
        ) {
            if (paginateFrontend) {
                //we have to check the list of items here and slice the results
                if (json.objects.count > 0) {
                    json = AdminSearch.slice(json, perPage, page);
                }
            }

            //console.log('populate_results_and_pagination', perPage, page, json);
            Sand.load_templates([paginationTemplate, template], function () {

                //pagination html
                var pagination = AdminSearch.pagination_html(
                    paginationTemplate,
                    perPage,
                    page,
                    formId,
                    json);

                //search results html
                var results = AdminSearch.results_html(template, json);
                //render html and set to resultSel
                Sand.load_templates([resultsAndPaginationWrapperTemplate], function () {
                    //alert(Sand.get_template(resultsAndPaginationWrapperTemplate));
                    var html = Sand.template.render(
                        Sand.get_template(resultsAndPaginationWrapperTemplate),
                        {
                            pagination: pagination,
                            results: results
                        });
                    // console.log(html);
                    setTimeout(function () {
                        Sand.set_html(resultSel, html, true);
                    }, 100);
                });
            });
        },


        results_html: function (template, json) {
            //results
            var results;

            if (typeof json.objects != 'undefined' &&
                typeof json.objects.count != 'undefined' &&
                parseInt(json.objects.count) > 0
            ) {
                if (json.result)
                    json.result = AdminSearch.add_status_for_mustache(json.result);
                results = Sand.template.render(
                    Sand.get_template(template),
                    json);
            }
            if (typeof results == 'undefined')
                results = Sand.template.render(Sand.get_template('sitex|no-match-found'));

            return results;
        },

        pagination_html: function (paginationTemplate,
                                   perPage,
                                   page,
                                   formId,
                                   json) {

            var range = 3;
            var total, count, nrOfPages;
            if (typeof json.objects != 'undefined' &&
                typeof json.objects.total != 'undefined') {
                total = parseInt(json.objects.total);
            } else {
                total = 0;
            }

            if (typeof json.objects != 'undefined' &&
                typeof json.objects.count != 'undefined') {
                count = parseInt(json.objects.count);
            } else {
                count = 0;
            }

            var paginationList = [];

            nrOfPages = Math.floor((total - 1) / perPage) + 1;
            if (page - range > 1) {
                paginationList.push({
                    'page': 1,
                    'label': 'First',
                    'first': 1
                });
                paginationList.push({
                    'page': page - 1,
                    'label': 'Prev',
                    'prev': 1
                });
            }

            for ($i = page - range; $i <= page + range; $i++) {

                if ($i <= 0 || $i > nrOfPages) {
                    continue;
                }

                if ($i == 1) {
                    $l = 1;
                } else {
                    $l = $i;
                }
                if ($i == page) {
                    paginationList.push({
                        klass: "active",
                        label: $i,
                        page: page
                    });
                } else {
                    paginationList.push({
                        page: $l,
                        label: $i
                    });
                }
            }

            if ((page + range) < nrOfPages) {
                paginationList.push({
                    page: page + 1,
                    label: 'next',
                    next: 1
                });
                paginationList.push({
                    page: nrOfPages,
                    label: 'last',
                    last: 1
                });
            }

            //we're at page 2, finding 20 items per page, found only total 19
            if ((page - 1) * perPage > total) {
                paginationList.push({
                    page: page,
                    label: page,
                    klass: "disabled"
                });
            }

            if (paginationList.length == 1) //only 1
                paginationList = null;

            return Sand.template.render(
                Sand.get_template(paginationTemplate),
                {
                    items_per_page: AdminSearch.items_per_page(perPage),
                    list: paginationList,
                    formId: formId,
                    nrOfPages: nrOfPages,
                    perPage: perPage,
                    total: total
                });
        },

        items_per_page: function (perPage) {
            var configs = [10, 20, 30, 50, 100];
            var ret = [];
            $.each(configs, function (i, value) {
                if (value == perPage) {
                    ret.push({
                        value: value,
                        selected: "selected"
                    });
                }
                else
                    ret.push({
                        value: value
                    });
            });

            return ret;
        },

        add_status_for_mustache: function (ret) // + progress courses
        {
            //hackish
            //insert queued/published status
            for (var i in ret) {
                var obj = ret[i];
                {
                    if (obj.status == 'queued')
                        obj.status_queued = true;
                    if (obj.status == 'published' ||
                        obj.status == 'approved')
                        obj.status_published = true;
                    if (typeof obj.progress_algorithm !== 'undefined' && obj.progress_algorithm == 2) {
                        obj.progress_weighted = true;
                    } else {
                        obj.progress_simple = true;
                    }
                }
                ret[i] = obj;
            }
            return ret;
        }
    };

    /**
     * All callbacks
     */
    Sand.callbacks = $.extend(Sand.callbacks, {
        display_item_mustache: function ($el, json, params) {
            //take json.result, populate to the $el.data('template');
            //and pop results into modal
        },
        // This is used in side menu like
        // data-sand-as="search_form"
        search_form: function ($el, json, params) {
            console.log($el, json, params);
            //Display
            var sel = params[1]; //#mainstage
            var mod = params[0]; // syllabus
            var step = params[2] || ''; // step search
            //Load all the templates

            var template = mod + "|search-results";

            // sitex|pagination
            var paginationTemplate = $el.data('pagination-template') || 'sitex|pagination';

            //form HTML
            var searchFormData = Sand.localStorage.getItem(AdminSearch.storage_key('form', template), false, true);
            searchFormData._sand_step = "";
            if (!searchFormData || typeof searchFormData.page == 'undefined') {
                searchFormData = {
                    items_per_page: 10,
                    page: 1
                };
            }
            searchFormData._sand_step = step;
            var json;
            if (typeof step == 'undefined' || step != 'exam') {
                json = Sand.localStorage.getItem(AdminSearch.storage_key('json', template), false, true);
            }

            if (!json) {
                json = {
                    objects: {
                        total: 0,
                        count: 0
                    },
                    result: []
                };
            }

            if (typeof searchFormData.items_per_page == 'undefined') {
                searchFormData.items_per_page = 10;
            }

            if (typeof searchFormData.page == 'undefined') {
                searchFormData.page = 1;
            }

            var formTemplate = mod + "|search-form";

            var formHtml = Sand.template.render(
                Sand.get_template(formTemplate), searchFormData
            );

            var formId = AdminSearch.formId(mod);
            //pagination
            var pagination = AdminSearch.pagination_html(
                paginationTemplate,
                searchFormData.items_per_page,
                searchFormData.page,
                formId,
                json);

            //search results
            var results = AdminSearch.results_html(template, json);

            var html = Sand.template.render(
                Sand.get_template('sitex|search'),
                {
                    form: formHtml,
                    pagination: pagination,
                    results: results,
                    formId: AdminSearch.formId(mod)
                });


            Sand.set_html(sel, html);
        },

        //normally search form is on the right. But we only display search form
        // if the number of the results matched are higher than total
        init_search_form: function ($el, json, params) {

            if (typeof json != 'undefined' && typeof json.success != 'undefined' && !json.success) {
                return;
            }
            var sel;
            if (params && params[0])
                sel = params[0];
            else {
                sel = "#search-form,#bank_form_search,#teacher-search-form,#organization_form_search,#search-form-category," +
                    "#card_search_detail2, #school_form_search, #report-user-learn, #search-users-import," +
                    " #school_form_searchstudents, #form_search_offline_classes, #translate_form_search";
            }

            setTimeout(function () {
                //TODO: Populate storage Data;
                if ($(sel).find("[name='submit']").length)
                    $(sel).find("[name='submit']")[0].click();
            }, 10)
        },

        //refress category by menu active

        refresh_all_data_edit: function ($el, json, params) {
            $("#teacher-submenu ul li.active  > a")[0].click();
        },

        //search form
        populate_search_result: function ($el, json, params) {
            // syllabus||search-results
            var template, paginationTemplate, resultSel, perPage, page, resultsAndPaginationWrapperTemplate;
            template = json.template_display || $el.data('template');

            // sitex|pagination
            if (typeof json.pagination_template != 'undefined' && json.pagination_template) {
                paginationTemplate = json.pagination - template;
            } else {
                paginationTemplate = $el.data('pagination-template') || 'sitex|pagination';
            }
            resultsAndPaginationWrapperTemplate = $el.data('results-wrap-template') || 'sitex|search-results';
            // #syllabus_form_search_result
            resultSel = $el.data('displayer') || '#' + $el.attr('id') + '_result';
            if ($el.prop('tagName') == 'FORM') {
                perPage = parseInt($el.find("[name='items_per_page']").val());
                page = parseInt($el.find("[name='page']").val() || 1);
            }
            else //anchor
            {
                perPage = parseInt($el.data("items_per_page" || AdminSearch.defaults.items_per_page));
                page = parseInt($el.data('page') || 1);
            }

            if (json.success) {
                Sand.searchResults = json.result;
            }

            //store shit to localstorage
            //var tmp = template.split('|');
            if (typeof json.objects.is_exam == 'undefined' || !json.objects.is_exam) {
                Sand.localStorage.setItem(AdminSearch.storage_key('json', template), json, true);
                var formData = Sand.form.get_xform_data($el);
                Sand.localStorage.setItem(AdminSearch.storage_key('form', template), formData, true);
            }

            var formId = $el.data('id') || $el.attr('id');

            AdminSearch.populate_results_and_pagination(
                resultSel,
                template,
                resultsAndPaginationWrapperTemplate,
                paginationTemplate,
                perPage,
                page,
                formId,
                json,
                $el.data('paginatefrontend')
            );
        },
    });
});
