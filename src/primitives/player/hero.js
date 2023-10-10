import Character from './character.js';
import GAME_CONFIG from '../../game-config.js';
import SpriteSheet from '../../spritesheet.js';
import CombatSystem from '../../core/combat-system.js';
import GameMap from '../../game-map.js';

import MovementSystem from '../../core/movement-system.js';

const {
	CONTEXT,
	GAME_MAPS,
	GAME_SPEED,
	TILE_WIDTH,
	TILE_HEIGHT,
	CHARACTERS_SPRITE,
} = GAME_CONFIG;

const {tileWidth, tileHeight} = CHARACTERS_SPRITE.hero;

export default class Hero extends Character {
	constructor(camera) {
		super(camera, GAME_MAPS['MAP_1'].hero.initialPosition, 'hero', tileWidth, tileHeight);

		this.camera = camera;
		this.movement = new MovementSystem(this);
	}

	revive = () => {
		this.currentHealth = this.stats.healthPoints;
		this.isCharacterAlive = true;
		this.actions = [];
		this.setCharacterMode('IDLE');
		this.placeAt(GAME_MAPS[GameMap.currentMap].hero.initialPosition);
	}

	setAction = ({type, target, path}) => {
		if(type === 'ATTACK') {//is movinghandler
			if(!Array.isArray(path)) return;

			if(path.length > 1) {
				console.log("path.length", path.length);
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
			if(this.currentTile.x !== this.movement.lastTile.x || this.currentTile.y !== this.movement.lastTile.y) {
				this.timeMoved = currentFrameTime;
			}
		}

		this.regenerateHealth(currentFrameTime);

		if(!this.shouldBeDrawn()) return;

		SpriteSheet.drawCharacter(this.characterType, this.mode, {
			positionX: this.position.x - this.camera.x,
			positionY: this.position.y - this.camera.y
		});
		
		this.shouldDisplayHealthBar && this.drawHealthBar();
		this.drawExperienceBar();
		this.drawCharacterName();
	}
};