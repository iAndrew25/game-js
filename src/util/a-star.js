const cloneEmptyGrid = ({grid, legend}) => new Array(grid.length).fill()
	.map((_, y) => 
		new Array(grid[y].length).fill()
			.map((_, x) => ({
				x,
				y,
				f: 0,
				g: 0,
				h: 0,
				parent: null,
				cost: 1,
				isWalkable: true,
				...legend[grid[y][x]]
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
].filter(neighbor => isObject(neighbor) && neighbor.isWalkable);

const findNodeInList = (list, node) => list.some(({x, y}) => x === node.x && y === node.y);

const getHeuristicValue = ({x, y}, goal) => Math.abs(x - goal.x) + Math.abs(y - goal.y);

export default ({grid, legend}) => {
	const gridInit = cloneEmptyGrid({grid, legend});

	return (start, goal) => {
		if(!gridInit[start.y] || !gridInit[start.y][start.x] || !gridInit[start.y][start.x].isWalkable) {
			return 'Invalid start position.';
		} else if(!gridInit[goal.y] || !gridInit[goal.y][goal.x] || !gridInit[goal.y][goal.x].isWalkable) {
			return 'Invalid goal position.'
		} else if(isGoal(start, goal)) {
			return 'Start and goal positions are the same.';
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

				return path.reverse();
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