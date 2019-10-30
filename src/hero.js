import Character from './character.js';
import Assets from './assets-loader.js';
import GAME_CONFIG from './game-config.js';

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
	}

	init = initialTile => {
		const {tileWidth, tileHeight} = CHARACTERS_SPRITE.hero;

		this.characterInit(initialTile, 'hero', tileWidth, tileHeight);
	}

	revive = () => {
		this.currentHealth = this.stats.healthPoints;
		this.isCharacterAlive = true;
		this.setCharacterMode('IDLE');
		this.placeAt({
			x: 1,
			y: 1
		});
	}
};