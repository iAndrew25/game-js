import Character from './character.js';
import Assets from './util/assets-loader.js';
import GAME_CONFIG from './game-config.js';
import SpriteSheet from './spritesheet.js';
import Camera from './camera.js'
import CombatSystem from './combat-system.js';

import MovementSystem from './movement-system.js';

const {
	CONTEXT,
	TILE_WIDTH,
	TILE_HEIGHT,
	GAME_SPEED,
	CHARACTERS_SPRITE,
} = GAME_CONFIG;

export default new class Hero extends Character {

	constructor() {
		super();

		this.movement = new MovementSystem(this);
	}

	init = initialTile => {
		const {tileWidth, tileHeight} = CHARACTERS_SPRITE.hero;

		this.characterInit(initialTile, 'hero', tileWidth, tileHeight);
	}

	revive = () => {
		this.currentHealth = this.stats.healthPoints;
		this.isCharacterAlive = true;
		this.actions = [];
		this.setCharacterMode('IDLE');
		this.placeAt({
			x: 1,
			y: 1
		});
	}

	setAction = ({type, target, path}) => {
		if(type === 'ATTACK') {//is movinghandler
			if(!Array.isArray(path)) return;

			if(path.length > 1) {
				this.actions = [{
					type: 'WALK',
					target: {currentTile: path[path.length - 1]}
				}, {
					type: 'ATTACK',
					target
				}];

				this.movement.setPath(path);
			} else {
				CombatSystem.startFighting(this, target);
			}
			return;
		}

		//case 'INTERACT':
		//	this.interact(target, getPath);
		//	break;

		if(type === 'WALK') {
			this.actions = [{
				type: 'WALK',
				target: target
			}];

			this.movement.setPath(path);
			return;
		}
	}

	draw = () => {
		const currentFrameTime = Date.now();

		if(!this.movement.move(currentFrameTime)) {
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
};