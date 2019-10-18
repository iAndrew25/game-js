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

export default class Enemy extends Character {
	constructor(initialTile, characterType) {
		super();
		
		const {tileWidth, tileHeight} = CHARACTERS_SPRITE[characterType];

		this.characterInit(initialTile, characterType, tileWidth, tileHeight);
	}
};