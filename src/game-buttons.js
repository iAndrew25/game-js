import Assets from './assets-loader.js';
import GAME_CONFIG from './game-config.js';

const {CANVAS, CONTEXT, TILE_WIDTH, TILE_HEIGHT, CANVAS_WIDTH, CANVAS_HEIGHT, LEGEND} = GAME_CONFIG;

export default new class GameButtons {
	draw = () => {
		CONTEXT.drawImage(
			Assets.getImage('mapTiles'),
			90,
			45,

			TILE_WIDTH / 2,
			TILE_HEIGHT / 2,

			TILE_WIDTH / 2 - 15,
			CANVAS_HEIGHT - TILE_HEIGHT / 2 - 15 / 2,

			TILE_WIDTH / 2,
			TILE_HEIGHT / 2
		)
	}
}