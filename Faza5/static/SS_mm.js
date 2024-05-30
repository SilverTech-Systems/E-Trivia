let score = 0;
let this_score = 0;

function loadGameData() {
  const gameData = localStorage.getItem("game_data");
  if (gameData) {
    try {
      const parsedData = JSON.parse(gameData);
      //console.log("Parsed game data:", parsedData); 
      return parsedData;
    } catch (error) {
      console.error("Error parsing game data from localStorage:", error);
      return null;
    }
  } else {
    return null;
  }
}

$(document).ready(function() {

    score = get_total();

    let gameover = false;

    const symbols = ["1", "2", "3", "4", "5", "6"];
    let secretSequences = [];
    let currentRound = 0;
    const displayContainer = document.getElementById('secretsequence_display-container');
    const userContainer = document.getElementById('secretsequence_user-container');
    const confirmButton = document.getElementById('secretsequence_confirm');
    let userSequence = [];

    let enabled = false;

    function saveGameState() {
        localStorage.setItem('currentRound', currentRound);
        localStorage.setItem('score2', this_score.toString());
        //localStorage.setItem('userSequence', JSON.stringify(userSequence));
    }
    
    function clearGameState() {
        localStorage.removeItem('currentRound');
        //localStorage.removeItem('userSequence');
        localStorage.removeItem('currentSequenceDisplayed');
    }

    function loadGameState() {
        const savedRound = localStorage.getItem('currentRound');
        this_score = localStorage.getItem('score2');
        if (this_score !== null){
            this_score = parseInt(this_score);
        } else {
            this_score = 0;
        }
        //const savedUserSequence = localStorage.getItem('userSequence');
        if (savedRound !== null){//  && savedUserSequence !== null) {
            currentRound = parseInt(savedRound);
            //userSequence = JSON.parse(savedUserSequence);
        } else {
            currentRound = 0;
            userSequence = [];
        }
    }

    async function startGame() {
        try {
            //currentRound = 0;
            loadGameState();
            score = get_total() + this_score;
            $("#secretsequence_score").text("Score: " + score);
            const gamedata = loadGameData();
            if (gamedata) {
              let ssdata = gamedata.secretsequence;
              
              let seq1 = [];
              let seq2 = [];
              let seq3 = [];
              for (let i=0;i<3;i++){
                  seq1.push(ssdata[i]);
              }
              secretSequences.push(seq1);
              for (let i=3;i<7;i++){
                  seq2.push(ssdata[i]);
              }
              secretSequences.push(seq2);
              for (let i=7;i<12;i++){
                  seq3.push(ssdata[i]);
              }
              secretSequences.push(seq3);
            }
            //console.log('Sequence:', secretSequences);
            if (localStorage.getItem('currentSequenceDisplayed') == null) {
                localStorage.setItem('currentSequenceDisplayed', false);
            }
            playRound();
        } catch (error) {
            console.error('Error fetching the secret sequence:', error);
        }
    }

    function playRound() {
        if (localStorage.getItem('currentSequenceDisplayed') == "false") {
            localStorage.setItem('enabled', false);
        }
        enabled = false;
        userContainer.innerHTML = '';
        //sessionStorage.setItem("score", score);
        $("#secretsequence_score").text("Score: " + score);
        if (currentRound < secretSequences.length) {
            $("#secretsequence_round").text("Round: " + parseInt(currentRound + 1));
            const sequence = secretSequences[currentRound];
            console.log(localStorage.getItem('currentSequenceDisplayed'));
            if (localStorage.getItem('currentSequenceDisplayed') == "false") {
                displayRandomSymbols(sequence);
                displayUserButtons();
                setTimeout(() => {
                    hideSymbols();
                    //isplayUserButtons();
                }, 3000); 
            } else {
                displayUserButtons();
            }
        } else {
            //alert('Game Over);
            $("#secretsequence_confirm").text("Next Game");
            $("#secretsequence_display-container").css("height", "0vh");
            gameover = true;
            localStorage.setItem("score2",this_score.toString());
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
        localStorage.setItem('enabled', true);
        enabled = true;
        displayContainer.innerHTML = '';
        localStorage.setItem('currentSequenceDisplayed', true);
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
        if (userSequence.length < maxLength && localStorage.getItem('enabled') == "true"){
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
            saveGameState();
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
        saveGameState();
    }

    confirmButton.addEventListener('click', () => {
        if (gameover) {
            clearGameState();
            window.location.href = "/etrivia/multiplayer-match/logic-link";
        } else {
            const maxLength = secretSequences[currentRound].length;
            if (userSequence.length === maxLength) {
                checkUserSequence();
                saveGameState();
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
            this_score = this_score + 5 * (currentRound + 1);
            //score = score + 5 * (currentRound + 1);
            score = get_total() + this_score;
            $("#secretsequence_score").text("Score: " + score);
            localStorage.setItem("score2",this_score.toString());

            //alert('Correct');
        } else {
            //alert('Incorrect');
        }

        userSequence = []; 
        displayContainer.innerHTML = '';
        currentRound++;
        localStorage.setItem('currentSequenceDisplayed', false);
        playRound(); 
    }

    function get_total(){
      let s = 0;
      s += parseInt(localStorage.getItem("score1"));
      return s;
    }

    startGame();
});