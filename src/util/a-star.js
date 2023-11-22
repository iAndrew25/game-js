const cloneEmptyGrid = ({layers: [baseLayer, secondLayer], legend}) => new Array(baseLayer.length).fill()
	.map((_, y) => 
		new Array(baseLayer[y].length).fill()
			.map((_, x) => ({
				x,
				y,
				f: 0,
				g: 0,
				h: 0,
				parent: null,
				cost: 1,
				isWalkable: legend[baseLayer[y][x]].isWalkable && legend[secondLayer[y][x]].isWalkable,
				isInteractive: legend[baseLayer[y][x]].isInteractive || legend[secondLayer[y][x]].isInteractive
			}))
	);

const findSmallestNumber = list => list.reduce((lowestValue, currentValue) => lowestValue.f > currentValue.f ? currentValue : lowestValue, {f: Number.MAX_VALUE});

const isGoal = (currentPosition, goal) => currentPosition.x === goal.x && currentPosition.y === goal.y;

const removeNodeFromList = (list, node) => list.filter(({x, y}) => !(x === node.x && y === node.y));

const isObject = obj => typeof obj === 'object';

const getNeighbors = (grid, {x, y}) => [
	grid[y + 1] && grid[y + 1][x],
	grid[y - 1] && grid[y - 1][x],
	grid[y][x + 1],
	grid[y][x - 1]
].filter(neighbor => isObject(neighbor) && (neighbor.isWalkable || neighbor.isInteractive));

const findNodeInList = (list, node) => list.some(({x, y}) => x === node.x && y === node.y);

const getHeuristicValue = ({x, y}, goal) => Math.abs(x - goal.x) + Math.abs(y - goal.y);

const logError = message => console.log(message);

export default ({layers, legend}) => {
	return (start, goal) => {
		const gridInit = cloneEmptyGrid({layers, legend});

		const startTile = gridInit[start.y]?.[start.x];
		const endTile = gridInit[goal.y]?.[goal.x];

		const isEndTileAvailable = endTile?.isWalkable ? true : endTile?.isInteractive;
		const isStartTileAvailable = startTile?.isWalkable ? true : startTile?.isInteractive;

		if(!startTile || !isStartTileAvailable) {
			return logError('Invalid start position.');
		} else if(!endTile || !isEndTileAvailable) {
			return logError('Invalid goal position.');
		} else if(isGoal(start, goal)) {
			return logError('Start and goal positions are the same.');
		}

		const closedList = [];
		let openList = [gridInit[start.y][start.x]];

		while(openList.length) {
			const currentNode = findSmallestNumber(openList);

			if(isGoal(currentNode, goal)) {
				const path = [];
				let currentNodeInPath = currentNode;

				while(currentNodeInPath.parent) {
					path.push(currentNodeInPath);

					currentNodeInPath = currentNodeInPath.parent;
				}

				const reversedPath = path.reverse();

				if(reversedPath[reversedPath.length - 1].isInteractive) {
					reversedPath.pop();

					return reversedPath;
				} else {
					return reversedPath;
				}
			}

			openList = removeNodeFromList(openList, currentNode);
			closedList.push(currentNode);

			const neighbors = getNeighbors(gridInit, currentNode);

			neighbors.forEach(neighbor => {
				if(!findNodeInList(closedList, neighbor)) {
					let gScore = currentNode.g + currentNode.cost;
					let gScoreIsBest = false;

					if(!findNodeInList(openList, neighbor)) {
						gScoreIsBest = true;
						neighbor.h = getHeuristicValue(neighbor, goal);
						openList.push(neighbor);
					} else if(gScore < neighbor.g) {
						gScoreIsBest = true;
					}

					if(gScoreIsBest) {
						neighbor.parent = currentNode;
						neighbor.g = gScore;
						neighbor.f = neighbor.g + neighbor.h;
					}
				}
			});
		};

		return 'Unable to find the path.';
	}
};