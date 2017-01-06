(function ($) {
    $(document).ready(function () {
        // $(this).autoMenuRight();
        // $(this).autoHidenLogo();
        var exRank;
        $('.overview-vote').mouseover(function () {
            var exThis = $(this);
            exRank = exThis.attr('data-rank');
            var rankValue;
            $('.overview-vote').removeClass('active');
            $.each($('.overview-vote'), function (i, e) {
                if (i <= exRank) {
                    $('a[data-rank="' + i + '"]').addClass('active');
                }
            });
            exRank++;
            $('#overview-vote').val(exRank);
        });
        $('.overview-vote').click(function (e) {
            e.preventDefault();
            Sand.ajax.ajax_request({
                url: "/tracker?a=vote",
                data: {
                    ciid: Edx.course_iid,
                    s: exRank,
                },
                success: function (json) {
                }
            });
        });

        $('.overview-redirect-lession').click(function (e) {
            var l = $(this).attr('data-link');
            e.preventDefault();
            window.location.href = l;
        });

        //Check to see if the window is top if not then display button
        $(window).scroll(function () {
            if ($('#scrollToTop').length > 0) {
                if ($(this).scrollTop() > 100) {
                    $('.scrollToTop').fadeIn();
                } else {
                    $('.scrollToTop').fadeOut();
                }
            }
        });

        //Click event to scroll to top
        $('#overview-scroll-top').click(function () {
            $('html, body').animate({scrollTop: 0}, 800);
            return false;
        });

        $(this).trackingOverView();
        // $(window).resize(function() {
        // var msc = $(window).scrollTop();
        // console.log(msc);
        // $(this).fixHeightWidthCourseTitle();
        // });
        $(window).on('load', function () {
            $(this).fixHeightWidthCourseTitle();
            $(this).fixSearchScrollHeight();
        });

        $(this).fixHeightWidthCourseTitle();
        $(this).fixHeightCourseContent();
        $(this).xpeak_helper();

        $('#load-more-footer').click(function (e) {
            $('#info-more-footer').toggle();
            e.preventDefault();
        });
        User.populate_dynamic_info();
        $('#hv-link-dashboard').click(function (e) {
            if (Sand.utils.is_guest()) {
                e.preventDefault();
                window.location.href = '/private';
            }
        });

        $('.page-support .tab-select').click(function (e) {
            var $this = $(this);
            var id = $this.attr('data-tab');
            var title = $this.attr('data-title');

            // if(id == 'contact' && Sand.page != 'page/index/contact') {
            // 	window.location.href = "/page/contact";
            // }

            $('.page-support .menu-left').find('.tab-select').removeClass('active');
            $this.addClass('active');

            $('.page-support').find('.tab-content').removeClass('active');
            $('#' + id).addClass('active');
            $('#title-header').html(title);
            e.preventDefault();
        });

        if (Sand.page == 'page/index/support') {
            $('li[data-tab="support"]').trigger('click');
        }

        if (Sand.page == 'page/index/policy') {
            $('li[data-tab="policy"]').trigger('click');
        }

        if (Sand.page == 'page/index/contact') {
            $('li[data-tab="contact"]').trigger('click');
        }
    });

    $.fn.fixSearchScrollHeight = function () {
        $viewPort = $(this).getDeviceViewPort();

        $('.scroll-search-form').attr('height', $viewPort[1] - 100);
    }

    $.fn.getDeviceViewPort = function () {
        var viewPortWidth;
        var viewPortHeight;

        // the more standards compliant browsers (mozilla/netscape/opera/IE7) use window.innerWidth and window.innerHeight
        if (typeof window.innerWidth != 'undefined') {
            viewPortWidth = window.innerWidth,
                viewPortHeight = window.innerHeight
        }

        // IE6 in standards compliant mode (i.e. with a valid doctype as the first line in the document)
        else if (typeof document.documentElement != 'undefined'
            && typeof document.documentElement.clientWidth !=
            'undefined' && document.documentElement.clientWidth != 0) {
            viewPortWidth = document.documentElement.clientWidth,
                viewPortHeight = document.documentElement.clientHeight
        }

        // older versions of IE
        else {
            viewPortWidth = document.getElementsByTagName('body')[0].clientWidth,
                viewPortHeight = document.getElementsByTagName('body')[0].clientHeight
        }

        return [viewPortWidth, viewPortHeight];
    }

    $.fn.xpeak_helper = function () {
        $(document).on('click', '#xpeak-helper-button', function (e) {
            $('#wrap-xpeak-helper').toggle();
            e.preventDefault();
        });
    }

    $.fn.fixHeightCourseContent = function () {
        // if(Sand.utils.is_mobile()){
        // 	$('#blackboard-left').css({'min-height': 0 + 'px'});
        // }else{
        // var height = $(window).height();
        // var height_top = $('#top-nav-course').height();
        // var height_check_question = $('#check-answer-question-fixed').height();
        // var min_height = height - height_top - height_check_question;
        // var min_height = $('#blackboard-wrap').height() - 140;
        // $('#blackboard-left').css({'min-height': min_height + 'px'});
        // }
    }

    $.fn.trackingOverView = function () {
        if ($('#course-overview-user'.length > 0)) {
            var tcos = [];
            $.each($('[data-tco]'), function (e, i) {
                tcos.push($(this).data('tco'));
            });
            if (tcos.length > 0) {
                Tracker.get_tracking(tcos);
            }
        }
    }

    // $.fn.autoHidenLogo = function(){
    // 	if($('body').width() < 760) {
    // 		var mywindow = $(window);
    // 		var mypos = mywindow.scrollTop();
    // 		mywindow.scroll(function() {
    // 			if(mywindow.scrollTop() > mypos)
    // 			{
    // 				$('.autohide').hide();
    // 				$(this).autoMenuRight();
    // 			}
    // 			else
    // 			{
    // 				$('.autohide').show();
    // 				$(this).autoMenuRight();
    // 			}
    // 			mypos = mywindow.scrollTop();
    // 		});
    // 	}
    // }

    $.fn.autoMenuRight = function () {
        // if($('.list-item-body').length > 0)
        // {
        // 	var h0 = $(window).height();
        // 	var	h1 = $('.top-nav').height();
        // 	var h2 = h0 + h1;
        //$('.list-item-body').css({"margin-top" : h1+"px", "height" : h2+"px"});
        // }
    }

    $.fn.fixHeightWidthCourseTitle = function () {
        // var mywindow = $(window).width();
        // if((mywindow > 767) && (mywindow < 1024)) {
        // 	var menu_width = $('#top-nav-list').width();
        // 	var title_width = mywindow - 420;
        // 	$('.size-course-top').css({"width" : title_width+"px"});
        // } else if(mywindow >= 1024) {
        // 	// alert(mywindow);
        // 	var menu_width = $('#top-nav-list').width();
        // 	var title_width = mywindow - 420;
        // 	$('.size-course-top').css({"width" : title_width+"px"});
        // } else if(mywindow < 767) {
        // 	var menu_width = $('#top-nav-list').width();
        // 	var title_width = mywindow - menu_width;
        // 	$('.size-course-top').css({"width" : title_width+"px"});
        // }

    }

})(jQuery)