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

export const isHovered = (positionX, positionY, tileWidth, tileHeight, sourceX, sourceY) => (
	positionX &&
	positionY &&
	positionX >= sourceX &&
	positionY >= sourceY &&
	positionX < sourceX + tileWidth &&
	positionY < sourceY + tileHeight
);

export const addTimeBonus = (value, bonus) => value - (value * bonus / 100);

export const addBonus = (value, bonus) => value + (value * bonus / 100);

export const getPercent = (value, fullValue) => value / fullValue * 100;

export const isBetween = (value, [min, max]) => value >= min && value < max;

export const getLevelByExperience = (experience, experienceLevels) => {
	const currentLevelIndex = experienceLevels.findIndex((item, key, list) => {
		const nextItem = list[key+1];

		if(nextItem && isBetween(experience, [item, nextItem])) {
			return true;
		} else {
			return false;
		}
	});

	if(currentLevelIndex !== -1) {
		const nextLevelExperience = experienceLevels[currentLevelIndex + 1];
		const currentLevelExperience = experienceLevels[currentLevelIndex];

		if(nextLevelExperience !== undefined && currentLevelExperience !== undefined) {
			return {
				nextLevelExperience,
				experiencePercent: getPercent(experience, nextLevelExperience),
				level: currentLevelIndex + 1
			}
		} else {
			console.log('fail 1')
			return {
				nextLevelExperience: 0,
				experiencePercent: 0,
				level: currentLevelIndex + 1
			};
		}
	} else {
			console.log('fail 2')
		return {
			nextLevelExperience: 0,
			experiencePercent: 0,
			level: 0
		};
	}
};

export const getBarSizes = (value, fullValue, maxWidth) => {
	const valuePercent = (value * 100) / fullValue;

	const valueWidth = (valuePercent * maxWidth) / 100;
	const leftValueWidth = maxWidth - valueWidth;

	return {
		valueWidth,
		leftValueWidth
	};
};