import Assets from './assets-loader.js';
import SpriteSheet from './spritesheet.js';
import Camera from './camera.js';
import CombatSystem from './combat-system.js';
import GAME_CONFIG from './game-config.js';
import {getCardinalPoint, getRandomNumber, isFunction, addTimeBonus, getExperienceData, getBarSizes} from './util/helpers.js';

const {
	CHARACTER_STATS,
	CONTEXT,
	TILE_WIDTH,
	TILE_HEIGHT,
	GAME_SPEED,
	DEFAULT_ATTACK_SPEED,
	LEVELS_EXPERIENCE
} = GAME_CONFIG;

export default class Character {

	characterInit = (initialTile, characterType, characterWidth, characterHeight) => {
		this.name = 'Mr. Burete';

		this.level = 0;
		this.experience = 0;
		this.experiencePercent = 0;
		this.nextLevelExperience = 0;
		this.currentLevelExperience = 0;

		this.characterType = characterType;

		this.timeMoved = 0;
		this.lastRegeneration = 0;

		this.mode;
		this.sourceX;
		this.sourceY;

		this.stats;
		this.attackDuration;

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
		this.setAttackDuration();
		this.setExperience(0);

		this.currentHealth = this.stats.healthPoints;
	}

	setExperience = newExp => {
		this.experience += newExp;

		this.setLevel();
		console.log("this.level", this.level);
	};

	setLevel = () => {
		const {level, experiencePercent, nextLevelExperience, currentLevelExperience} = getExperienceData(this.level, this.experience, LEVELS_EXPERIENCE);

		this.level = level;
		this.experiencePercent = experiencePercent;
		this.nextLevelExperience = nextLevelExperience;
		this.currentLevelExperience = currentLevelExperience;
	};

	setCharacterStats = stats => {
		this.stats = stats;
	}

	setAttackDuration = () => {
		this.attackDuration = DEFAULT_ATTACK_SPEED - (DEFAULT_ATTACK_SPEED * this.stats.attackSpeed) / 100;
	}

	attack = character => {
		if(this.isCharacterAlive) {
			const attackDamage = getRandomNumber(this.stats.attackDamage);

			if(this.stats.criticalChance >= getRandomNumber([this.stats.criticalChance, 100])) {
				character.takeDamage(attackDamage * 2);
			} else {
				character.takeDamage(attackDamage);
			}
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
		this.mode = mode;
	}

	initiateFight = (enemy, getPath) => {
		this.walkTo({
			destination: enemy.currentTile, 
			getPath, 
			willInteract: true
		});

		this.onArriveAction = () => {
			// this.setCharacterMode('ATTACK');
			CombatSystem.startFighting(this, enemy);

			this.onArriveAction = null;
		}
	}

	interact = (target, getPath) => {
		this.walkTo({
			destination: enemy.currentTile, 
			getPath, 
			willInteract: true
		});

		this.onArriveAction = () => {
			//open popup
			this.setCharacterMode('INTERACT');
		//	CombatSystem.startFighting(this, enemy);

			this.onArriveAction = null;
		}
	}

// walk only on idle
	setAction = (target, getPath, actionType) => {
		switch(actionType) {
			case 'ATTACK'://is movinghandler
				this.initiateFight(target, getPath);
				break;

			case 'INTERACT':
				this.interact(target, getPath);
				break;

			case 'WALK':
				this.walkTo({
					destination: target, 
					getPath, 
					willInteract: false
				});

				this.onArriveAction;
				break;

			default:
				return false;
		}
	}

	walkTo = ({destination, getPath, willInteract}) => {
		const startTile = this.isMoving ? this.nextTile : this.currentTile;
		const newPath = getPath(startTile, destination);


		if(Array.isArray(newPath)) {
			willInteract && newPath.pop();
			
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
			return (
				this.currentTile.x >= Camera.startColumn &&
				this.currentTile.x <= Camera.endColumn &&
				this.currentTile.y >= Camera.startRow &&
				this.currentTile.y <= Camera.endRow
			);
		}
	}

	drawHealthBar = () => {
		const {valueWidth, leftValueWidth} = getBarSizes(this.currentHealth, this.stats.healthPoints, this.characterWidth);
		const healthBarHeight = 3;

		CONTEXT.fillStyle = '#5BEC6E';
		CONTEXT.fillRect(
			this.position.x - Camera.x,
			this.position.y - Camera.y - 6,
			valueWidth,
			healthBarHeight
		);

		CONTEXT.fillStyle = '#FF5E62';
		CONTEXT.fillRect(
			this.position.x - Camera.x + valueWidth,
			this.position.y - Camera.y - 6,
			leftValueWidth,
			healthBarHeight
		);
	}

	drawExperienceBar = () => {
		const {valueWidth, leftValueWidth} = getBarSizes(this.experience - this.currentLevelExperience, this.nextLevelExperience - this.currentLevelExperience, this.characterWidth);
		const experienceBarHeight = 1;

		CONTEXT.fillStyle = '#0288d1';
		CONTEXT.fillRect(
			this.position.x - Camera.x,
			this.position.y - Camera.y - 3,
			valueWidth,
			experienceBarHeight
		);

		CONTEXT.fillStyle = '#b3e5fc';
		CONTEXT.fillRect(
			this.position.x - Camera.x + valueWidth,
			this.position.y - Camera.y - 3,
			leftValueWidth,
			experienceBarHeight
		);
	}

	drawCharacterName = () => {
		CONTEXT.textAlign = 'center';
		CONTEXT.fillStyle = '#FFFFFF';
		CONTEXT.fillText(
			`Lv. ${this.level} ${this.name}`, 
			this.position.x - Camera.x + this.characterWidth / 2, 
			this.position.y - Camera.y - 13
		);
	}

	regenerateHealth = time => {
		if(this.currentHealth >= this.stats.healthPoints || this.mode === 'ATTACK') return;

		if(time - this.lastRegeneration >= addTimeBonus(GAME_SPEED, this.stats.healthPointsRegeneration)) {
			this.currentHealth += 1;
			this.lastRegeneration = new Date();
		}
	}

	draw = () => {
		const currentFrameTime = Date.now();

		if(!this.move(currentFrameTime)) {
			if(this.currentTile.x !== this.lastTile.x || this.currentTile.y !== this.lastTile.y) {
				this.timeMoved = currentFrameTime;
			}
		}

		this.regenerateHealth(currentFrameTime);

		if(!this.shouldBeDrawn()) return;

		SpriteSheet.drawCharacter(this.characterType, this.mode, {
			positionX: this.position.x - Camera.x,
			positionY: this.position.y - Camera.y
		});
		
		this.shouldDisplayHealthBar && this.drawHealthBar();
		this.drawExperienceBar();
		this.drawCharacterName();
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
				this.nextTile = {};
				isFunction(this.onArriveAction) && this.onArriveAction();
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
};