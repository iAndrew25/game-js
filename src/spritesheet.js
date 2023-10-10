import Assets from './util/assets-loader.js';
import GAME_CONFIG from './game-config.js';

const {CANVAS, CONTEXT, CANVAS_WIDTH, CANVAS_HEIGHT, CHARACTERS_SPRITE, MAP_SPRITE} = GAME_CONFIG;

export default new class SpriteSheet {
	drawTile = (tile, tileMode, {positionX, positionY}) => {
		const {tileWidth, tileHeight, sourceX, sourceY, ...tileModes} = MAP_SPRITE[tile];

		CONTEXT.drawImage(
			Assets.getImage('mapSprite'),
			tileModes[tileMode] ? tileModes[tileMode].sourceX : sourceX,
			tileModes[tileMode] ? tileModes[tileMode].sourceY : sourceY,
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
