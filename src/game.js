class Game {
	constructor(context, mapConfig, gameConfig) {
		this.context = context;

		this.assets = new Assets();

		this.hero = new Character(context, {
			x: 1,
			y: 1
		}, 30, 30, mapConfig, gameConfig);

		this.map = new Map(context, this.hero, {...mapConfig, ...gameConfig});

		this.init();
	}

	load = () => {
		return [
			this.assets.setImage('mapTiles', './src/tiles.png')
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
			x: 6,
			y: 6
		}, {
			x: 7,
			y: 6
		}, {
			x: 8,
			y: 6
		}]);
	}

	run = () => {
		this.context.clearRect(0, 0, 400, 400);
		this.map.draw(this.assets.getImage('mapTiles'));

		requestAnimationFrame(this.run);
	}
};