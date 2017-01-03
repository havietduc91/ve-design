var flgSecondary = 0;
var flgHigh = 0;
function secondary() {
  if(flgHigh==1){
    $("#secondary").addClass('viewed');
    $("#high").removeClass('viewed');
    $(".secondary-school").removeClass('secondary-school-hide');
    $(".high-school").removeClass('high-school-show');
    flgHigh--;
  }
}
function high() {
  if(flgHigh==0){
    $("#secondary").removeClass('viewed');
    $("#high").addClass('viewed');
    $(".secondary-school").addClass('secondary-school-hide');
    $(".high-school").addClass('high-school-show');
    flgHigh++;
  }
}
$(document).ready(function() {
  $("#owl-demo").owlCarousel({

    navigation : true,
    slideSpeed : 300,
    paginationSpeed : 400,
    singleItem : true

    // "singleItem:true" is a shortcut for:
    // items : 1,
    // itemsDesktop : false,
    // itemsDesktopSmall : false,
    // itemsTablet: false,
    // itemsMobile : false

  });
});
$(function(){
  $('.crsl-items').carousel({
    visible: 4,
    itemMinWidth: 275,
    itemEqualHeight: 400,
    itemMargin: 20,
  });

  $("a[href=#]").on('click', function(e) {
    e.preventDefault();
  });
});
var flgMenu =0;
function menu() {
  if(flgMenu==0){
    $('.menu-responsive-click').animate({
      'marginRight': "+=90%" //moves right
    });
    flgMenu++;
  }else if(flgMenu==1){
    $('.menu-responsive-click').animate({
      'marginRight': "-=90%" //moves right
    });
    flgMenu--;
  }
}