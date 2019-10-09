import Character from './character.js';

export default new class Hero extends Character {
	constructor() {

	}

	init = initialTile => {
		this.placeAt(initialTile);
	}
};