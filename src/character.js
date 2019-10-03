class Character {
	constructor(context, initialTile, characterWidth, characterHeight, mapConfig, gameConfig) {
		const {tileWidth, tileHeight} = mapConfig;
		const {gameSpeed} = gameConfig;

		this.context = context;

		this.timeMoved = 0;
		this.gameSpeed = gameSpeed;

		this.characterWidth = characterWidth;
		this.characterHeight = characterHeight;

		this.tileWidth = tileWidth;
		this.tileHeight = tileHeight;

		this.path = [];
		this.lastTile = {};
		this.isMoving = false;
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
		if(!Array.isArray(path)) {
			return false;
		}

		this.path = path;
		this.nextTile = path[0];
		this.lastTile = path[path.length - 1];
	}

	draw = (x, y) => {
		const currentFrameTime = Date.now();

		if(!this.move(currentFrameTime)) {
			if(this.currentTile.x !== this.lastTile.x || this.currentTile.y !== this.lastTile.y) {
				this.timeMoved = currentFrameTime;
			}
		}

		this.context.fillStyle = "#0000ff";
		this.context.fillRect(this.position.x - x, this.position.y - y, this.characterWidth, this.characterHeight);
	}

	move = time => {
		if(!this.path.length) {
			this.isMoving = false;
			return false;
		}

		if(this.currentTile.x === this.lastTile.x && this.currentTile.y === this.lastTile.y) {
			return false;
		}

		if((time - this.timeMoved) >= this.gameSpeed) {
			this.placeAt(this.nextTile);
			this.path.shift();

			this.nextTile = this.path[0];
			this.timeMoved = Date.now();
		} else {
			this.position = {
				x: (this.currentTile.x * this.tileWidth) + ((this.tileWidth - this.characterWidth) / 2),
				y: (this.currentTile.y * this.tileHeight) + ((this.tileHeight - this.characterHeight) / 2) // offset
			};

			if(this.nextTile.x !== this.currentTile.x) {
				const moved = (this.tileWidth / this.gameSpeed) * (time - this.timeMoved);
				this.position.x += (this.nextTile.x < this.currentTile.x ? 0 - moved : moved);
			}

			if(this.nextTile.y != this.currentTile.y) {
				const moved = (this.tileHeight / this.gameSpeed) * (time - this.timeMoved);
				this.position.y += (this.nextTile.y < this.currentTile.y ? 0 - moved : moved);
			}
		}

		this.isMoving = true;
		return true;
	}
};