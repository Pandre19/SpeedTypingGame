const RANDOM_QUOTE_API_URL = "http://api.quotable.io/random";
const quoteDisplayElement = document.getElementById("quoteDisplay");
const quoteInputElement = document.getElementById("quoteInput")
const timerElement = document.getElementById("timer");
const speedElement = document.getElementById("speed");
const keyElement = document.getElementById("key");
const pauseButton = document.getElementById("pause-button");
const restartButton = document.getElementById("restart-button");
const timerSector = document.getElementById("timer-sector");

var startPressed = false;
let pauseButtonIsPressed = false;
var interval;
var seconds = 00;

var gameHasStarted = false;

function getRandomQuote() {
    return fetch(RANDOM_QUOTE_API_URL)
        .then(response => response.json())
        .then(data => data.content)
}

let quote;
async function renderNewQuote() {
    quote = await getRandomQuote();
    quoteDisplayElement.innerHTML = "";
    quote.split("").forEach(character => {
        const characterSpan = document.createElement("span");
        characterSpan.innerText = character;
        quoteDisplayElement.appendChild(characterSpan);
    })
    quoteInputElement.value = null;

    pauseButtonIsPressed = false;
    startPressed= false;
    var seconds_html = "00";
    seconds = 00;
    timerElement.innerHTML = seconds_html;

    resumeTimer();
}

function funcListenerForTimer (e) {
    const arrayQuote = quoteDisplayElement.querySelectorAll("span");
    const arrayValue = quoteInputElement.value.split("");

    if(e.inputType === "deleteContentBackward"){
        keyElement.innerText = "Back";
        console.log("back")
    } else if (e.data === ' '){
        keyElement.innerText = "Space";
    } else if (e.target.value != "") {
        const lastLetter = e.target.value.slice(-1);
        keyElement.innerText = lastLetter;
    } 


    if(e.target.value === ""){
        keyElement.innerText = "?";
    }

    console.log(e)
    

    let correct = true;
    arrayQuote.forEach((characterSpan, index) =>{
        const character = arrayValue[index];
        if (character == null) {
            characterSpan.classList.remove("correct");
            characterSpan.classList.remove("incorrect");
            correct = false;
        }else if(character === characterSpan.innerText){
            characterSpan.classList.add("correct");
            characterSpan.classList.remove("incorrect");
        } else {
            characterSpan.classList.remove("correct");
            characterSpan.classList.add("incorrect");
            correct = false;
        }
    })

    if (correct) {
        const wordsArray = quote.split(" ");
    
        const speedWordsSecond = wordsArray.length / seconds;
        speedElement.innerHTML = speedWordsSecond.toFixed(2);

        keyElement.innerHTML = "?";
        
        quoteInputElement.addEventListener("input", funcListenerForTimer)
        

        
        renderNewQuote();

        clearInterval(interval);
        
    }

}

quoteInputElement.addEventListener("input", funcListenerForTimer)



function startTimer () {
    seconds ++;

    if(seconds<9) {
        timerElement.innerHTML = "0"+ seconds;
    }
    if(seconds > 9) {
        timerElement.innerHTML = seconds;
    }
}

function resumeTimer(){
    if(!startPressed){
        interval = setInterval(startTimer, 1000);
    }
    startPressed = true;
}

function stopTimer(){
    startPressed = false;
    clearInterval(interval);
}




// Reaccion de botones


pauseButton.addEventListener('click', () => {
    if(pauseButtonIsPressed) {
        pauseButtonIsPressed = false;
        timerSector.style.background = '#f0ab4f';
        pauseButton.style.background = '#f0ab4f';
        pauseButton.textContent = "P a u s e";
        quoteInputElement.readOnly = false;
        quoteInputElement.addEventListener("input", funcListenerForTimer)
        resumeTimer();
    } else {
        pauseButtonIsPressed = true;
        timerSector.style.background = '#538083';
        pauseButton.style.background = '#538083';
        pauseButton.textContent = "R e s u m e";
        quoteInputElement.readOnly = true;
        quoteInputElement.removeEventListener("input", funcListenerForTimer)
        stopTimer();
    }
})

restartButton.addEventListener('click', function() {
    renderNewQuote();
    console.log("click restart");
    timerSector.style.background = '#f0ab4f';
    pauseButton.style.background = '#f0ab4f';
    pauseButton.textContent = "P a u s e";
    pauseButtonIsPressed = false;
    startPressed= false;
    clearInterval(interval);
    seconds_html = "00";
    seconds = 00;
    timerElement.innerHTML = seconds_html;
})

//Start the game modal
const startingGameModal = document.getElementById("modal");
const startingGameButton = document.getElementById("start-game-button");
const overlay = document.getElementById("overlay");

if(!gameHasStarted){
    startingGameModal.classList.add("active");
    overlay.classList.add("active");
}

startingGameButton.onclick = function () {
    console.log("hola")
    startingGameModal.classList.remove("active");
    overlay.classList.remove("active");
    quoteInputElement.focus();
    gameHasStarted = true;
    renderNewQuote();
}