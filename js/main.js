import GameUI from './gameui.js';


const btnPlay = document.getElementById("btn-play");
const btnPlayAgain = document.getElementById("btn-play-again");

btnPlay.onclick = GameUI.btnPlayOnClick;
btnPlayAgain.onclick = GameUI.btnPlayAgainOnClick;





