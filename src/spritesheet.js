import Assets from './assets-loader.js';
import GAME_CONFIG from './game-config.js';

const {CANVAS, CONTEXT, CANVAS_WIDTH, CANVAS_HEIGHT, LEGEND, CHARACTERS_SPRITE, MAP_SPRITE} = GAME_CONFIG;

export default new class SpriteSheet {

	drawTile = (tile, {positionX, positionY}) => {
		const {tileWidth, tileHeight, sourceX, sourceY} = MAP_SPRITE[tile];

		CONTEXT.drawImage(
			Assets.getImage('mapSprite'),
			sourceX,
			sourceY,
			tileWidth,
			tileHeight,
			positionX,
			positionY,
			tileWidth,
			tileHeight
		);
	}

	drawCharacter = (name, charMode, {positionX, positionY}) => {
		const {tileWidth, tileHeight, mode} = CHARACTERS_SPRITE[name];
		const {sourceX, sourceY} = mode[charMode];

		CONTEXT.drawImage(
			Assets.getImage('charactersSprite'),
			sourceX,
			sourceY,
			tileWidth,
			tileHeight,
			positionX,
			positionY,
			tileWidth,
			tileHeight
		);
	}
};
