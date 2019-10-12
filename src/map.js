import Enemies from './enemies.js';
import Camera from './camera.js';
import Character from './character.js';
import Hero from './hero.js';
import GAME_CONFIG from './game-config.js';
import Assets from './assets-loader.js';
import CombatSystem from './combat-system.js';

import aStar from './util/a-star.js';
import {generatePositionForNewEnemies} from './util/helpers.js';

const {CANVAS, CONTEXT, TILE_WIDTH, TILE_HEIGHT, GAME_MAPS, LEGEND} = GAME_CONFIG;

export default class Map {
	constructor() {
		this.currentMap;
		this.getPath;

		this.rowHovered = null;
		this.columnHovered = null;

		this.xStart = null;
		this.yStart = null;

		Camera.follow(Hero);

		this.mapTiles = Assets.getImage('mapTiles');

		this.enemies = [];

		this.init();
	}

	init = () => {
		this.setMap('MAP_1');

		Enemies.generateEnemies('MAP_1');

		CANVAS.addEventListener('mousemove', this.handleMouseMove);
		CANVAS.addEventListener('mouseout', this.handleMouseOut);
		CANVAS.addEventListener('click', this.handleTileClick);
	}

	setMap = mapName => {
		this.currentMap = mapName;
		this.getPath = aStar({
			grid: GAME_MAPS[mapName].layers[0],
			legend: LEGEND
		});
	}

	handleMouseMove = event => {
		this.xStart = event.pageX - CANVAS.offsetLeft;
		this.yStart = event.pageY - CANVAS.offsetTop;		
	}

	handleMouseOut = event => {
		this.xStart = null;
		this.yStart = null;

		this.rowHovered = null;
		this.columnHovered = null;
	}

	handleTileClick = () => {
		if(Camera.hasNotMoved) {
			this.checkDestination({
				x: this.columnHovered,
				y: this.rowHovered
			});

			// const startTile = Hero.isMoving ? Hero.nextTile : Hero.currentTile;

			// const newPath = aStar({// refactor
			// 	grid: GAME_MAPS[this.currentMap].layers[0],
			// 	legend: LEGEND
			// })(startTile, {
			// 	x: this.columnHovered,
			// 	y: this.rowHovered
			// });

			// if(Array.isArray(newPath)) {
			// 	const enemy = Enemies.isEnemyHere(destination);
			// 	if(enemy) {
			// 		CombatSystem.startFighting(enemy);

			// 		newPath.pop();
			// 	}

			// 	Hero.setPath([startTile, ...newPath]);
			// }
		} else {
			//console.log('moving');
		}
	}

	// handleTileClick = () => {
	// 	if(Camera.hasNotMoved) {
	// 		const destination = {
	// 			x: this.columnHovered,
	// 			y: this.rowHovered
	// 		};

	// 		const startTile = Hero.isMoving ? Hero.nextTile : Hero.currentTile;

	// 		const newPath = aStar({// refactor
	// 			grid: GAME_MAPS[this.currentMap].layers[0],
	// 			legend: LEGEND
	// 		})(startTile, {
	// 			x: this.columnHovered,
	// 			y: this.rowHovered
	// 		});

	// 		if(Array.isArray(newPath)) {
	// 			const enemy = Enemies.isEnemyHere(destination);
	// 			if(enemy) {
	// 				CombatSystem.startFighting(enemy);

	// 				newPath.pop();
	// 			}

	// 			Hero.setPath([startTile, ...newPath]);
	// 		}
	// 	} else {
	// 		//console.log('moving');
	// 	}
	// }

	checkDestination = ({x, y}) => {
		const enemy = Enemies.isEnemyHere(destination);

		if(enemy) {
			Hero.setAction(enemy, this.getPath, 'ATTACK');
		// } else if(NPCS.isNPCHere({x, y})) {
		} else if(LEGEND[GAME_MAPS[this.currentMap].layers[0][y][x]].isWalkable) {
			Hero.setAction({x, y}, this.getPath, 'WALK');
		} else {
			return false;
		}
	}

	isTileHovered = ({xPosition, yPosition, row, column}) => {
		if(this.xStart && 
			this.yStart &&
			this.xStart >= xPosition && 
			this.xStart < xPosition + TILE_WIDTH &&
			this.yStart >= yPosition &&
			this.yStart < yPosition + TILE_HEIGHT) {

			this.rowHovered = row;
			this.columnHovered = column;
			return true;
		} else {
			return false;
		}
	}

	drawLayer = (layer, row, column, xPosition, yPosition) => {
		const {spriteX, spriteY} = LEGEND[layer[row][column]];

		CONTEXT.drawImage(
			this.mapTiles,
			this.isTileHovered({xPosition, yPosition, row, column}) ? 200 : spriteX,
			this.isTileHovered({xPosition, yPosition, row, column}) ? 0 : spriteY,
			TILE_WIDTH,
			TILE_HEIGHT,
			xPosition,
			yPosition,
			TILE_WIDTH,
			TILE_HEIGHT
		);
	}

	drawMap = () => {
		const {startColumn, endColumn, startRow, endRow, offsetX, offsetY, x, y} = Camera;

		for(let row = startRow; row < endRow; row++) {
			for(let column = startColumn; column < endColumn; column++) {
				const xPosition = Math.round(((column - startColumn) * TILE_WIDTH) + offsetX);
				const yPosition = Math.round(((row - startRow) * TILE_HEIGHT) + offsetY);
			
				GAME_MAPS[this.currentMap].layers.forEach(layer => this.drawLayer(layer, row, column, xPosition, yPosition));
			}
		}
	}

	draw = () => {
		console.log('dw');
		Camera.update();

		this.drawMap();
		Hero.draw();
		Enemies.draw();
	}
}