let count = 0;
$(document).ready(function(){
    localStorage.clear();
    leaveGame();
    setInterval(waiting,500);
    setInterval(ajax_request,500);

    window.addEventListener("beforeunload",function(e){

        localStorage.setItem("buh",e.state);

        leaveQueue();
    });
})
async function leaveGame(){
    await fetch("http://localhost:8000/etrivia/leave-game",{
        method: "GET",
        headers: {
            "Content-Type":"application/json"
        }
    })
}
async function leaveQueue(){
    fetch("http://localhost:8000/etrivia/leave-queue",{
        method: "GET",
        headers: {
            "Content-Type":"application/json"
        }
    })
}
async function ajax_request(){
    const response =await fetch("http://localhost:8000/etrivia/get_game", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }

    });
    const data = await response.json();
    if (parseInt(data["idgame"]) !== -1){
        //nasli smo gejm, idemo na drugu stranicu gde se vise ne poziva ajax request
        localStorage.setItem("game_data",JSON.stringify(data));
        alert("Match found! Opponent: "+data["opponent"]);
        window.location.href = "/etrivia/multiplayer-match/number-hunt";
    }
}
function waiting(){
    let text = "Waiting for game";
    for (let i=0;i<count;i++){
        text+=".";
    }
    for (let i=0;i<3-count;i++){
        text+=" ";
    }
    count = (count+1)%4;
    $("#waiting").text(text);
}
