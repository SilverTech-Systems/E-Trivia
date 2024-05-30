let score = 0;

async function ajax_request() {
    const response = await fetch("http://localhost:8000/etrivia/get_secret_sequence", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });
    const data = await response.json();
    return data;
}

$(document).ready(function() {

    if (sessionStorage.getItem("score")) {
        score = parseInt(sessionStorage.getItem("score"));
    }

    let gameover = false;

    const symbols = ["1", "2", "3", "4", "5", "6"];
    let secretSequences = [];
    let currentRound = 0;
    const displayContainer = document.getElementById('secretsequence_display-container');
    const userContainer = document.getElementById('secretsequence_user-container');
    const confirmButton = document.getElementById('secretsequence_confirm');
    let userSequence = [];

    let enabled = false;

    async function startGame() {
        try {
            const data = await ajax_request();
            currentRound = 0;
            secretSequences = data.secret_sequence;
            //console.log('Sequence:', secretSequences);
            playRound();
        } catch (error) {
            console.error('Error fetching the secret sequence:', error);
        }
    }

    function playRound() {
        enabled = false;
        userContainer.innerHTML = '';
        sessionStorage.setItem("score", score);
        $("#secretsequence_score").text("Score: " + score);
        if (currentRound < secretSequences.length) {
            $("#secretsequence_round").text("Round: " + parseInt(currentRound + 1));
            const sequence = secretSequences[currentRound];
            displayRandomSymbols(sequence);
            displayUserButtons();
            setTimeout(() => {
                hideSymbols();
                //displayUserButtons();
            }, 3000); 
        } else {
            //alert('Game Over);
            $("#secretsequence_confirm").text("Restart");
            $("#secretsequence_display-container").css("height", "0vh");
            gameover = true;
        }
    }

    function displayRandomSymbols(sequence) {
        displayContainer.innerHTML = '';
        sequence.forEach(symbol => {
            const img = document.createElement('img');
            img.src = "/static/secretseq_symbols/secretseq" + symbol + ".png";
            img.classList.add('secretsequence_symbol');
            displayContainer.appendChild(img);
        });
    }

    function hideSymbols() {
        displayContainer.innerHTML = '';
        enabled = true;
    }

    function displayUserButtons() {
        userContainer.innerHTML = '';
        symbols.forEach(symbol => {
            const img = document.createElement('img');
            img.src = "/static/secretseq_symbols/secretseq" + symbol + ".png";
            img.classList.add('secretsequence_operation');
            img.addEventListener('click', () => {
                handleUserSelection(symbol);
            });
            userContainer.appendChild(img);
        });
    }
    

    function handleUserSelection(symbol) {
        const maxLength = secretSequences[currentRound].length;
        if (userSequence.length < maxLength && enabled) {
            userSequence.push(symbol);
            console.log('User Sequence:', userSequence);

            const img = document.createElement('img');
            img.src = "/static/secretseq_symbols/secretseq" + symbol + ".png";
            img.classList.add('secretsequence_symbol');
            img.dataset.symbol = symbol;
            img.addEventListener('click', () => {
                handleUserDeselection(img);
            });
            displayContainer.appendChild(img);
        }
    }

    function handleUserDeselection(img) {
        displayContainer.removeChild(img);
        
        userSequence = [];
        const images = displayContainer.querySelectorAll('img');
        images.forEach(img => {
            userSequence.push(img.dataset.symbol);
        });
        console.log('User Sequence after removal:', userSequence);
    }

    confirmButton.addEventListener('click', () => {
        if (gameover) {
            window.location.reload();
            return;
        } else {
            const maxLength = secretSequences[currentRound].length;
            if (userSequence.length === maxLength) {
                checkUserSequence();
            }
            /*else {
                alert(`Please select ${maxLength} symbols.`);
            }*/
        }
    });

    function checkUserSequence() {
        const currentSequence = secretSequences[currentRound];
        let isCorrect = true;
        for (let i = 0; i < currentSequence.length; i++) {
            if (parseInt(currentSequence[i]) != userSequence[i]) {
                isCorrect = false;
                break;
            }
        }

        if (isCorrect) {
            score = score + 5 * (currentRound + 1);
            $("#secretsequence_score").text("Score: " + score);
            sessionStorage.setItem("score", score);

            //alert('Correct');
        } else {
            //alert('Incorrect');
        }

        userSequence = []; 
        displayContainer.innerHTML = '';
        currentRound++;
        playRound(); 
    }

    startGame();
});