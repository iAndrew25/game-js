import GAME_CONFIG from './game-config.js';
import Assets from './util/assets-loader.js';
import Character from './character.js';
import GameMap from './game-map.js';
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

		Hero.init({
			x: 1,
			y: 1
		});

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

	run = timestamp => {
		CONTEXT.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
		GameMap.draw(timestamp || 0);

		requestAnimationFrame(this.run);
	}
};