import Assets from './util/assets-loader.js';
import Inventar from './inventar.js';
import {isHovered} from './util/helpers.js';
import GAME_CONFIG from './game-config.js';

const {CANVAS, CONTEXT, TILE_WIDTH, TILE_HEIGHT, CANVAS_WIDTH, CANVAS_HEIGHT, BUTTONS_SPRITE} = GAME_CONFIG;

export default new class GameButtons {

	constructor() {
		const {inventar} = BUTTONS_SPRITE;

		this.gameButtons = [{
			positionX: TILE_WIDTH / 2 - inventar.tileWidth / 2,
			positionY: CANVAS_HEIGHT - TILE_HEIGHT / 2 - inventar.tileHeight / 2,
			...inventar
		}];
	}

	handleClickOnPosition = ({positionX, positionY}) => {
		const button = this.checkPosition({positionX, positionY});

		if(!button) return;

		if(button.type === 'INVENTAR') Inventar.setVisibility(!Inventar.isVisible);
	}

	checkPosition = mapPosition => {
		return this.gameButtons.find(({tileWidth, tileHeight, positionX, positionY}) => 
			isHovered(mapPosition.positionX, mapPosition.positionY, tileWidth, tileHeight, positionX, positionY)
		);
	}

	draw = () => {
		this.gameButtons.forEach(({tileWidth, tileHeight, sourceX, sourceY, positionX, positionY}) => {
			CONTEXT.drawImage(
				Assets.getImage('buttonsSprite'),
				sourceX,
				sourceY,
				tileWidth,
				tileHeight,
				positionX,
				positionY,
				tileWidth,
				tileHeight
			);
		});
	}
}