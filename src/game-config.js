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
		},
		hero: {
			initialPosition: {
				x: 1,
				y: 1
			}
		}
	}
};

const MAP_SPRITE = {
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
	}	
};

const BUTTONS_SPRITE = {
	inventar: {
		type: 'INVENTAR',
		tileWidth: 30,
		tileHeight: 15,
		sourceX: 0,
		sourceY: 0
	}
};

const CHARACTERS_SPRITE = {
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
				sourceY: 75,
			},
			ATTACK: {
				sourceX: 0,
				sourceY: 75,
			}			
		}
	},
	blue: {
		tileWidth: 30,
		tileHeight: 15,
		mode: {
			IDLE: {
				sourceX: 30,
				sourceY: 75,
			},
			ATTACK: {
				sourceX: 30,
				sourceY: 75,
			}
		}
	},
	green: {
		tileWidth: 30,
		tileHeight: 15,
		mode: {
			IDLE: {
				sourceX: 60,
				sourceY: 75,
			},
			ATTACK: {
				sourceX: 60,
				sourceY: 75,
			}
		}
	}
}

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
	experienceRate: 0,
	defaultExperienceRate: 1.45
};

const CHARACTER_STATS = {
	hero: {
		healthPoints: 200,
		healthPointsRegeneration: 3,
		attackDamage: [8, 12],
		criticalChance: 0,
		attackSpeed: 5,
		armor: 1
	},
	green: {
		healthPoints: 300,
		healthPointsRegeneration: 30,
		attackDamage: [2, 5],
		criticalChance: 0,
		attackSpeed: 0,
		armor: 1
	},
	blue: {
		healthPoints: 300,
		healthPointsRegeneration: 30,
		attackDamage: [2, 5],
		criticalChance: 0,
		attackSpeed: 5,
		armor: 2
	},
	black: {
		healthPoints: 300,
		healthPointsRegeneration: 30,
		attackDamage: [2, 5],
		criticalChance: 0,
		attackSpeed: 20,
		armor: 0
	}
};

const LEVELS_EXPERIENCE = [0, 5, 15, 21, 30, 44, 64, 93, 135, 195, 283, 411, 596, 864, 1253, 1816, 2633, 3818, 5537, 8028, 11641, 16880, 24475, 35489, 51459, 74616, 108193, 156880, 227476, 329841];

const GAME_SPEED = 300;
const DEFAULT_ATTACK_SPEED = GAME_SPEED / 2;

export default {
	LEVEL_UP_RATES,
	LEVELS_EXPERIENCE,
	DEFAULT_ATTACK_SPEED,
	GAME_SPEED,
	CHARACTERS_SPRITE,
	BUTTONS_SPRITE,
	MAP_SPRITE,
	CANVAS,
	CONTEXT,
	GAME_MAPS,
	CHARACTER_STATS,
	TILE_WIDTH: 60,
	TILE_HEIGHT: 30,
	MAP_HEIGHT: 10,
	MAP_WIDTH: 20,
	CANVAS_WIDTH: 600,
	CANVAS_HEIGHT: 300,
	INVENTAR_WIDTH: 180
};