import Character from './character.js';
import Assets from './assets-loader.js';
import GAME_CONFIG from './game-config.js';

const {
	CONTEXT,
	TILE_WIDTH,
	TILE_HEIGHT,
	GAME_SPEED,
	LEGEND,
} = GAME_CONFIG;

export default new class Hero extends Character {

	constructor() {
		super();
	}

	init = initialTile => {
		const {tileWidth, tileHeight} = LEGEND.hero;

		this.characterInit(initialTile, 'hero', tileWidth, tileHeight)		
	}
};