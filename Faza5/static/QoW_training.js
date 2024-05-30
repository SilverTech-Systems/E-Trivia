var questions;
let correct_entry;
let score=0;
let finished = false;
$(document).ready(function(){

    window.addEventListener("beforeunload",function(e){
        leave();
    });
    let polja = new Set([0,1,2,3]);
    if (sessionStorage.getItem("score")){
        score = parseInt(sessionStorage.getItem("score"));
    }
    (async()=>{

        if(!sessionStorage.getItem("question")){
            questions = await ajax_request();
            sessionStorage.setItem("question",JSON.stringify(questions));
        }
        else{
            questions = JSON.parse(sessionStorage.getItem("question"));
        }


        $("#question").text(questions["question"]);
        let random_entry = Math.floor(Math.random()*4);
        while(!polja.has(random_entry)){
            random_entry = Math.floor(Math.random()*4);
        }
        polja.delete(random_entry);
        $(".answer").eq(random_entry).text(questions["answer"]);
        correct_entry = random_entry;
        for (let i=0;i<3;i++){
            random_entry = Math.floor(Math.random()*4);
            while(!polja.has(random_entry)){
                random_entry = Math.floor(Math.random()*4);
            }
            polja.delete(random_entry);
            $(".answer").eq(random_entry).text(questions["incorrect"][i]);
        }
        $("#score-header").text("Score: "+score);
    })();
    $("#submit-button").click(function(){
        if (!finished){
            $(".answer").attr("disabled","true");

            sessionStorage.removeItem("question")

            console.log($(".answer.active").attr("id"));
            if (questions["answer"] === $(".answer.active").text()){
                score+=5;
                $("#score-header").text("Score: "+score);
                $(".answer.active").css("background-color","green");
            }
            else if ($(".answer.active").attr("id") === "ne-znam"){

                $(".answer").eq(correct_entry).css("background-color","yellow");
                $(".answer").eq(correct_entry).css("color","black");
                $(".answer.active").css("background-color","yellow");
                $(".answer.active").css("color","black");
            }
            else{
                $(".answer.active").css("background-color","red");
                $(".answer").eq(correct_entry).css("background-color","yellow");
                $(".answer").eq(correct_entry).css("color","black");
            }

            //pretvaramo submit button u next button
            $(this).text("Next Question");

            finished = true;
        }
        else{
            sessionStorage.setItem("score",score);
            $(this).attr("href","/etrivia/training/questionofwisdom");
        }
    })
    $("#back-button").click(function(){
        sessionStorage.clear();
    })

})
function leave(){
    localStorage.clear();
}

async function ajax_request() {
    const response =await fetch("http://localhost:8000/etrivia/get_qow", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }

    });
    console.log("Buh");
    const data = await response.json();
    return data;

}
function selectAnswer(event) {
    var answers = document.getElementsByClassName('answer');

    for (var i = 0; i < answers.length; i++) {
        answers[i].classList.remove('active');
    }

    event.target.classList.add('active');
}