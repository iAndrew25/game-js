const map = {
	tileWidth: 20,
	tileHeight: 20,
	gameMap: [
		[1, 1, 1, 1, 1],
		[1, 0, 0, 0, 1],
		[1, 0, 1, 0, 1],
		[1, 0, 0, 0, 1],
		[1, 1, 1, 1, 1]
	]
};

window.onload = () => {
	const contextElement = document.createElement('canvas');
	document.body.appendChild(contextElement);

	new Game(contextElement.getContext('2d'), map, 'hero', {
		gameSpeed: 700
	});
};


class Game {
	constructor(context, map, hero, gameConfig) {
		const {gameSpeed} = gameConfig;
		const {gameMap, tileWidth, tileHeight} = map;

		this.context = context;
		this.gameMap = gameMap;
		this.hero = hero;

		this.tileWidth = tileWidth;
		this.tileHeight = tileHeight;

		this.mapHeight = gameMap.length;
		this.mapWidth = gameMap[0].length;

		this.gameSpeed = gameSpeed;

		this.init();
	}

	init = () => {
		// loading assets
		console.log('init');
		this.drawMap();
	}

	drawMap = () => {
		for(let y = 0; y < this.mapHeight; ++y) {
			for(let x = 0; x < this.mapWidth; ++x) {
				switch(this.gameMap[x][y]) {
					case 0:
						this.context.fillStyle = "#685b48";
						break;
					default:
						this.context.fillStyle = "#5aa457";
				}

				this.context.fillRect( x*this.tileWidth, y*this.tileHeight, this.tileWidth, this.tileHeight);
			}
		}
	}
};