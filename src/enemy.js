import Character from './character.js';
import Assets from './util/assets-loader.js';
import SpriteSheet from './spritesheet.js';
import Camera from './camera.js';
import GAME_CONFIG from './game-config.js';

const {
	CONTEXT,
	TILE_WIDTH,
	TILE_HEIGHT,
	GAME_SPEED,
	CHARACTERS_SPRITE,
} = GAME_CONFIG;

export default class Enemy extends Character {
	constructor(initialTile, characterType) {
		const {tileWidth, tileHeight} = CHARACTERS_SPRITE[characterType];
		
		super(initialTile, characterType, tileWidth, tileHeight);		
	}

	draw = () => {
		const currentFrameTime = Date.now();

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