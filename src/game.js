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
		this.startGame();
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
		}]);
	}

	startGame = () => {
		this.drawMap();
		this.hero.draw(this.context);		

		requestAnimationFrame(this.startGame);
	}

	drawMap = () => {
		for(let x = 0; x < this.mapHeight; ++x) {
			for(let y = 0; y < this.mapWidth; ++y) {
				switch(this.gameMap[x][y]) {
					case 0:
						this.context.fillStyle = "#5aa457";
						break;
					default:
						this.context.fillStyle = "#685b48";
				}

				this.context.fillRect(y*this.tileWidth, x*this.tileHeight, this.tileWidth, this.tileHeight);
			}
		}
	}	
};