$(document).ready(function(){
    setInterval(ajax_request,1000);
});
async function ajax_request(){
    const response =await fetch("http://localhost:8000/etrivia/get_queue", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }

    });
    const data = await response.json();
    $("#queue-count").text(data["count"]);
}
