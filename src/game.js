import GAME_CONFIG from './game-config.js';
import Assets from './util/assets-loader.js';
import Character from './character.js';
import GameMap from './game-map.js';

const {CANVAS, CONTEXT, CANVAS_WIDTH, CANVAS_HEIGHT} = GAME_CONFIG;

// ROW - HEIGHT - Y
// COLUMN - WIDTH - X

export default class Game {
	constructor() {
		this.init();
	}

	load = () => {
		return [
			Assets.setImage('mapTiles', './src/assets/rpg-tiles.png'),
			Assets.setImage('playerTiles', './src/assets/player-tiles.png'),
			Assets.setImage('charactersSprite', './src/assets/characters-sprite.png'),
			Assets.setImage('mapSprite', './src/assets/map-sprite.png'),
			Assets.setImage('buttonsSprite', './src/assets/buttons-sprite.png'),
		];
	}

	init = async () => {
		CANVAS.height = CANVAS_HEIGHT;
		CANVAS.width = CANVAS_WIDTH;

		await Promise.all(this.load());

		this.run();
	}

	run = timestamp => {
		CONTEXT.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
		GameMap.draw(timestamp || 0);

		requestAnimationFrame(this.run);
	}
};