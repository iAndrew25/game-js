import Assets from './assets-loader.js';
import Inventar from './inventar.js';
import GAME_CONFIG from './game-config.js';

const {CANVAS, CONTEXT, TILE_WIDTH, TILE_HEIGHT, CANVAS_WIDTH, CANVAS_HEIGHT, LEGEND} = GAME_CONFIG;

export default new class GameButtons {

	constructor() {
		this.gameButtonsTiles = Assets.getImage('mapTiles');

		this.gameButtons = [{
			type: 'Open inventar',
			width: TILE_WIDTH / 2,
			height: TILE_HEIGHT / 2,
			sourceX: 90,
			sourceY: 45,
			x: TILE_WIDTH / 2 - 15,
			y: CANVAS_HEIGHT - TILE_HEIGHT / 2 - 15 / 2
		}]
	}

	checkPosition = ({x, y}) => {
		const xx = this.gameButtons.find(button => {
			if(x && y && x >= button.x && x < button.x + button.width && y >= button.y && y < button.y + button.height) {
				return true;
			} else {
				return false;
			}
		});

		if(xx) {
			Inventar.setVisibility(!Inventar.isVisible);
		}
		return xx;
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