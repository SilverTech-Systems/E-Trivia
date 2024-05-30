let score = 0;
let finished = false;
/*
*Placeholder fajl koji samo vraca random score radi testiranja multiplayer funkcionalnosti
 */


/*
*Ovde treba da napravimo AJAX koji ce da proveri da li postoji result row za nas game,
* ako postoji onda procitamo odatle protivnicki resultat i odredimo da li smo pobedili
* , usput posaljemo i nas score kako bi protivnik saznao da li je pobedio
* ,ako ne postoji red, onda ga mi pravimo i cekamo da protivnik zavrsi
 */
let points1=0;
let points2 =0;
let points3 = 0;
let points4 =0;
let gamedata;
let buh;
$(document).ready(function(){
    gamedata = JSON.parse(localStorage.getItem("game_data"));



    score = getTotalScore();
    points1 = localStorage.getItem("score1");
    points2 = localStorage.getItem("score2");
    points3 = localStorage.getItem("score3");
    points4 = localStorage.getItem("score4");

    //alert("Your final score: " + score);

    (async()=>{
        buh =  await ajax_request();
        $("#numberhunt").text(points1);
        $("#secretsequence").text(points2);
        $("#logiclink").text(points3);
        $("#questionofwisdom").text(points4);
        $("#total").text(score);
        $("#username").text()
        setTimeout(start_polling,500);
    })();

})
function getTotalScore(){
    let sum = 0;
    for (let i=1;i<=4;i++){
        sum+=parseInt(localStorage.getItem("score"+i));
    }
    return sum;
}
async function ajax_request(){
    const response =await fetch("http://localhost:8000/etrivia/multiplayer-match/get_results", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "score1":points1,
            "score2":points2,
            "score3":points3,
            "score4":points4,
            "opponent":gamedata["opponent"],
            "idgame":gamedata["idgame"]
        }

    });
    const data = await response.json();

    return data;
    /*
    u data ce da bude info da li je protivnik zavrsio, ako jeste bice njegov score
    */

}
function start_polling(){
    (async()=>{
        buh = await ajax_request();
        if (buh["won"]==="undefined"){
            setTimeout(start_polling,500);
        }
        else{
            $(".loader").hide()
            $("#opponent").text(buh["opponent"]);
            $("#result").text(buh["won"]);
        }
    })();
}
