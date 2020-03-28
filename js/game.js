import GameUI from './gameui.js';

export default class Game {
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
        GameUI.fadeInElement(GameUI.telaGame, "grid");
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
        GameUI.fadeInElement(GameUI.telaGame, "grid");
        GameUI.fadeInElement(GameUI.lifeContainerElement, "flex");
        this.nextRound();
    }

    endGame() {
        GameUI.fadeOutElement(GameUI.lifeContainerElement, true);
        GameUI.fadeInElement(GameUI.btnPlayAgain, "block");
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