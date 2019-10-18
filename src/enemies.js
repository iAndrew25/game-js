import Map from './map.js';
import Enemy from './enemy.js';
import Assets from './assets-loader.js';

import {generatePositionForNewEnemies} from './util/helpers.js';
import GAME_CONFIG from './game-config.js';

const {
	GAME_MAPS,
} = GAME_CONFIG;

export default new class Enemies {
	constructor() {
		this.currentMap;
		this.enemies = {}; 
	}

	generateEnemies = map => {
		this.currentMap = map;
		this.enemies[map] = GAME_MAPS[map].enemies.types.reduce((enemies, enemy) => {
			const {x, y} = generatePositionForNewEnemies(GAME_MAPS[map].enemies.spawnArea[enemy][0]);

			return {
				...enemies,
				[`${x}_${y}`]: new Enemy({x, y}, enemy)
			};
		}, {});
	}

	isEnemyHere = ({x, y}) => {
		return this.enemies[this.currentMap][`${x}_${y}`];
	}

	removeEnemy = ({x, y}) => {
		delete this.enemies[this.currentMap][`${x}_${y}`];
	}

	draw = () => {
		Object.values(this.enemies[this.currentMap]).forEach(enemy => enemy.draw());
	}
}