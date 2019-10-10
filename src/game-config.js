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
		tileWidth: 30,
		tileHeight: 15,
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
	},
	black: {
		tileWidth: 30,
		tileHeight: 15,
		mode: {
			IDLE: {
				spriteX: 0,
				spriteY: 30,
			}
		}
	},
	blue: {
		tileWidth: 30,
		tileHeight: 15,
		mode: {
			IDLE: {
				spriteX: 60,
				spriteY: 30,
			}
		}
	},
	green: {
		tileWidth: 30,
		tileHeight: 15,
		mode: {
			IDLE: {
				spriteX: 90,
				spriteY: 30,
			}
		}
	}
};

const CHARACTER_STATS = {
	hero: {
		healthPoints: 200,
		healthPointsRegenration: 3,
		attackDamage: [8, 12],
		criticalChance: 0,
		attackSpeed: 5,
		armor: 0
	},
	green: {
		healthPoints: 100,
		attackDamage: [2, 4],
		criticalChance: 0,
		attackSpeed: 0,
		armor: 1
	},
	blue: {
		healthPoints: 70,
		attackDamage: [3, 6],
		criticalChance: 0,
		attackSpeed: 5,
		armor: 2
	},
	black: {
		healthPoints: 80,
		attackDamage: [4, 5],
		criticalChance: 0,
		attackSpeed: 20,
		armor: 0
	}
};

export default {
	CANVAS,
	CONTEXT,
	GAME_MAPS,
	LEGEND,
	CHARACTER_STATS,
	TILE_WIDTH: 60,
	TILE_HEIGHT: 30,
	MAP_HEIGHT: 10,
	MAP_WIDTH: 20,
	CANVAS_WIDTH: 600,
	CANVAS_HEIGHT: 300,
	GAME_SPEED: 500
};