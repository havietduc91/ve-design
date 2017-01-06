(function ($) {
    "use strict";
    function main() {
        mobilecheck();
        mdselect();
        Learning();
        scrollStyle();

        //hide overlay play youtube in overview course
        $('.play-overview').click(function (e) {
            e.preventDefault();
            $(this).closest('div').hide();
        });


        $('.view-grid').on('click', function () {
            $('.categories-content .content').attr('class', 'content grid');
            $('.grid').addClass('fade-1');
            $('.list').removeClass('fade-2');
            $(this).addClass('active');
            $('.view-list').removeClass('active');
        });
        $('.view-list').on('click', function () {
            $('.categories-content .content').attr('class', 'content list');
            $('.list').addClass('fade-2');
            $('.grid').removeClass('fade-1');
            $(this).addClass('active');
            $('.view-grid').removeClass('active');
        });


        /*==============================
         Account info
         ==============================*/
        if (!Sand.utils.is_guest()) {
            var $toggleList = $('.list-account-info .list-item .toggle-list');
            $(document).on('click', 'html', function (e) {
                $toggleList.stop().removeClass('toggle-message-add');
                $('.list-account-info .item-click').stop().removeClass('active-ac');
            });

            $(document).on('click', '.list-account-info .list-item', function (event) {
                event.stopPropagation();
            });

            $(document).on('click', '.list-account-info .item-click', function (event) {
                if ($(this).hasClass('active-ac') == false) {
                    $('.list-account-info .item-click').removeClass('active-ac');
                    $toggleList.stop().removeClass('toggle-message-add');
                }
                $(this).toggleClass('active-ac');
                $(this).siblings('.toggle-list')
                    .stop()
                    .toggleClass('toggle-message-add');
            });
        }

        // $.each($('.content-bar'), function() {
        //     var widthList = $(this).find('li').outerWidth(),
        //         totalList = $(this).find('li').length;
        //     $(this).find('ul').width(widthList * totalList + 20);
        // });


        /*==============================
         PROGRESS BAR
         ==============================*/
        $('.current-progress').appear(function () {
            $('.current-progress .progress-run').addClass('progress-run-add');
            var percent = $('.current-progress .count').text();
            $('.progress-run-add').width(percent);
        });


        /*==============================
         PERCENT LEARN
         ==============================*/
        $('.percent-learn').appear(function () {
            $(this)
                .siblings('.percent-learn-bar')
                .find('.percent-learn-run')
                .addClass('percent-learn-run-add');
            var percentLearn = $(this).text();
            var context = $(this).siblings('.percent-learn-bar').find('.percent-learn-run-add');
            context.width(percentLearn);
        });


        /*==============================
         CHECKOUT
         ==============================*/
        var current_fs, next_fs, previous_fs;
        var left, opacity, scale;
        var animating;
        $(".form-checkout .next").on('click', function () {
            if (animating) return false;
            animating = true;

            current_fs = $(this).closest('fieldset');
            next_fs = $(this).closest('fieldset').next();

            $(".form-checkout #bar li").eq($("fieldset").index(next_fs)).addClass("active");

            //show the next fieldset
            next_fs.show();
            //hide the current fieldset with style
            current_fs.animate({opacity: 0}, {
                step: function (now, mx) {
                    left = (now * 50) + "%";
                    opacity = 1 - now;
                    current_fs.css({'opacity': '0'});
                    next_fs.css({'left': left, 'opacity': opacity});
                },
                duration: 800,
                complete: function () {
                    current_fs.hide();
                    animating = false;
                },
                //this comes from the custom easing plugin
                easing: 'easeInOutBack'
            });
        });

        $(".submit").on('click', function () {
            return false;
        });
        formCheckoutCal();

        $('#page-wrap').append('<div class="overlayForm"></div>');
        // $('.take-this-course').on('click', function() {
        //     $('.form-checkout, .overlayForm').fadeIn(400);
        //     return false;
        // });

        $('.closeForm').on('click', function () {
            $('.form-checkout, .overlayForm').fadeOut(400);
        });
        $('.closeForm').click();

        /*==============================
         TABS STYLE LINE
         ==============================*/
        if ($('.nav-tabs').length > 0) {
            $.each($('.nav-tabs'), function () {
                var tabs = $(this);
                if (tabs.find('.active').length > 0) {
                    var tabsItem = $(this).find('a'),
                        leftActive = tabs.find('.active').children('a').position().left,
                        widthActive = tabs.find('.active').children('a').width();
                    $('.tabs-hr').css({
                        left: leftActive,
                        width: widthActive
                    });
                    tabsItem.on('click', function () {
                        var left = $(this).position().left,
                            width = $(this).width();
                        $('.tabs-hr').animate({
                            left: left,
                            width: width
                        }, 500, 'easeInOutExpo');
                    });
                }
            });
        }

        /*==============================
         FOOTER STYLE 2
         ==============================*/
        var $footerStyle2 = $('footer#footer.footer-style-2'),
            heightFooter = $footerStyle2.height();
        $footerStyle2.appendTo('body');
        $footerStyle2.siblings('#page-wrap').css('marginBottom', heightFooter);


        $('.question-sidebar ul, .list-message, .list-notification').wrap('<div class="list-wrap"></div>');
    }

    /*==============================
     Mobile check
     ==============================*/
    function mobilecheck() {
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            return false;
        }
        return true;
    }

    function formCheckoutCal() {
        var heightWindow = $(window).height(),
            heightForm = $('.form-checkout .container').height(),
            formMiddle = (heightWindow - heightForm) / 2;
        $('.form-checkout').css('top', formMiddle);
        $('.form-checkout .form-body').height($(".form-checkout fieldset").height());
    }

    /*==============================
     MC SELECT
     ==============================*/
    function mdselect() {
        $('.mc-select').find('select.select').each(function () {
            var selected = $(this).find('option:selected').text();
            $(this)
                .css({'z-index': 10, 'opacity': 0, '-khtml-appearance': 'none'})
                .after('<span class="select">' + selected + '</span>' + '<i class="fa fa-angle-down"></i>')
                .change(function () {
                    var val = $('option:selected', this).text();
                    $(this).next().text(val);
                });
        });
    }

    /*==============================
     Learning
     ==============================*/
    function Learning() {
        var $navListBody = $('.top-nav-list').find('.list-item-body');
        var width = $navListBody.closest('.top-nav-list').width() - 1;

        if ($('#top-nav-list').length > 0)
            width = $(window).width() - $('#top-nav-list').offset().left;
        $navListBody.width(width);
        if ($('.top-nav-list').children('li').hasClass('active')) {
            $('.learning-section')
                .toggleClass('learning-section-fly')
                .css('paddingRight', width);
        }
        $('.top-nav-list').find('.search-dictionary, .outline-learn, .discussion-learn, .note-learn').on('click', '.list-item-course', function (e) {
            e.preventDefault();
            var li_parent = $(this).closest('li');
            if (li_parent.hasClass('search-dictionary')) {
                $('#search-page-course').focus();
            }
            if ($(this).parent().hasClass('active') == false) {
                $('.top-nav-list').children('li').removeClass('active');
            }
            $(this).parent().toggleClass('active');
            if ($(this).parent().hasClass('active')) {
                $('.learning-section')
                    .toggleClass('learning-section-fly')
                    .css('paddingRight', width);
                // if(CourseView.play_video.display_full) {
                //     $('#blackboard-left').attr('class', 'col-md-8');
                //     CourseView.auto_resize_video();
                // }
            } else {
                $('.learning-section')
                    .removeClass('learning-section-fly')
                    .css('paddingRight', '0');
                // if(CourseView.play_video.display_full) {
                //     $('#blackboard-left').attr('class', 'col-md-12');
                //     CourseView.auto_resize_video();
                // }
            }

        });
        $('.top-nav-list').mouseenter(function () {
            $('.top-nav-list').addClass('is-hover');
        })
            .mouseleave(function () {
                $('.top-nav-list').removeClass('is-hover');
            });


        $('html').on('click', function () {
            if (Sand.utils.is_mobile()) {
                if ($('.top-nav-list').hasClass('is-hover') == false) {
                    $navListBody.removeClass('item-fly');
                    $navListBody.parent('li').removeClass('active');
                    $('.learning-section')
                        .removeClass('learning-section-fly')
                        .css('paddingRight', '0');
                }
            }
        });
        // $('.top-nav-list, .list-item-body').on('click', function (event) {
        // event.stopPropagation();
        // });
    }

    function setHeightRespon() {
        var height = 67;
        if ($('.navbar-fixed-top').length) {
            height = $('.navbar-fixed-top').height();
        }

        var widthWindow = window.innerWidth
            || document.documentElement.clientWidth
            || document.body.clientWidth;

        $('.navbar-fixed-top .header-contact').css({
            'min-width': widthWindow + 'px'
        });

        $('.footer .footer_content > img').css({
            'height': widthWindow / 15 + 'px'
        });
        var windowHeight = $(window).height() - height,
            w = window.innerWidth;

        $('#myNavbar').css({
            'max-height': windowHeight + 'px'
        });

        $('.on-mobile').css({
            'margin-top': height
        });
        $('.learn-section').css('min-height', windowHeight);

        if (w < 992) {
            $('.question-content-wrap').find('.question-sidebar').height('auto');
            $('.question-content-wrap').find('.score-sb').find('.list-wrap').height('auto').css('max-height', '300px');
        } else if (w >= 992) {
            // var height = $('#blackboard-left').height() + 30;
            // var height = $('.question-content-wrap').find('.question-content').height() + 30;
            // var heightUl = height - 90;
            // $('.question-content-wrap').find('.score-sb').find('.list-wrap').height(heightUl).css('max-height', 'none');
            // $('.question-content-wrap').find('.question-sidebar').height(height);
        }
    }

    /*==============================
     SET HEIGHT MESSAGE SB
     ==============================*/
    function setHeightMessagesb() {
        if ($('.list-item-body').length) {
            var heightlist = $(window).height() - $('.list-item-body').css('margin-top').split('px')[0];
            $('.list-item-body').height(heightlist);
        }
    }


    /*==============================
     SCROLL STYLE
     ==============================*/
    function scrollbar() {
        var $scrollbar = $('.question-sidebar .list-wrap, .messages .list-wrap, .message-sb .list-wrap, .notification .list-wrap, .list-item-body, .table-wrap .tbody');
        $scrollbar.perfectScrollbar({
            maxScrollbarLength: 150,
        });
        $scrollbar.perfectScrollbar('update');

        $('.content-bar').perfectScrollbar({
            maxScrollbarLength: 150,
            suppressScrollY: true,
            useBothWheelAxes: true,
        });
        $('.content-bar').perfectScrollbar('update');
    }

    function scrollStyle() {
        scrollbar();
        $(window).on('load', function () {
            if (($('.content-bar').length > 0) && ($('.content-bar').find('.current').length > 0)) {
                var currentPosition = $('.content-bar').find('.current').position().left;
                var prevCurrentWidth = $('.content-bar').find('.current').prev().width();
                setTimeout(function () {
                    $('.content-bar').animate({
                        scrollLeft: currentPosition - prevCurrentWidth
                    }, 400);
                }, 100);
            }
        });
    }

    /*
     function uploadFile() {
     $('.up-file').delegate('a', 'click', function(e) {
     e.preventDefault();
     $(this).siblings('input[type="file"]').trigger('click');
     });
     $('.up-file').delegate('input[type="file"]', 'change', function() {
     var nameFile = $(this).val().replace(/\\/g, '/').replace(/.*\//, '');
     $(this).siblings('input[type="hidden"]').val(nameFile);
     readURL(this);
     });
     function readURL(input) {
     if (input.files && input.files[0]) {
     var reader = new FileReader();
     reader.onload = function (e) {
     $('.changes-avatar')
     .find('img')
     .attr('src', e.target.result)
     .width(140);
     };
     reader.readAsDataURL(input.files[0]);
     }
     }
     }
     */


    /*==========  Slider Home ==========*/
    function SliderHome() {
        if ($('#slide-home').length && (typeof owlCarousel != 'undefined')) {
            $('#slide-home').owlCarousel({
                autoPlay: 10000,
                navigation: false,
                pagination: true,
                singleItem: true,
                mouseDrag: false,
                addClassActive: true,
                transitionStyle: 'fade'
            });
        }
    }

    /*==========  Resize Slider Home ==========*/
    function ResizeSliderHome() {
        if ($('#slide-home')) {
            var parentWidth = $('.slide-cn').innerWidth(),
                imgWidth = $('.item-inner').width(),
                imgHeight = $('.item-inner').height(),
                scale = parentWidth / imgWidth,
                ratio = imgWidth / imgHeight,
                heightItem = parentWidth / ratio;

            $('.slide-item').css({'height': heightItem});

            if ($(window).width() <= 1200) {

                $('.item-inner').css({
                    '-webkit-transform': 'scale(' + scale + ')',
                    '-moz-transform': 'scale(' + scale + ')',
                    '-ms-transform': 'scale(' + scale + ')',
                    'transform': 'scale(' + scale + ')'
                });

            } else {

                $('.item-inner').css({
                    '-webkit-transform': 'scale(1)',
                    '-moz-transform': 'scale(1)',
                    '-ms-transform': 'scale(1)',
                    'transform': 'scale(1)'
                });

            }
        }
    }


    $(document).ready(function () {
        main();
        setHeightRespon();
        //uploadFile();
        setHeightMessagesb();
        scrollbar();
        $('.nav-tabs').wrap('<div class="nav-tabs-wrap"></div>');

        if (window.innerWidth < 1200) {
            $(document).on('click', '.menu-item-has-children > a', function (evt) {
                evt.preventDefault();
                $(this).next().slideToggle(300);
                $(this).toggleClass('mobile-active');
            });
            $(document).on('click', '#mb-open-menu ', function () {
                if ($('#mb-open-search').hasClass('toggle-active')) {
                    $('#mb-open-search').removeClass('toggle-active');
                    $('.navigation .search-box').hide();
                }

                $(this).toggleClass('toggle-active');
                $('.navigation .menu').slideToggle(300);
            });
            $(document).on('click', '#mb-open-search', function () {
                if ($('#mb-open-menu').hasClass('toggle-active')) {
                    $('#mb-open-menu').removeClass('toggle-active');
                    $('.navigation .menu').hide();
                }
                $(this).toggleClass('toggle-active');
                $('.navigation .search-box').slideToggle(100);
            });

            $(document).on('click', 'html', function () {
                $('.navigation').find('.toggle-active').removeClass('toggle-active');
                $('.navigation .menu').slideUp(300);
                $('.navigation .search-box').slideUp(100);
            });

            $(document).on('click', '.navigation .menu, #mb-open-menu, .search-box, #mb-open-search', function () {
                evt.stopPropagation();
            });
        }
    });
    $(window).load(function () {
        ResizeSliderHome();
    });

    $(window).on('resize', function () {
        setHeightRespon();
        setHeightMessagesb();
        scrollbar();
        SliderHome();
        formCheckoutCal();
        ResizeSliderHome();
    }).trigger('resize');
    ;

    $('.quick-link-lession').click(function (e) {
        var dataLink = $(this).attr('data-link');
        window.location.href = dataLink;
    });

    $('#view-full-content').click(function (e) {
        var check = $('.vm-vb-open').hasClass('active');
        if (check) {
            $('.vm-vb-open').removeClass('active');
            $('.vm-vb-close').addClass('active');
            $('.tab-content-body').addClass('active');
        } else {
            $('.vm-vb-open').addClass('active');
            $('.vm-vb-close').removeClass('active');
            $('.tab-content-body').removeClass('active');
        }

        e.preventDefault();
    });
})(jQuery);