export default class MovementSystem {
	timeMoved = 0;
	path = [];
	nextTile = {};
	lastTile = {};
	position = {};
	isMoving = false;

	setPath = path => {
		if(!Array.isArray(path)) {
			return false;
		}

		this.path = path;
		this.nextTile = path[0];
		this.lastTile = path[path.length - 1];
	}

	move = time => {
		if(!this.isCharacterAlive || !this.path.length || (this.currentTile.x === this.lastTile.x && this.currentTile.y === this.lastTile.y)) {
			return false;
		}

		if((time - this.timeMoved) >= GAME_SPEED) {
			if(this.path.length === 1) {
				this.setCharacterMode('IDLE');
				this.isMoving = false;
			}

			this.placeAt(this.nextTile);
			this.path.shift();

			this.nextTile = this.path[0];
			this.timeMoved = Date.now();

			if(!this.path.length) {
				this.nextTile = {};
				
				return false;
			}
		} else {

			this.position = {
				x: (this.currentTile.x * TILE_WIDTH) + ((TILE_WIDTH - this.characterWidth) / 2),
				y: (this.currentTile.y * TILE_HEIGHT) + ((TILE_HEIGHT - this.characterHeight) / 2) // offset
			};

			if(this.nextTile.x !== this.currentTile.x) {
				const moved = (TILE_WIDTH / GAME_SPEED) * (time - this.timeMoved);
				this.position.x += (this.nextTile.x < this.currentTile.x ? 0 - moved : moved);
			}

			if(this.nextTile.y != this.currentTile.y) {
				const moved = (TILE_HEIGHT / GAME_SPEED) * (time - this.timeMoved);
				this.position.y += (this.nextTile.y < this.currentTile.y ? 0 - moved : moved);
			}
		
			this.isMoving = true;
		}

		this.setCharacterMode(getCardinalPoint(this.currentTile, this.nextTile));
		return true;
	}
}