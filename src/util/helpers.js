export const getRandomNumber = ([min, max]) => Math.floor(Math.random() * (max - min + 1)) + min;

export const generatePositionForNewEnemies = ([startRow, endRow, startColumn, endColumn]) => {
	return {
		x: getRandomNumber([startRow, endRow]),
		y: getRandomNumber([startColumn, endColumn])
	};
};

export const getCardinalPoint = (start, end) => {
	if(!start || !end) return 'IDLE';

	if(start.x === end.x) {
		if(start.y > end.y) {
			return 'NORTH';
		} else {
			return 'SOUTH';
		}
	} else if(start.y === end.y) {
		if(start.x > end.x) {
			return 'WEST';
		} else {
			return 'EAST';
		}
	} else {
		return 'IDLE';
	}
}