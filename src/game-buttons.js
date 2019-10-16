import Assets from './assets-loader.js';
import Inventar from './inventar.js';
import {isHovered} from './util/helpers.js';
import GAME_CONFIG from './game-config.js';

const {CANVAS, CONTEXT, TILE_WIDTH, TILE_HEIGHT, CANVAS_WIDTH, CANVAS_HEIGHT, LEGEND} = GAME_CONFIG;

export default new class GameButtons {

	constructor() {
		this.gameButtonsTiles = Assets.getImage('mapTiles');

		this.gameButtons = [{
			type: 'INVENTAR',
			width: TILE_WIDTH / 2,
			height: TILE_HEIGHT / 2,
			sourceX: 90,
			sourceY: 45,
			x: TILE_WIDTH / 2 - 15,
			y: CANVAS_HEIGHT - TILE_HEIGHT / 2 - 15 / 2
		}]
	}

	handleClickOnPosition = ({positionX, positionY}) => {
		console.log("positionY", positionY);
		console.log("positionX", positionX);
		const button = this.checkPosition({positionX, positionY});
		console.log("button", button);

		if(!button) return;

		if(button.type === 'INVENTAR') Inventar.setVisibility(!Inventar.isVisible);
	}

	checkPosition = ({positionX, positionY}) => {
		return this.gameButtons.find(({width, height, x, y}) => isHovered(positionX, positionY, width, height, x, y));
	}

	draw = () => {
		this.gameButtons.forEach(({width, height, sourceX, sourceY, x, y}) => {
			CONTEXT.drawImage(
				Assets.getImage('mapTiles'),
				sourceX,
				sourceY,
				width,
				height,
				x,
				y,
				width,
				height
			)
		});
	}
}