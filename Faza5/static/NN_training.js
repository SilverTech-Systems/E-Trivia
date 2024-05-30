let score = 0;
let isAnswerConfirmed = false;
let this_score = 0;
async function ajax_request() {
  const response = await fetch("http://localhost:8000/etrivia/get_numbers", {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  });
  const data = await response.json();
  return data;
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
        const lastNumber = currentAnswer.match(/\d+$/)?.[0] || "";
        const lastNumberLength = lastNumber.length;
    
        if (lastNumberLength > 0) {
          $(`#numberhunt_number-container button:contains(${lastNumber})`).removeClass("used");
          answerInput.val(currentAnswer.slice(0, -lastNumberLength));
        } else {
          answerInput.val(currentAnswer.slice(0, -1));
        }
      } else {
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
      
      sessionStorage.setItem("score", score);
      $("header h2").text("Score: " + score);
      
      $("#numberhunt_result").text(`Score: ${this_score}, Result: ${userAnswer}, Distance: ${difference}`);
      
      answerInput.val("");
      
      // Onemogućavanje klikova na operacije i brojeve

        $("#numberhunt_number-container button, #numberhunt_operation-container button").prop("disabled", true);

      isAnswerConfirmed = true;
      $("#numberhunt_confirm").text("Next");
    }
    else{
      window.location.href = "/etrivia/training/numberhunt"
    }
  }

  $(document).ready(async function() {
    if (sessionStorage.getItem("score")) {
      score = parseInt(sessionStorage.getItem("score"));
    }
    
    const data = await ajax_request();
    $("#numberhunt_question").text(data.number_to_find);
    const numberButtons = $("#numberhunt_number-container button");
    data.numbers_made.forEach((number, index) => {
      $(numberButtons[index]).text(number);
    });
    
    $("header h2").text("Score: " + score);
    
    $("#numberhunt_number-container button").on("click", selectNumber);
    
    $("#numberhunt_operation-container button").on("click", selectOperation);
    $("#numberhunt_confirm").on("click", confirmAnswer);
  });