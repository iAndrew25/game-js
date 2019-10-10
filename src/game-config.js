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
		]],
		enemies: {
			types: ['black', 'blue', 'green'],
			spawnArea: {
				black: [[1, 1, 3, 3]],
				blue: [[1, 10, 3, 14]],
				green: [[6, 1, 8, 3]],
			}
		}
	}
};

const LEGEND = {
	0: {
		spriteX: 0,
		spriteY: 0
	},
	1: {
		spriteX: 60,
		spriteY: 0,
		isWalkable: false
	},
	hero: {
		spriteX: 30,
		spriteY: 30,
		mode: {
			IDLE: {
				spriteX: 0,
				spriteY: 0,
			},
			EAST: {
				spriteX: 90, //temp
				spriteY: 0
			},
			WEST: {
				spriteX: 90, //temp
				spriteY: 15
			},
			NORTH: {
				spriteX: 90, //temp
				spriteY: 30
			},
			SOUTH: {
				spriteX: 90, //temp
				spriteY: 45
			}
		},
		tileWidth: 30,
		tileHeight: 15
	},
	black: {
		spriteX: 0,
		spriteY: 30,
		tileWidth: 30,
		tileHeight: 15
	},
	blue: {
		spriteX: 60,
		spriteY: 30,
		tileWidth: 30,
		tileHeight: 15
	},
	green: {
		spriteX: 90,
		spriteY: 30,
		tileWidth: 30,
		tileHeight: 15
	}
};

export default {
	CANVAS,
	CONTEXT,
	GAME_MAPS,
	LEGEND,
	TILE_WIDTH: 60,
	TILE_HEIGHT: 30,
	MAP_HEIGHT: 10,
	MAP_WIDTH: 20,
	CANVAS_WIDTH: 600,
	CANVAS_HEIGHT: 300,
	GAME_SPEED: 900
};