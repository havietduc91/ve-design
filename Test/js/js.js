var flgA1a = 0;
var flgA1b = 0;
var flgA1c = 0;
var flgA1d = 0;
function answer1a() {
  //check if other answer is selected so hide
  if (flgA1b == 1) {
    $("#answer1b").removeClass("selected");
    flgA1b--;
  }
  if (flgA1c == 1) {
    $("#answer1c").removeClass("selected");
    flgA1c--;
  }
  if (flgA1d == 1) {
    $("#answer1d").removeClass("selected");
    flgA1d--;
  }
  //Checked True - False this answer
  if (flgA1a == 0) {
    if (flgT1 == 0) {
      if (flgD1 == 0) {
        $("#status1").addClass("doing");
        flgD1++;
      }
    }
    $("#answer1a").addClass("selected");
    flgA1a++;
  }
  else if (flgA1a == 1) {
    $("#answer1a").removeClass("selected");
    $("#status1").removeClass("choosen");
    if (flgD1 == 1) {
      $("#status1").removeClass("doing");
      flgD1--;
    }
    flgA1a--;
  }
}
function answer1b() {
  //check if other answer is selected so hide
  if (flgA1a == 1) {
    $("#answer1a").removeClass("selected");
    flgA1a--;
  }
  if (flgA1c == 1) {
    $("#answer1c").removeClass("selected");
    flgA1c--;
  }
  if (flgA1d == 1) {
    $("#answer1d").removeClass("selected");
    flgA1d--;
  }
  //Checked True - False this answer
  if (flgA1b == 0) {
    if (flgT1 == 0) {
      if (flgD1 == 0) {
        $("#status1").addClass("doing");
        flgD1++;
      }
    }
    $("#answer1b").addClass("selected");
    flgA1b++;
  }
  else if (flgA1b == 1) {
    $("#answer1b").removeClass("selected");
    flgA1b--;
    $("#status1").removeClass("choosen");
    if (flgD1 == 1) {
      $("#status1").removeClass("doing");
      flgD1--;
    }
  }
}
function answer1c() {
  //check if other answer is selected so hide
  if (flgA1b == 1) {
    $("#answer1b").removeClass("selected");
    flgA1b--;
  }
  if (flgA1a == 1) {
    $("#answer1a").removeClass("selected");
    flgA1a--;
  }
  if (flgA1d == 1) {
    $("#answer1d").removeClass("selected");
    flgA1d--;
  }
  //Checked True - False this answer
  if (flgA1c == 0) {
    if (flgT1 == 0) {
      if (flgD1 == 0) {
        $("#status1").addClass("doing");
        flgD1++;
      }
    }
    $("#answer1c").addClass("selected");
    flgA1c++;
  }
  else if (flgA1c == 1) {
    $("#answer1c").removeClass("selected");
    $("#status1").removeClass("choosen");
    if (flgD1 == 1) {
      $("#status1").removeClass("doing");
      flgD1--;
    }
    flgA1c--;
  }
}
function answer1d() {
  //check if other answer is selected so hide
  if (flgA1b == 1) {
    $("#answer1b").removeClass("selected");
    flgA1b--;
  }
  if (flgA1c == 1) {
    $("#answer1c").removeClass("selected");
    flgA1c--;
  }
  if (flgA1a == 1) {
    $("#answer1a").removeClass("selected");
    flgA1a--;
  }
  //Checked True - False this answer
  if (flgA1d == 0) {
    if (flgT1 == 0) {
      if (flgD1 == 0) {
        $("#status1").addClass("doing");
        flgD1++;
      }
    }
    $("#answer1d").addClass("selected");
    flgA1d++;
  }
  else if (flgA1d == 1) {
    $("#answer1d").removeClass("selected");
    $("#status1").removeClass("choosen");
    if (flgD1 == 1) {
      $("#status1").removeClass("doing");
      flgD1--;
    }
    flgA1d--;
  }
}
var flgT1 = 0;
var flgD1 = 0;
function poser1() {
  if (flgD1 == 1) {
    $("#status1").removeClass("doing");
    if (flgT1 == 0) {
      $("#status1").addClass("tick");
      $("#question-box1").addClass("question-box-ticked");
      flgT1++;
    } else if (flgT1 == 1) {
      $("#status1").removeClass("tick");
      $("#question-box1").removeClass("question-box-ticked");
      $("#status1").addClass("doing");
      flgT1--;
    }
  } else if (flgD1 == 0) {
    if (flgT1 == 0) {
      $("#status1").addClass("tick");
      $("#question-box1").addClass("question-box-ticked");
      flgT1++;
    } else if (flgT1 == 1) {
      $("#status1").removeClass("tick");
      $("#question-box1").removeClass("question-box-ticked");
      flgT1--;
    }
  }
}
$('html').click(function (e) {
  //if clicked element is not your element and parents aren't your div
  if ((e.target.id != 'answer1a' && $(e.target).parents('#answer1a').length == 0) && (e.target.id != 'answer1b' && $(e.target).parents('#answer1b').length == 0) && (e.target.id != 'answer1d' && $(e.target).parents('#answer1d').length == 0) && (e.target.id != 'answer1c' && $(e.target).parents('#answer1c').length == 0)) {
    if (flgD1 == 1) {
      $("#status1").removeClass("doing");
      $("#status1").addClass("choosen");
      flgD1--;
    }
  }
});
var flgA2a = 0;
var flgA2b = 0;
var flgA2c = 0;
var flgA2d = 0;
function answer2a() {
  //check if other answer is selected so hide
  if (flgA2b == 1) {
    $("#answer2b").removeClass("selected");
    flgA2b--;
  }
  if (flgA2c == 1) {
    $("#answer2c").removeClass("selected");
    flgA2c--;
  }
  if (flgA2d == 1) {
    $("#answer2d").removeClass("selected");
    flgA2d--;
  }
  //Checked True - False this answer
  if (flgA2a == 0) {
    if (flgT2 == 0) {
      if (flgD2 == 0) {
        $("#status2").addClass("doing");
        flgD2++;
      }
    }
    $("#answer2a").addClass("selected");
    flgA2a++;
  }
  else if (flgA2a == 1) {
    $("#answer2a").removeClass("selected");
    $("#status2").removeClass("choosen");
    if (flgD2 == 1) {
      $("#status2").removeClass("doing");
      flgD2--;
    }
    flgA2a--;
  }
}
function answer2b() {
  //check if other answer is selected so hide
  if (flgA2a == 1) {
    $("#answer2a").removeClass("selected");
    flgA2a--;
  }
  if (flgA2c == 1) {
    $("#answer2c").removeClass("selected");
    flgA2c--;
  }
  if (flgA2d == 1) {
    $("#answer2d").removeClass("selected");
    flgA2d--;
  }
  //Checked True - False this answer
  if (flgA2b == 0) {
    if (flgT2 == 0) {
      if (flgD2 == 0) {
        $("#status2").addClass("doing");
        flgD2++;
      }
    }
    $("#answer2b").addClass("selected");
    flgA2b++;
  }
  else if (flgA2b == 1) {
    $("#answer2b").removeClass("selected");
    flgA2b--;
    $("#status2").removeClass("choosen");
    if (flgD2 == 1) {
      $("#status2").removeClass("doing");
      flgD2--;
    }
  }
}
function answer2c() {
  //check if other answer is selected so hide
  if (flgA2b == 1) {
    $("#answer2b").removeClass("selected");
    flgA2b--;
  }
  if (flgA2a == 1) {
    $("#answer2a").removeClass("selected");
    flgA2a--;
  }
  if (flgA2d == 1) {
    $("#answer2d").removeClass("selected");
    flgA2d--;
  }
  //Checked True - False this answer
  if (flgA2c == 0) {
    if (flgT2 == 0) {
      if (flgD2 == 0) {
        $("#status2").addClass("doing");
        flgD2++;
      }
    }
    $("#answer2c").addClass("selected");
    flgA2c++;
  }
  else if (flgA2c == 1) {
    $("#answer2c").removeClass("selected");
    $("#status2").removeClass("choosen");
    if (flgD2 == 1) {
      $("#status2").removeClass("doing");
      flgD2--;
    }
    flgA2c--;
  }
}
function answer2d() {
  //check if other answer is selected so hide
  if (flgA2b == 1) {
    $("#answer2b").removeClass("selected");
    flgA2b--;
  }
  if (flgA2c == 1) {
    $("#answer2c").removeClass("selected");
    flgA2c--;
  }
  if (flgA2a == 1) {
    $("#answer2a").removeClass("selected");
    flgA2a--;
  }
  //Checked True - False this answer
  if (flgA2d == 0) {
    if (flgT2 == 0) {
      if (flgD2 == 0) {
        $("#status2").addClass("doing");
        flgD2++;
      }
    }
    $("#answer2d").addClass("selected");
    flgA2d++;
  }
  else if (flgA2d == 1) {
    $("#answer2d").removeClass("selected");
    $("#status2").removeClass("choosen");
    if (flgD2 == 1) {
      $("#status2").removeClass("doing");
      flgD2--;
    }
    flgA2d--;
  }
}
var flgT2 = 0;
var flgD2 = 0;
function poser2() {
  if (flgD2 == 1) {
    $("#status2").removeClass("doing");
    if (flgT2 == 0) {
      $("#status2").addClass("tick");
      $("#question-box2").addClass("question-box-ticked");
      flgT2++;
    } else if (flgT2 == 1) {
      $("#status2").removeClass("tick");
      $("#question-box2").removeClass("question-box-ticked");
      $("#status2").addClass("doing");
      flgT2--;
    }
  } else if (flgD2 == 0) {
    if (flgT2 == 0) {
      $("#status2").addClass("tick");
      $("#question-box2").addClass("question-box-ticked");
      flgT2++;
    } else if (flgT2 == 1) {
      $("#status2").removeClass("tick");
      $("#question-box2").removeClass("question-box-ticked");
      flgT2--;
    }
  }
}
$('html').click(function (e) {
  //if clicked element is not your element and parents aren't your div
  if ((e.target.id != 'answer2a' && $(e.target).parents('#answer2a').length == 0) && (e.target.id != 'answer2b' && $(e.target).parents('#answer2b').length == 0) && (e.target.id != 'answer2d' && $(e.target).parents('#answer2d').length == 0) && (e.target.id != 'answer2c' && $(e.target).parents('#answer2c').length == 0)) {
    if (flgD2 == 1) {
      $("#status2").removeClass("doing");
      $("#status2").addClass("choosen");
      flgD2--;
    }
  }
});
var flgStatus = 0;
function status() {
  if (flgStatus == 0) {
    $("#question-status").fadeOut();
    flgStatus++;
  }else if(flgStatus==1){
    $("#question-status").fadeIn();
    flgStatus--;
  }
}
function status_mobile() {
  if (flgStatus == 0) {
    $("#question-status").fadeIn();
    flgStatus++;
  }else if(flgStatus==1){
    $("#question-status").fadeOut();
    flgStatus--;
  }
}