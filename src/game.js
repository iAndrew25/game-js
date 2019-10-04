import Assets from './assets-loader.js';
import Character from './character.js'
import Map from './map.js'
// ROW - HEIGHT - Y
// COLUMN - WIDTH - X

export default class Game {
	constructor(context, mapConfig, gameConfig) {
		this.context = context;

		this.hero = new Character(context, {
			x: 1,
			y: 1
		}, 50, 25, mapConfig, gameConfig);

		this.map = new Map(context, this.hero, {...mapConfig, ...gameConfig});

		this.init();
	}

	load = () => {
		return [
			Assets.setImage('mapTiles', './src/tiles.png')
		];
	}

	init = async () => {
		await Promise.all(this.load());

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
		this.context.clearRect(0, 0, 600, 300);
		this.map.draw(Assets.getImage('mapTiles'));

		requestAnimationFrame(this.run);
	}
};