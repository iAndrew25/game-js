export const getRandomNumber = ([min, max]) => Math.floor(Math.random() * (max - min + 1)) + min;

export const generatePositionForNewEnemies = ([startRow, endRow, startColumn, endColumn]) => {
	return {
		x: getRandomNumber([startRow, endRow]),
		y: getRandomNumber([startColumn, endColumn])
	};
};