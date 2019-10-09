import Map from './map.js';
import Character from './character.js';

import {generatePositionForNewEnemies} from './util/helpers.js';
import GAME_CONFIG from './game-config.js';

const {
	GAME_MAPS
} = GAME_CONFIG;

export default new class Enemies {
	constructor() {
		this.enemies = []; 
	}

	generateEnemies = () => {
		console.log('generate');
		GAME_MAPS['MAP_1'].enemies.types.forEach(enemy => {
			this.enemies.push(new Character(generatePositionForNewEnemies(GAME_MAPS['MAP_1'].enemies.spawnArea[enemy][0]), enemy));
		});
	}

	draw = () => {
		this.enemies.forEach(enemy => enemy.draw());
	}
}