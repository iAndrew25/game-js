import {getCardinalPoint} from '../util/helpers.js';
import GAME_CONFIG from '../game-config.js';

const {
	GAME_SPEED,
	TILE_WIDTH,
	TILE_HEIGHT
} = GAME_CONFIG;

export default class MovementSystem {
	constructor(character) {
		this.path = [];
		this.timeMoved = 0;
		this.nextTile = {};
		this.lastTile = {};
		this.position = {};
		this.isMoving = false;
		this.character = character;
	}

	setPath = path => {
		if(!Array.isArray(path)) {
			return false;
		}

		this.path = path;
		this.nextTile = path[0];
		this.lastTile = path[path.length - 1];
	}

	move = time => {
		if(!this.character.isCharacterAlive || 
			!this.path.length || 
			(this.character.currentTile.x === this.lastTile.x && this.character.currentTile.y === this.lastTile.y)
		) {
			return false;
		}

		if((time - this.timeMoved) >= GAME_SPEED) {
			this.path.shift();

			if(!this.path.length) {
				this.isMoving = false;
				this.character.placeAt(this.nextTile);
				this.nextTile = {};
				
				return false;
			}

			this.character.placeAt(this.nextTile);

			this.nextTile = this.path[0];
			this.timeMoved = Date.now();
			this.character.setCharacterMode(getCardinalPoint(this.character.currentTile, this.nextTile));
		} else {
			this.character.position = {
				x: (this.character.currentTile.x * TILE_WIDTH) + ((TILE_WIDTH - this.character.characterWidth) / 2),
				y: (this.character.currentTile.y * TILE_HEIGHT) + ((TILE_HEIGHT - this.character.characterHeight) / 2) // offset
			};

			if(this.nextTile.x !== this.character.currentTile.x) {
				const moved = (TILE_WIDTH / GAME_SPEED) * (time - this.timeMoved);
				this.character.position.x += (this.nextTile.x < this.character.currentTile.x ? 0 - moved : moved);
			}

			if(this.nextTile.y != this.character.currentTile.y) {
				const moved = (TILE_HEIGHT / GAME_SPEED) * (time - this.timeMoved);
				this.character.position.y += (this.nextTile.y < this.character.currentTile.y ? 0 - moved : moved);
			}
		
			this.isMoving = true;
		}

		return true;
	}
}