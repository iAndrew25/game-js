import Camera from './core/camera.js';
import Hero from './primitives/player/hero.js';
import Enemy from './primitives/player/enemy.js';
// import Inventar from './inventar.js';
import GAME_CONFIG from './game-config.js';
import CombatSystem from './core/combat-system.js';
import GameButtons from './game-buttons.js';
import SpriteSheet from './spritesheet.js';

import aStar from './util/a-star.js';
import Assets from './util/assets-loader.js';
import {generatePositionForNewEnemies, isHovered} from './util/helpers.js';

const {CANVAS_WIDTH, TILE_WIDTH, TILE_HEIGHT, GAME_MAPS, INVENTAR_WIDTH, MAP_SPRITE} = GAME_CONFIG;

export default class GameMap {
	constructor(canvas, currentMap) {
		this.canvas = canvas;
		this.currentMap = currentMap;
		
		this.path;
		this.highlightedPath;
		this.getPath;
		this.enemies;

		this.rowHovered = null;
		this.columnHovered = null;

		this.xStart = null;
		this.yStart = null;

		this.camera = new Camera();
		this.hero = new Hero(this.camera);

		this.initMap();

		// Inventar.setVisibility(false);

		this.canvas.addEventListener('mousemove', this.handleMouseMove);
		this.canvas.addEventListener('mouseout', this.handleMouseOut);
		this.canvas.addEventListener('click', this.handleTileClick);
	}

	initMap = () => {
		this.initPathFinder();
		this.camera.follow(this.hero);

		this.enemies = GAME_MAPS[this.currentMap].enemies.types.reduce((enemies, enemy) => {
			const {x, y} = generatePositionForNewEnemies(GAME_MAPS[this.currentMap].enemies.spawnArea[enemy][0]);

			return {
				...enemies,
				[`${x}_${y}`]: new Enemy(this.camera, {x, y}, enemy)
			};
		}, {});

		// this.getShortestPath = aStar({
		// 	grid: GAME_MAPS[this.currentMap].layers[0],
		// 	legend: MAP_SPRITE
		// });
	}


	initPathFinder = () => {
		// const [baseLayer, secondLayer] = GAME_MAPS[this.currentMap].layers;

	// 	const grid = new Array(GAME_MAPS[this.currentMap].layers[0].length).fill()
	// .map((_, y) => 
	// 	new Array(GAME_MAPS[this.currentMap].layers[0][y].length).fill()
	// 		.map((_, x) => ({
	// 			x,
	// 			y,
	// 			f: 0,
	// 			g: 0,
	// 			h: 0,
	// 			parent: null,
	// 			cost: 1,
	// 			isWalkable: true,
	// 			// ...MAP_SPRITE[GAME_MAPS[this.currentMap].layers[0][y][x]]
	// 		}))
	// );

		// const grid = new Array(baseLayer.length).fill()
		// 	.map((_, y) =>
		// 		new Array(baseLayer[y].length).fill().map((_, x) => ({
		// 			x,
		// 			y,
		// 			f: 0,
		// 			g: 0,
		// 			h: 0,
		// 			parent: null,
		// 			cost: 1,
		// 			isWalkable: MAP_SPRITE[baseLayer[y][x]].isWalkable && MAP_SPRITE[secondLayer[y][x]].isWalkable,
		// 		}))
		// 	);

		this.getShortestPath = aStar({
			layers: GAME_MAPS[this.currentMap].layers,
			legend: MAP_SPRITE
		});
	}


	getEnemyFromCoords = ({x, y}) => {
		return this.enemies[`${x}_${y}`];
	}

	removeEnemy = ({x, y}) => {
		delete this.enemies[`${x}_${y}`];
	}

	drawEnemies = () => {
		Object.values(this.enemies).forEach(enemy => enemy.draw());
	}

	handleMouseMove = ({offsetX, offsetY}) => {
		this.xStart = offsetX;
		this.yStart = offsetY;

		// if(Inventar.isVisible && this.xStart > CANVAS_WIDTH - INVENTAR_WIDTH) {
		// 	this.xStart = null;
		// 	this.yStart = null;

		// 	this.rowHovered = null;
		// 	this.columnHovered = null;
		// }

//		if(GameButtons.checkPosition({
//			positionX: this.xStart,
//			positionY: this.yStart
//		})) {
//			this.xStart = null;
//			this.yStart = null;
//
//			this.rowHovered = null;
//			this.columnHovered = null;		
//		}
	}

	handleMouseOut = () => {
		this.xStart = null;
		this.yStart = null;

		this.rowHovered = null;
		this.columnHovered = null;
	}

	handleTileClick = () => {
		// if(this.camera.hasNotMoved && this.columnHovered !== null && this.rowHovered !== null) {
			// if(GameButtons.handleClickOnPosition({
			// 	positionX: this.xStart,
			// 	positionY: this.yStart
			// })) return;
			
			this.checkPosition({
				x: this.columnHovered,
				y: this.rowHovered
			});




		// } else {
			//console.log('moving');
		// }
	}

	getPath = ({character, destination, willInteract}) => {
		const startTile = character.movement.isMoving ? character.movement.nextTile : character.currentTile;
		const newPath = this.getShortestPath(startTile, destination);

		if(Array.isArray(newPath)) {
			//willInteract && newPath.pop();

			return [startTile, ...newPath];
		} else {
			return;
		}
	}

	checkPosition = position => {
		const enemy = this.getEnemyFromCoords(position);

		this.path = this.getPath({
			character: this.hero,
			destination: position,
			willInteract: Boolean(enemy)
		});
			console.log("this.path", this.path);

		this.highlightedPath = this.path?.reduce((total, {x, y}) => ({
			...total,
			[`${x}_${y}`]: true
		}), {})


		if(enemy) {
			this.hero.setAction({
				type: 'ATTACK',
				target: enemy,
				path: this.path
			});

			return false;
		}

		if(MAP_SPRITE[GAME_MAPS[this.currentMap].layers[0][position.y][position.x]].isWalkable) {
			this.hero.setAction({
				type: 'WALK',
				target: {currentTile: position},
				path: this.path
			});

			return false;
		}

		//if(NPCS.isNPCHere(position))
		console.log('cant walk')
		
		return false;
	}

	isTileHovered = ({positionX, positionY, row, column}) => {
		if(isHovered(this.xStart, this.yStart, TILE_WIDTH, TILE_HEIGHT, positionX, positionY)) {
			this.rowHovered = row;
			this.columnHovered = column;
			return true;
		} else {
			return false;
		}
	}

	drawMap = () => {
		const {startColumn, endColumn, startRow, endRow, offsetX, offsetY, x, y} = this.camera;

		for(let row = startRow; row < endRow; row++) {
			for(let column = startColumn; column < endColumn; column++) {
				const positionX = Math.round(((column - startColumn) * TILE_WIDTH) + offsetX);
				const positionY = Math.round(((row - startRow) * TILE_HEIGHT) + offsetY);
				const isTileHovered = this.isTileHovered({positionX, positionY, row, column});
				const isHighlighted = this.highlightedPath?.[`${column}_${row}`] && this.hero.movement.isMoving;
				const tileMode = isTileHovered ? 'hovered' : isHighlighted ? 'highlighted' : 'normal';

				GAME_MAPS[this.currentMap].layers.forEach(layer => 
					SpriteSheet.drawTile(layer[row][column], tileMode, {positionX, positionY})
				);
			}
		}
	}

	draw = () => {
		this.camera.update();

		this.drawMap();
		this.drawEnemies();
		this.hero.draw();
		// Inventar.draw();
		GameButtons.draw();
	}
}