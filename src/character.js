import Assets from './assets-loader.js';
import Camera from './camera.js';
import CombatSystem from './combat-system.js';
import GAME_CONFIG from './game-config.js';
import {getCardinalPoint, getRandomNumber} from './util/helpers.js';

const {
	CHARACTER_STATS,
	CONTEXT,
	TILE_WIDTH,
	TILE_HEIGHT,
	GAME_SPEED,
	LEGEND,
} = GAME_CONFIG;

export default class Character {

	characterInit = (initialTile, characterType, characterSprite, characterWidth, characterHeight) => {
		this.characterLegend = LEGEND[characterType];
		this.characterSprite = characterSprite;

		this.timeMoved = 0;

		this.mode;
		this.spriteX;
		this.spriteY;

		this.characterWidth = characterWidth;
		this.characterHeight = characterHeight;

		this.path = [];
		this.lastTile = {};
		this.isMoving = false;
		this.isCharacterAlive = true;

		this.shouldDisplayHealthBar = true;

		this.placeAt(initialTile);
		this.setCharacterMode('IDLE');		
		this.setCharacterStats(CHARACTER_STATS[characterType]);

		this.currentHealth = this.stats.healthPoints;
	}

	setCharacterStats = stats => {
		this.stats = stats;
	}

	attack = character => {
		const attackDamage = getRandomNumber(this.stats.attackDamage);

		if(this.stats.criticalChance >= getRandomNumber([this.stats.criticalChance, 100])) {
			character.takeDamage(attackDamage * 2);
		} else {
			character.takeDamage(attackDamage);
		}
	}

	takeDamage = damage => {
		const {armor} = this.stats;

		if(damage > armor) {
			const healthLeft = this.currentHealth + armor - damage;

			if(healthLeft <= 0) {
				console.log('DIED')
				this.currentHealth = 0;
				this.isCharacterAlive = false;
				//killed
			} else {
				this.currentHealth -= (damage - armor);
			}		
		} else {
			console.log('miss');
		}
	}

	setCharacterMode = mode => {
		const {spriteX, spriteY} = this.characterLegend.mode[mode];

		this.mode = mode;

		this.spriteX = spriteX;
		this.spriteY = spriteY;
	}

	setAction = (target, getPath, action) => {
		switch(action) {
			case 'ATTACK'://is movinghandler
				CombatSystem.startFighting(this, target);
				//this.walkTo(target.currentTile, getPath);
				break;
			case 'INTERACT':

				break;
			case 'WALK':
				this.walkTo(target, getPath);
				break;
			default:
				return false;
		}
	}

	walkTo = (destination, getPath) => {
		const startTile = this.isMoving ? this.nextTile : this.currentTile;
		const newPath = getPath(startTile, destination);

		if(Array.isArray(newPath)) {
			this.setPath([startTile, ...newPath]);
		}
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
		if(!this.isCharacterAlive) {
			return false;
		} else {
			return this.currentTile.x >= Camera.startColumn &&
				this.currentTile.x <= Camera.endColumn &&
				this.currentTile.y >= Camera.startRow &&
				this.currentTile.y <= Camera.endRow;
		}
	}

	drawHealthBar = () => {
		const healthBarHeight = 3;

		const healthMissingPercent = (this.currentHealth / this.stats.healthPoints) * 100;

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
			widthMissingHealth,
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
			this.characterSprite,
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
		if(!this.isCharacterAlive || !this.path.length || (this.currentTile.x === this.lastTile.x && this.currentTile.y === this.lastTile.y)) {
			return false;
		}

		if((time - this.timeMoved) >= GAME_SPEED) {
			this.placeAt(this.nextTile);
			this.path.shift();

			this.nextTile = this.path[0];
			this.timeMoved = Date.now();

			if(!this.path.length) {
				this.isMoving = false;				
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
};