let score = 0;
let finished = false;
/*
*Placeholder fajl koji samo vraca random score radi testiranja multiplayer funkcionalnosti
 */
let questions;
let current = 0;

let this_score = 0;

$(document).ready(function(){

  score = get_total();
  $("#score-header").text("Score: "+score);

    if (localStorage.getItem("finished")){
        localStorage.setItem("current",5);
    }

  setupGame();




  $("#qow_confirm").click(function(){
    $(this).attr("disabled","true");
    if (!finished){

      $(".answer").attr("disabled","true");

      if (questions[1] === $(".answer.active").text()){
          score+=5;
          this_score+=5;
          localStorage.setItem("score4",this_score);
          $("#score-header").text("Score: "+score.toString());
          $(".answer").eq(correct_entry).css("background-color","rgba(0, 255, 0, 0.5)");
      }
      else if ($(".answer.active").attr("id") === "ne-znam"){
          score+=0;
          this_score+=0;
          localStorage.setItem("score4",this_score);
          $(".answer").eq(correct_entry).css("background-color","yellow");
          $(".answer").eq(correct_entry).css("color","black");
          $(".answer.active").css("background-color","yellow");
          $(".answer.active").css("color","black");
      }
      else{
          score-=5;
          this_score-=5;
          localStorage.setItem("score4",this_score);
          $("#score-header").text("Score: "+score.toString());
          $(".answer.active").css("background-color","red");
          $(".answer").eq(correct_entry).css("background-color","yellow");
          $(".answer").eq(correct_entry).css("color","black");
      }
      current++;
      localStorage.setItem("current",current);
      if (current==5){
        finished=true;
        $(this).text("See Results");
        $(this).removeAttr("disabled");
      }
      else{
        setTimeout(setupGame,2000);
      }
      //pretvaramo submit button u next button

    }
    else{
      window.location.href = "/etrivia/multiplayer-match/result"
    }

  })
})
function setupGame(){
  $("#qow_confirm").removeAttr("disabled");
  $(".answer").removeAttr("disabled");

  $(".answer").css("background-color","");
  $(".answer").css("color","");
  $(".answer").removeClass("active");

  let polja = new Set([0,1,2,3]);
  if (localStorage.getItem("current")){
      current = parseInt(localStorage.getItem("current"));
      if (current == 5){
          //vec odigrano
          alert("you have already finished this game");
          finished=true;
          $("#qow_confirm").text("Results");
          return;
      }
  }
  questions = JSON.parse(localStorage.getItem("game_data"))["qow"][current];
  console.log(questions);
  $("#question").text(questions[0]);
  let random_entry = Math.floor(Math.random()*4);
  while(!polja.has(random_entry)){
      random_entry = Math.floor(Math.random()*4);
  }
  polja.delete(random_entry);

  $(".answer").eq(random_entry).text(questions[1]);
  correct_entry = random_entry;
  for (let i=0;i<3;i++){
      random_entry = Math.floor(Math.random()*4);
      while(!polja.has(random_entry)){
          random_entry = Math.floor(Math.random()*4);
      }
      polja.delete(random_entry);
      $(".answer").eq(random_entry).text(questions[2+i]);
  }
}
function get_total(){
  let s = 0;
  s += parseInt(localStorage.getItem("score1"));
  s += parseInt(localStorage.getItem("score2"));
  s += parseInt(localStorage.getItem("score3"));
  return s;
}