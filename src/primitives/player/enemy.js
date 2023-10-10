import Character from './character.js';
import SpriteSheet from '../../spritesheet.js';
import GAME_CONFIG from '../../game-config.js';

const {
	CONTEXT,
	TILE_WIDTH,
	TILE_HEIGHT,
	GAME_SPEED,
	CHARACTERS_SPRITE,
} = GAME_CONFIG;

export default class Enemy extends Character {
	constructor(camera, initialTile, characterType) {
		const {tileWidth, tileHeight} = CHARACTERS_SPRITE[characterType];
		
		super(camera, initialTile, characterType, tileWidth, tileHeight);

		this.camera = camera;
	}

	draw = () => {
		const currentFrameTime = Date.now();

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