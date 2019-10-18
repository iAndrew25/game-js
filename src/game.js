import GAME_CONFIG from './game-config.js';
import Assets from './assets-loader.js';
import Character from './character.js';
import Map from './map.js';
import Hero from './hero.js';

const {CANVAS, CONTEXT, CANVAS_WIDTH, CANVAS_HEIGHT} = GAME_CONFIG;

// ROW - HEIGHT - Y
// COLUMN - WIDTH - X

export default class Game {
	constructor() {
		this.init();
	}

	load = () => {
		return [
			Assets.setImage('mapTiles', './src/rpg-tiles.png'),
			Assets.setImage('playerTiles', './src/player-tiles.png'),
			Assets.setImage('charactersSprite', './src/characters-sprite.png'),
			Assets.setImage('mapSprite', './src/map-sprite.png'),
			Assets.setImage('buttonsSprite', './src/buttons-sprite.png'),
		];
	}

	init = async () => {
		CANVAS.height = CANVAS_HEIGHT;
		CANVAS.width = CANVAS_WIDTH;

		await Promise.all(this.load());

		Hero.init({
			x: 1,
			y: 1
		});

		this.map = new Map();

		this.run();
		// // temp
		// Hero.setPath([{
		// 	x: 1,
		// 	y: 2
		// }, {
		// 	x: 1,
		// 	y: 3
		// }, {
		// 	x: 2,
		// 	y: 3
		// }, {
		// 	x: 3,
		// 	y: 3
		// }, {
		// 	x: 3,
		// 	y: 4
		// }, {
		// 	x: 3,
		// 	y: 5
		// }, {
		// 	x: 3,
		// 	y: 6
		// }, {
		// 	x: 4,
		// 	y: 6
		// }, {
		// 	x: 5,
		// 	y: 6
		// }, {
		// 	x: 5,
		// 	y: 5
		// }]);
	}

	run = () => {
		CONTEXT.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
		this.map.draw();

		requestAnimationFrame(this.run);
	}
};