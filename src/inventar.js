import GAME_CONFIG from './game-config.js';

const {CANVAS, CONTEXT, CANVAS_WIDTH, CANVAS_HEIGHT, LEGEND, INVENTAR_WIDTH} = GAME_CONFIG;

export default new class Inventar {

	init = hero => {

	}

	setVisibility = visible => {
		this.isVisible = visible;
	}

	draw = () => {
		if(this.isVisible) {
			CONTEXT.globalAlpha = 0.8;
			CONTEXT.fillRect(CANVAS_WIDTH - INVENTAR_WIDTH, 0, INVENTAR_WIDTH, CANVAS_HEIGHT);
			CONTEXT.globalAlpha = 1.0;
		}
	}
}