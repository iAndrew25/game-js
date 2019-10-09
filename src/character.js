import Assets from './assets-loader.js';
import Camera from './camera.js';
import GAME_CONFIG from './game-config.js';

const {
	CONTEXT,
	TILE_WIDTH,
	TILE_HEIGHT,
	GAME_SPEED,
	LEGEND
} = GAME_CONFIG;

export default class Character {
	constructor(initialTile, character) {
		const {
			spriteX,
			spriteY,
			tileWidth,
			tileHeight
		} = LEGEND[character];
		this.mapTiles = Assets.getImage('mapTiles');

		this.timeMoved = 0;

		this.characterWidth = tileWidth;
		this.characterHeight = tileHeight;
		this.spriteX = spriteX;
		this.spriteY = spriteY;

		this.path = [];
		this.lastTile = {};
		this.isMoving = false;
		this.placeAt(initialTile);


		this.shouldDisplayHealthBar = false;
		this.fullHealth = 200;
		this.currentHealth = 160;
	}

	placeAt = ({x, y}) => {
		this.currentTile = {x, y};
		this.position = {
			x: (TILE_WIDTH * x) + ((TILE_WIDTH - this.characterWidth) / 2),
			y: (TILE_HEIGHT * y) + ((TILE_HEIGHT - this.characterHeight) / 2) // offset
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

	shouldBeDrawn = () => {
		return this.currentTile.x >= Camera.startColumn &&
			this.currentTile.x <= Camera.endColumn &&
			this.currentTile.y >= Camera.startRow &&
			this.currentTile.y <= Camera.endRow;
	}

	drawHealthBar = () => {
		const healthBarHeight = 3;

		const healthMissingPercent = (this.currentHealth / this.fullHealth) * 100;

		const widthHealth = (healthMissingPercent * this.characterWidth) / 100;
		const widthMissingHealth = this.characterWidth - widthHealth;

		CONTEXT.fillStyle = '#5BEC6E';
		CONTEXT.fillRect(
			this.position.x - Camera.x,
			this.position.y - Camera.y - 5,
			widthHealth,
			healthBarHeight
		);

		CONTEXT.fillStyle = '#FF5E62';
		CONTEXT.fillRect(
			this.position.x - Camera.x + widthHealth,
			this.position.y - Camera.y - 5,
			this.characterWidth - widthHealth,
			healthBarHeight
		);	
	}

	draw = () => {
		const currentFrameTime = Date.now();

		if(!this.move(currentFrameTime)) {
			if(this.currentTile.x !== this.lastTile.x || this.currentTile.y !== this.lastTile.y) {
				this.timeMoved = currentFrameTime;
			}
		}

		if(!this.shouldBeDrawn()) return;

		CONTEXT.drawImage(
			this.mapTiles,
			this.spriteX,
			this.spriteY,
			this.characterWidth,
			this.characterHeight,
			this.position.x - Camera.x,
			this.position.y - Camera.y,
			this.characterWidth,
			this.characterHeight
		);
		
		this.shouldDisplayHealthBar && this.drawHealthBar();
	}

	move = time => {
		if(!this.path.length) {
			this.isMoving = false;
			return false;
		}

		if(this.currentTile.x === this.lastTile.x && this.currentTile.y === this.lastTile.y) {
			return false;
		}

		if((time - this.timeMoved) >= GAME_SPEED) {
			this.placeAt(this.nextTile);
			this.path.shift();

			this.nextTile = this.path[0];
			this.timeMoved = Date.now();
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
		}

		this.isMoving = true;
		return true;
	}
};