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

	const hero = new Character({
		x: 1,
		y: 1
	}, 15, 15, {
		tileWidth: 20,
		tileHeight: 20,
		gameSpeed: 700
	});

	new Game(contextElement.getContext('2d'), map, hero, {
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

		this.shouldGo = true;

		this.init();
	}

	init = () => {
		// loading assets
		console.log('init');
		this.drawMap();
		this.hero.setPath([{
			x: 1,
			y: 2
		}, {
			x: 1,
			y: 3
		}, {
			x: 2,
			y: 3
		}]);
	}

	drawMap = () => {
		const currentFrameTime = Date.now();

		if(!this.hero.processMovement(currentFrameTime)) {
			if(this.hero.currentTile.x !== this.hero.lastTile.x || this.hero.currentTile.y !== this.hero.lastTile.y) {
				console.log(currentFrameTime);
				this.hero.timeMoved = currentFrameTime;
			}
		}

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

		this.context.fillStyle = "#0000ff";
		this.context.fillRect(this.hero.position.x, this.hero.position.y, this.hero.characterWidth, this.hero.characterHeight);

		requestAnimationFrame(this.drawMap);
	}
};

class Character {
	constructor(initialTile, characterWidth, characterHeight, gameConfig) {
		const {tileWidth, tileHeight, gameSpeed} = gameConfig;

		this.timeMoved = 0;
		this.gameSpeed = gameSpeed;

		this.characterWidth = characterWidth;
		this.characterHeight = characterHeight;

		this.tileWidth = tileWidth;
		this.tileHeight = tileHeight;

		this.path = [];
		this.lastTile = {};
		this.placeAt(initialTile);
	}

	placeAt = ({x, y}) => {
		this.currentTile = {x, y};
		this.position = {
			x: (this.tileWidth * x) + ((this.tileWidth - this.characterWidth) / 2),
			y: (this.tileHeight * y) + ((this.tileHeight - this.characterHeight) / 2) // offset
		};
	}

	setPath = path => {
		this.path = path;
		this.lastTile = path[path.length - 1];
	}

	processMovement = time => {
		if(!this.path.length) return false;
		const nextTile = this.path[0];

		if(this.currentTile.x === this.lastTile.x && this.currentTile.y === this.lastTile.y) {
			return false;
		}

		if((time - this.timeMoved) >= this.gameSpeed) {
			this.placeAt(nextTile);
			this.path.shift();
			this.timeMoved = Date.now();
		} else {
			this.position = {
				x: (this.currentTile.x * this.tileWidth) + ((this.tileWidth - this.characterWidth) / 2),
				y: (this.currentTile.y * this.tileHeight) + ((this.tileHeight - this.characterHeight) / 2) // offset
			};

			if(nextTile.x !== this.currentTile.x) {
				const walked = (this.tileWidth / this.gameSpeed) * (time - this.timeMoved);
				this.position.x += (nextTile.x < this.currentTile.x ? 0 - walked : walked);
			}

			if(nextTile.y != this.currentTile.y) {
				const walked = (this.tileHeight / this.gameSpeed) * (time - this.timeMoved);
				this.position.y += (nextTile.y < this.currentTile.y ? 0 - walked : walked);
			}
		}

		return true;
	}
};