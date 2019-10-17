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
		tileWidth: 60,
		tileHeight: 30,
		sourceX: 0,
		sourceY: 0,
		isWalkable: true
	},
	1: {
		tileWidth: 60,
		tileHeight: 30,
		sourceX: 60,
		sourceY: 0,
		isWalkable: false
	},
	hero: {
		tileWidth: 30,
		tileHeight: 15,
		mode: {
			IDLE: {
				sourceX: 0,
				sourceY: 0,
			},
			EAST: {
				sourceX: 90, //temp
				sourceY: 0
			},
			WEST: {
				sourceX: 90, //temp
				sourceY: 15
			},
			NORTH: {
				sourceX: 90, //temp
				sourceY: 30
			},
			SOUTH: {
				sourceX: 90, //temp
				sourceY: 45
			},
			ATTACK: {
				sourceX: 0, //temp
				sourceY: 60
			}
		},
	},
	black: {
		tileWidth: 30,
		tileHeight: 15,
		mode: {
			IDLE: {
				sourceX: 0,
				sourceY: 30,
			},
			ATTACK: {
				sourceX: 0,
				sourceY: 30,
			}			
		}
	},
	blue: {
		tileWidth: 30,
		tileHeight: 15,
		mode: {
			IDLE: {
				sourceX: 60,
				sourceY: 30,
			},
			ATTACK: {
				sourceX: 60,
				sourceY: 30,
			}
		}
	},
	green: {
		tileWidth: 30,
		tileHeight: 15,
		mode: {
			IDLE: {
				sourceX: 90,
				sourceY: 30,
			},
			ATTACK: {
				sourceX: 90,
				sourceY: 30,
			}
		}
	}
};

const ITEMS_STATS = {
	swords: {
		lightSword: {
			damage: [2, 4],
			attackSpeed: 0,
			criticalChance: 0,
			characterLevel: 1,

		}
	},
	armors: {
		lightArmor: {
			armor: 0,
			healthPoints: 10
		}
	}
};

const BONUS_STATS = {
	lifeSteal: [0, 0],
	loot: 0,
	poison: 0
};

const LEVEL_UP_RATES = {
	healthPoints: 1.04,
	attackDamage: 1.07,
	armor: 1.12
}

const GAME_RATES = {
	dropRate: 0,
	experienceRate: 0
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
	INVENTAR_WIDTH: 180,
	GAME_SPEED: 500
};