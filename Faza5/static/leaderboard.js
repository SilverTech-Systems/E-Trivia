function selectAnswer(event, timeFrame) {
    var answers = document.getElementsByClassName('answer');

    for (var i = 0; i < answers.length; i++) {
        answers[i].classList.remove('active_leaderboard');
    }

    event.target.classList.add('active_leaderboard');

    window.location.href = `/etrivia/leaderboard?time_frame=${timeFrame}`;
}

window.onload = function() {
    var urlParams = new URLSearchParams(window.location.search);
    var timeFrame = urlParams.get('time_frame');
    if (timeFrame) {
        document.getElementById(timeFrame).classList.add('active_leaderboard');
    } else {
        document.getElementById('daily').classList.add('active_leaderboard');
    }
};