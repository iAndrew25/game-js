import GAME_CONFIG from './game-config.js';

const {CONTEXT, CANVAS_WIDTH, CANVAS_HEIGHT} = GAME_CONFIG;

import Assets from './assets-loader.js';
import Character from './character.js'
import Map from './map.js'
// ROW - HEIGHT - Y
// COLUMN - WIDTH - X

export default class Game {
	constructor(mapConfig, gameConfig) {
		this.mapConfig = mapConfig; // temp
		this.gameConfig = gameConfig; // temp

		this.init();
	}

	load = () => {
		return [
			Assets.setImage('mapTiles', './src/tiles.png')
		];
	}

	init = async () => {
		await Promise.all(this.load());

		this.hero = new Character({
			x: 1,
			y: 1
		}, 50, 25);

		this.map = new Map(this.hero, this.mapConfig);

		this.run();
		// temp
		this.hero.setPath([{
			x: 1,
			y: 2
		}, {
			x: 1,
			y: 3
		}, {
			x: 2,
			y: 3
		}, {
			x: 3,
			y: 3
		}, {
			x: 3,
			y: 4
		}, {
			x: 3,
			y: 5
		}, {
			x: 3,
			y: 6
		}, {
			x: 4,
			y: 6
		}, {
			x: 5,
			y: 6
		}, {
			x: 5,
			y: 5
		}]);
	}

	run = () => {
		CONTEXT.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
		this.map.draw();

		requestAnimationFrame(this.run);
	}
};