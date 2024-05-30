let score = 0;
let isAnswerConfirmed = false;
let this_score = 0;

// Funkcija za učitavanje podataka iz localStorage
function loadGameData() {
  const gameData = localStorage.getItem("game_data");
  if (gameData) {
    try {
      const parsedData = JSON.parse(gameData);
      console.log("Parsed game data:", parsedData); // Dodato za debagovanje
      return parsedData;
    } catch (error) {
      console.error("Error parsing game data from localStorage:", error);
      return null;
    }
  } else {
    return null;
  }
}

function selectNumber(event) {
  if (!isAnswerConfirmed) {
    const selectedNumber = $(event.target);
    if (!selectedNumber.hasClass("used")) {
      const answerInput = $("#numberhunt_answer");
      const currentAnswer = answerInput.val();
      const lastChar = currentAnswer.slice(-1);

      if (/\d/.test(lastChar)) {
        return; // Ne dozvoli da se odabere broj ako je poslednji karakter već broj
      }

      answerInput.val(currentAnswer + selectedNumber.text());
      selectedNumber.addClass("used");
    }
  }
}

function selectOperation(event) {
  if (!isAnswerConfirmed) {
    const selectedOperation = $(event.target).text();
    const answerInput = $("#numberhunt_answer");
    const currentAnswer = answerInput.val();

    if (selectedOperation === "DEL") {
      const lastNumberMatch = currentAnswer.match(/\d+(?!.*\d)/);
      const lastNumber = lastNumberMatch ? lastNumberMatch[0] : "";
      const lastNumberLength = lastNumber.length;
    
      if (lastNumberLength > 0) {
        const index = currentAnswer.lastIndexOf(lastNumber);
        answerInput.val(currentAnswer.slice(0, index));
    
        // Za svaki button koji sadrži broj, proverava da li je "used" i da li je to poslednje pojavljivanje tog broja
        $(`#numberhunt_number-container button`).each(function() {
          if ($(this).text() === lastNumber && $(this).hasClass('used')) {
            $(this).removeClass("used");
            return false; // Prekida petlju nakon što nađe i ukloni klasu sa poslednjeg pojavljivanja broja
          }
        });
      } else {
        answerInput.val(currentAnswer.slice(0, -1));
      }
    }
     else {
      const lastChar = currentAnswer.slice(-1);
      const isNumber = /\d/.test(lastChar);
      const isOpeningParenthesis = lastChar === "(";
      const isClosingParenthesis = lastChar === ")";
      const isOperator = /[\+\-\*\/]/.test(lastChar);

      const openingParenthesisCount = (currentAnswer.match(/\(/g) || []).length;
      const closingParenthesisCount = (currentAnswer.match(/\)/g) || []).length;

      if (currentAnswer === "" && /[\+\-\*\/\)]/.test(selectedOperation)) {
        return; // Ne dozvoli da se započne sa +-/*) ili da se stavi zatvorena zagrada na početku
      }

      if (isNumber && selectedOperation === "(") {
        answerInput.val(currentAnswer + "*" + selectedOperation); // Dodaj * pre otvorene zagrade ako je prethodni karakter broj
        return;
      }

      if (isOperator && /[\+\-\*\/]/.test(selectedOperation)) {
        return; // Ne dozvoli da se stave dva operatora jedan za drugim
      }

      if (isOpeningParenthesis && /[\+\-\*\/\)]/.test(selectedOperation)) {
        return; // Ne dozvoli da se stavi +-/*) odmah nakon otvorene zagrade
      }

      if (isClosingParenthesis && /[\d\(]/.test(selectedOperation)) {
        answerInput.val(currentAnswer + "*" + selectedOperation); // Dodaj * između zatvorene zagrade i broja ili otvorene zagrade
        return;
      }

      if (selectedOperation === ")" && openingParenthesisCount <= closingParenthesisCount) {
        return; // Ne dozvoli da se stavi više zatvorenih zagrada nego otvorenih
      }

      if (isOperator && selectedOperation === ")") {
        return; // Ne dozvoli da se stavi zatvorena zagrada odmah nakon operacije
      }

      answerInput.val(currentAnswer + selectedOperation);
    }
  }
}

async function confirmAnswer() {
  if (!isAnswerConfirmed) {
    const answerInput = $("#numberhunt_answer");
    const userAnswer = eval(answerInput.val());
    const targetNumber = parseInt($("#numberhunt_question").text());
    const difference = Math.abs(userAnswer - targetNumber);

    if (difference === 0) {
      this_score = 20;
      score += this_score;
    } else if (difference <= 5) {
      this_score = 10;
      score += this_score;
    } else if (difference <= 10) {
      this_score = 5;
      score += this_score;
    }

    localStorage.setItem("score1", score);
    $("header h2").text("Score: " + score);

    $("#numberhunt_result").text(`Score: ${this_score}, Result: ${userAnswer}, Distance: ${difference}`);

    answerInput.val("");

    // Onemogućavanje klikova na operacije i brojeve
    $("#numberhunt_number-container button, #numberhunt_operation-container button").prop("disabled", true);

    $("#numberhunt_confirm").text("Next Game");


    isAnswerConfirmed = true;
  }
  else{
    window.location.href = "/etrivia/multiplayer-match/secret-sequence";
  }
}

$(document).ready(async function() {

  if (localStorage.getItem("score1") || localStorage.getItem("finished")) {
    $("button").attr("disabled",true);
    $("#numberhunt_confirm").removeAttr("disabled");
    isAnswerConfirmed = true;
    alert("You have already played this game, you cannot play again during this match");
  }

  const data = loadGameData();
  if (data) {
    const numberhuntData = data.numberhunt;
    const targetNumber = numberhuntData[0]; // Prvi broj je ciljni broj
    const availableNumbers = numberhuntData.slice(1); // Sledećih 6 brojeva su dostupni brojevi

    $("#numberhunt_question").text(targetNumber);
    const numberButtons = $("#numberhunt_number-container button");
    availableNumbers.forEach((number, index) => {
      $(numberButtons[index]).text(number);
    });

    $("header h2").text("Score: " + score);

    $("#numberhunt_number-container button").on("click", selectNumber);

    $("#numberhunt_operation-container button").on("click", selectOperation);
    $("#numberhunt_confirm").click(function(){
      confirmAnswer();
    })
  } else {
    console.error("No game data found in localStorage");
  }
});
