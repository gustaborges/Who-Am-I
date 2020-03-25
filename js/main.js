
class Game {
    #totalLifes;
    #round;
    #remainingLifes;
    #numbersArray = [];
    #rightAnswer;

    get totalLifes() {
        return this.#totalLifes;
    }
    
    get remainingLifes() {
        return this.#totalLifes;
    }
    
    constructor(totalLifes) {
        this.#totalLifes = totalLifes === undefined ? 3 : totalLifes;
        this.#round = 0;
        this.#remainingLifes = this.#totalLifes;
    }
    
    start() {
        GameUI.fadeOutElement(GameUI.telaInicialElement, true);
        GameUI.fadeInElement(GameUI.telaGame);
        this.startGame();
    }

    restart() {
        GameUI.fadeOutElement(GameUI.btnPlayAgain, true);
        GameUI.fadeOutElement(GameUI.telaGame, true);
        
        this.#remainingLifes = this.#totalLifes;
        this.#round = 0;
    
        setTimeout(function(game) {
            const numberOfHearts = game.totalLifes;
            GameUI.displayHearts(numberOfHearts);
            game.startGame(); 
        }, 500, this);
    }

    startGame() {    
        GameUI.fadeInElement(GameUI.telaGame);
        GameUI.fadeInElement(GameUI.lifeContainerElement);
        this.nextRound();
    }

    endGame() {
        GameUI.fadeOutElement(GameUI.lifeContainerElement, true);
        GameUI.fadeInElement(GameUI.btnPlayAgain);
    }
    
    nextRound() {
        if (this.#remainingLifes === 0) {
            GameUI.displayMessage("YOU LOSE!");
            this.endGame();
        }
        else {
            GameUI.resetNewRoundInterface(3);
            this.#numbersArray = this.generateNumbers(GameUI.totalAnswerBlocks());
            // Sets a right answer from the array of numbers
            this.#rightAnswer = this.#numbersArray[0];
            // Shuffles the array of numbers
            this.shuffle(this.#numbersArray);
            GameUI.showAnswerOptions(this.#numbersArray);
        }
    }
    
    loseLife() {
        this.#remainingLifes--;
        GameUI.removeHeart(this.#remainingLifes);
    }
    
    generateNumbers(total) {
        let random, array = [];
        for (let i = 0; i < total; i++) {
            do {
                random = parseInt(Math.random() * 100);
            } while (this.#numbersArray.includes(random));
            array.push(random);
        }
        return array;
    }

    shuffle(array) {
        let ctr = array.length;
        let temp, index;
    
        while (ctr > 0) {
            // Gets a random index
            index = Math.floor(Math.random() * ctr);
            ctr--;
            // And swap the last element with it
            temp = array[ctr];
            array[ctr] = array[index];
            array[index] = temp;
        }
        return array;
    }
    

    submitAnswer(answerElement) {
        GameUI.answerButtonsDisabled(true);
    
        let rightAnswerElement = document.getElementsByName(this.#rightAnswer)[0];
        GameUI.addClass('answer-option--correct', rightAnswerElement);
        if (rightAnswerElement === answerElement) {
            GameUI.displayMessage("YOU GOT IT!"); //  getRandomSucessMessage()
            this.endGame();
            return;
        }

        GameUI.displayMessage("OH! THAT WAS CLOSE"); // getRandomFailureMessage()
        GameUI.addClass('answer-option--incorrect', answerElement);        
        this.loseLife();
    
        setTimeout(function(game) {
            game.nextRound();
        }, 2500, this);
    }
}

class GameUI {
    static telaInicialElement = document.getElementById("tela-inicial");
    static telaGame = document.getElementById("tela-game");
    static btnPlayAgain = document.getElementById("btn-play-again");
    static lifeContainerElement = document.getElementById("life-container");


    static displayMessage(message) {
        document.getElementById("message").innerText = message;
    }
    
    static totalAnswerBlocks() {
        return document.getElementsByClassName("answer-option").length;
    }

    static showAnswerOptions(optionsArray) {
        let answerOptions = document.getElementsByClassName("answer-option");
        for (let i = 0; i < optionsArray.length; i++) {
            answerOptions[i].innerHTML = optionsArray[i];
            answerOptions[i].setAttribute('name', optionsArray[i].toString());
        }
    }

    static displayHearts(number) {
        const hearts = document.getElementsByClassName("heart");
        for (let i = 0; i < hearts.length; i++) {
            hearts[i].style.display = "inline";
            hearts[i].classList.remove("opacity-zero", "hidden");
        }
    }

    static resetNewRoundInterface(newRoundNumberOfAnswers) {
        const answerOptionElements = document.getElementsByClassName('answer-option');
        // Remove all answer blocks
        while(answerOptionElements.length > 0) {
            const elem = answerOptionElements[0];
            answerOptionElements[0].parentNode.removeChild(answerOptionElements[0]);
        }
        // Recreates all answer blocks
        for(let i = 0; i < newRoundNumberOfAnswers; i++) {
            document.getElementById('answer-container').innerHTML += "<button class='answer-option'></button>"
        }
        GameUI.setAnswerOptionsOnClickEvent();
        GameUI.displayMessage("Guess the Number");
        GameUI.answerButtonsDisabled(false);
    }

    static getAnswerElements() {
        return document.getElementsByClassName("answer-option");
    }

    static answerButtonsDisabled(status) {
        let elements = document.getElementsByClassName("answer-option");
        for (let i = 0; i < elements.length; i++)
            elements[i].disabled = status;
    }

    static fadeOutElement(element, removeOccupiedSpace) {
        GameUI.addClass('opacity-zero', element);
        GameUI.addClass('hidden', element);
    
        if (removeOccupiedSpace) {
            let duration = parseFloat(getComputedStyle(element)['transitionDuration']) * 1000;
            setTimeout(function() {
                // Display none após decorrido o transition duration do elemento
                element.style.display="none";
            }, duration);
        }
    }

    static removeHeart(index) {
        const heartElement = document.getElementsByClassName('heart')[index];
        GameUI.fadeOutElement(heartElement, false);
    }

    static setAnswerOptionsOnClickEvent() {
        let answerElements = GameUI.getAnswerElements();
        for (let i = 0; i < answerElements.length; i++) {
            answerElements[i].onclick = function() {
                GameFactory.getGame().submitAnswer(this);
            }
        }
    }

    static answerOptionsOnClick(chosenElement) {
        GameFactory.getGame().submitAnswer(chosenElement);
    }

    static btnPlayOnClick() {
        GameFactory.getGame().start();
    }

    static btnPlayAgainOnClick() {
        GameFactory.getGame().restart();
    }

    static fadeInElement(element) {
    
        setTimeout(function() {
            element.style.display="block";
        }, 700);
    
        setTimeout(function() {
            GameUI.removeClass('hidden', element);
            GameUI.removeClass('opacity-zero', element);
        }, 800);
    }
    

    static removeClass(className, element) {
        element.classList.remove(className);
    }
    
    static addClass(className, element) {
        element.classList.add(className);
    }
}

const btnPlay = document.getElementById("btn-play");
const btnPlayAgain = document.getElementById("btn-play-again");

btnPlay.onclick = GameUI.btnPlayOnClick;
btnPlayAgain.onclick = GameUI.btnPlayAgainOnClick;


class GameFactory {

    static getGame() {
        if (GameFactory.game === undefined) {
            GameFactory.game = new Game(3);
        }
        return GameFactory.game;
    }
}


