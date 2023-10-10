const findSmallestNumber = list => list.reduce((lowestValue, currentValue) => lowestValue.f > currentValue.f ? currentValue : lowestValue, {f: Number.MAX_VALUE});

const isGoal = (currentPosition, goal) => currentPosition.x === goal.x && currentPosition.y === goal.y;

const removeNodeFromList = (list, node) => list.filter(({x, y}) => !(x === node.x && y === node.y));

const isObject = obj => typeof obj === 'object';

const getNeighbors = (grid, {x, y}) => [
	grid[y + 1] && grid[y + 1][x],
	grid[y - 1] && grid[y - 1][x],
	grid[y][x + 1],
	grid[y][x - 1]
].filter(neighbor => isObject(neighbor) && neighbor.isWalkable);

const findNodeInList = (list, node) => list.some(({x, y}) => x === node.x && y === node.y);

const getHeuristicValue = ({x, y}, goal) => Math.abs(x - goal.x) + Math.abs(y - goal.y);

export default grid => {
	return (start, goal) => {
		if(!grid[start.y] || !grid[start.y][start.x] || !grid[start.y][start.x].isWalkable) {
			return 'Invalid start position.';
		} else if(!grid[goal.y] || !grid[goal.y][goal.x] || !grid[goal.y][goal.x].isWalkable) {
			return 'Invalid goal position.'
		} else if(isGoal(start, goal)) {
			return 'Start and goal positions are the same.';
		}

		const closedList = [];
		let openList = [grid[start.y][start.x]];

		while(openList.length) {
			const currentNode = findSmallestNumber(openList);

			if(isGoal(currentNode, goal)) {
				const path = [];
				let currentNodeInPath = currentNode;

				while(currentNodeInPath.parent) {
					path.push(currentNodeInPath);

					currentNodeInPath = currentNodeInPath.parent;
				}

				return path.reverse();
			}

			openList = removeNodeFromList(openList, currentNode);
			closedList.push(currentNode);

			const neighbors = getNeighbors(grid, currentNode);

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