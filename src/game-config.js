const CANVAS = document.getElementsByTagName('canvas')[0];
const CONTEXT = CANVAS.getContext('2d');

const GAME_MAPS = {
	MAP_1: {
		layers: [[
			[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
			[1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
			[1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0, 0, 0, 1, 0, 1, 0, 1, 1, 1],
			[1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
			[1, 0, 1, 0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1],
			[1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
			[1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1],
			[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 0, 0, 0, 1],
			[1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
			[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
		]]
	}
};

const LEGEND = {
	1: {
		spriteX: 0,
		spriteY: 0,
		isWalkable: false
	},
	0: {
		spriteX: 100,
		spriteY: 0,
		isWalkable: true
	}
}

export default {
	CANVAS,
	CONTEXT,
	GAME_MAPS,
	LEGEND,
	TILE_WIDTH: 100,
	TILE_HEIGHT: 50,
	MAP_HEIGHT: 10,
	MAP_WIDTH: 20,
	CANVAS_WIDTH: 600,
	CANVAS_HEIGHT: 300,
	GAME_SPEED: 300
};