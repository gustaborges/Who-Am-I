import GameFactory from './gamefactory.js'


export default class GameUI {
    static telaInicialElement = document.getElementById("start-screen");
    static telaGame = document.getElementById("game-screen");
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

    static fadeInElement(element, displayType) {
    
        setTimeout(function() {
            element.style.display = displayType;
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