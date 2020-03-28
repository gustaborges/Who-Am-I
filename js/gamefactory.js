import Game from './game.js';

export default class GameFactory {

    static getGame() {
        if (GameFactory.game === undefined) {
            GameFactory.game = new Game(3);
        }
        return GameFactory.game;
    }
}