import GAME_CONFIG from './game-config.js';
import Assets from './util/assets-loader.js';
import GameMap from './game-map.js';

const {CANVAS_WIDTH, CANVAS_HEIGHT} = GAME_CONFIG;

// ROW - HEIGHT - Y
// COLUMN - WIDTH - X

export default class Game {
	constructor() {
		this.canvas = document.getElementById('rpworld');
		this.context = this.canvas.getContext('2d');
		this.gameMap = new GameMap(this.canvas, 'MAP_1')

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
		this.canvas.height = CANVAS_HEIGHT;
		this.canvas.width = CANVAS_WIDTH;

		await Promise.all(this.load());

		this.run();
	}

	run = timestamp => {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.gameMap.draw(timestamp || 0);

		requestAnimationFrame(this.run);
	}
};