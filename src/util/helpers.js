export const getRandomNumber = ([min, max]) => Math.floor(Math.random() * (max - min + 1)) + min;

export const generatePositionForNewEnemies = ([startRow, endRow, startColumn, endColumn]) => {
	return {
		x: getRandomNumber([startRow, endRow]),
		y: getRandomNumber([startColumn, endColumn])
	};
};

export const isFunction = fn => typeof fn === 'function';

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
};

export const isHovered = (positionX, positionY, width, height, sourceX, sourceY) => ( // tileWidth tileHeight
	positionX && 
	positionY && 
	positionX >= sourceX &&
	positionY >= sourceY &&
	positionX < sourceX + width &&
	positionY < sourceY + height
);