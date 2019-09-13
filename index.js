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
	}

	drawMap = () => {
		const currentFrameTime = Date.now();

		if(!this.hero.processMovement(currentFrameTime)) {
			if(this.shouldGo) {
				this.hero.toTile.y -= 1; 
			}

			if(this.hero.fromTile.x !== this.hero.toTile.x || this.hero.fromTile.y !== this.hero.toTile.y) {
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

		this.shouldGo = false;

		this.context.fillStyle = "#0000ff";
		this.context.fillRect(this.hero.position.x, this.hero.position.y, this.hero.characterWidth, this.hero.characterHeight);

		requestAnimationFrame(this.drawMap);
	}
};

class Character {
	constructor(toTile, characterWidth, characterHeight, gameConfig) {
		const {tileWidth, tileHeight, gameSpeed} = gameConfig;

		this.timeMoved = 0;
		this.gameSpeed = gameSpeed;

		this.characterWidth = characterWidth;
		this.characterHeight = characterHeight;

		this.tileWidth = tileWidth;
		this.tileHeight = tileHeight;

		this.placeAt(toTile);
	}

	placeAt = ({x, y}) => {
		this.fromTile = {x, y};
		this.toTile = {x, y};
		this.position = {
			x: (this.tileWidth * x) + ((this.tileWidth - this.characterWidth) / 2), // offset
			y: (this.tileHeight * y) + ((this.tileHeight - this.characterHeight) / 2) // offset
		};
	}

	processMovement = time => {
		if(this.fromTile.x === this.toTile.x  && this.fromTile.y === this.toTile.y) {
			return false;
		}

		if((time - this.timeMoved) >= this.gameSpeed) {
			this.placeAt(this.toTile);
		} else {
			this.position = {
				x: (this.fromTile.x * this.tileWidth) + ((this.tileWidth - this.characterWidth) / 2), // offset
				y: (this.fromTile.y * this.tileHeight) + ((this.tileHeight - this.characterHeight) / 2) // offset
			};

			if(this.toTile.x !== this.fromTile.x) {
				const walked = (this.tileWidth / this.gameSpeed) * (time - this.timeMoved);
				this.position.x += (this.toTile.x < this.fromTile.x ? 0 - walked : walked);
			}

			if(this.toTile.y != this.fromTile.y) {
				const walked = (this.tileHeight / this.gameSpeed) * (time - this.timeMoved);
				this.position.y += (this.toTile.y < this.fromTile.y ? 0 - walked : walked);
			}
		}

		return true;
	}
};