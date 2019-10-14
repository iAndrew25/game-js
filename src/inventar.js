import GAME_CONFIG from './game-config.js';

const {CANVAS, CONTEXT, CANVAS_WIDTH, CANVAS_HEIGHT, LEGEND} = GAME_CONFIG;

export default new class Inventar {
	init = hero => {

	}

	setVisibility = visible => {
		this.isVisible = visible;
	}

	draw = () => {
		if(this.isVisible) {
			CONTEXT.globalAlpha = 0.5;
			CONTEXT.fillRect(CANVAS_WIDTH - 180, 0, 180, CANVAS_HEIGHT);
			CONTEXT.globalAlpha = 1.0;
		}
	}
}