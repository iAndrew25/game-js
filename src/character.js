import Assets from './util/assets-loader.js';
import SpriteSheet from './spritesheet.js';
import Camera from './camera.js';
import CombatSystem from './combat-system.js';
import GAME_CONFIG from './game-config.js';
import {getCardinalPoint, getRandomNumber, isFunction, addTimeBonus, getExperienceData, getBarSizes, getBonusWithRates} from './util/helpers.js';

const {
	CHARACTER_STATS,
	CONTEXT,
	TILE_WIDTH,
	TILE_HEIGHT,
	GAME_SPEED,
	DEFAULT_ATTACK_SPEED,
	LEVELS_EXPERIENCE,
	LEVEL_UP_RATES
} = GAME_CONFIG;

export default class Character {

	characterInit = (initialTile, characterType, characterWidth, characterHeight) => {
		console.log("initialTile", initialTile);
		this.name = 'Mr. Burete';

		this.level = 1;
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
		this.setCharacterStats();
		this.setAttackDuration();
		this.setExperience(0);

		this.setFullHealthPoints();

		this.actions = [];
	}

	setFullHealthPoints = () => {
		this.currentHealth = this.stats.healthPoints;
	}

	setExperience = newExp => {
		this.experience += newExp;

		this.setLevel();
	};

	setLevel = () => {
		const {level, experiencePercent, nextLevelExperience, currentLevelExperience} = getExperienceData(this.level, this.experience, LEVELS_EXPERIENCE);

		if(this.level !== level) {
			this.level = level;

			this.setCharacterStats();
			this.setFullHealthPoints();
		}
		
		this.nextLevelExperience = nextLevelExperience;
		this.experiencePercent = experiencePercent;
		this.currentLevelExperience = currentLevelExperience;
	};

	setCharacterStats = () => {
		const {healthPoints, attackDamage, armor, ...rest} = CHARACTER_STATS[this.characterType];
		// items

		this.stats = {
			...rest,
			armor: getBonusWithRates(armor, LEVEL_UP_RATES.armor, this.level),
			healthPoints: getBonusWithRates(healthPoints, LEVEL_UP_RATES.healthPoints, this.level),
			attackDamage: [
				getBonusWithRates(attackDamage[0], LEVEL_UP_RATES.attackDamage, this.level), 
				getBonusWithRates(attackDamage[1], LEVEL_UP_RATES.attackDamage, this.level)
			]
		};
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

	placeAt = ({x, y}) => {
		this.currentTile = {x, y};
		this.position = {
			x: (TILE_WIDTH * x) + ((TILE_WIDTH - this.characterWidth) / 2),
			y: (TILE_HEIGHT * y) + ((TILE_HEIGHT - this.characterHeight) / 2) // offset
		};

		this.checkActions();
	}

	checkActions = () => {
		if(!Array.isArray(this.actions) || !this.actions.length) return;

		const [{type, target}] = this.actions;

		if(this.actions[0].type === 'WALK') {
			const [{type, target} = {}] = this.actions;

			if(target.currentTile.x === this.currentTile.x && target.currentTile.y === this.currentTile.y) {
				this.actions.shift();
			}			
		}

		if(!Array.isArray(this.actions) || !this.actions.length) return;
		if(this.actions[0].type === 'ATTACK') {
			const [{type, target} = {}] = this.actions;

			if(!target.isCharacterAlive) {
				this.actions.shift();
			} else {
				CombatSystem.startFighting(this, target);
			}
		}
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
			this.lastRegeneration = Date.now();
		}
	}
};