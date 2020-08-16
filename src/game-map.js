import Camera from './camera.js';
import Character from './character.js';
import Hero from './hero.js';
import Enemy from './enemy.js';
import Inventar from './inventar.js';
import GAME_CONFIG from './game-config.js';
import CombatSystem from './combat-system.js';
import GameButtons from './game-buttons.js';
import SpriteSheet from './spritesheet.js';

import aStar from './util/a-star.js';
import Assets from './util/assets-loader.js';
import {generatePositionForNewEnemies, isHovered} from './util/helpers.js';

const {CANVAS, CONTEXT, CANVAS_WIDTH, TILE_WIDTH, TILE_HEIGHT, GAME_MAPS, INVENTAR_WIDTH, MAP_SPRITE} = GAME_CONFIG;

export default new class GameMap {
	constructor() {
		this.currentMap;
		this.getPath;

		this.enemies = {};

		this.rowHovered = null;
		this.columnHovered = null;

		this.xStart = null;
		this.yStart = null;

		Camera.follow(Hero);

		this.init();
	}

	init = () => {
		this.setMap('MAP_1');
		Inventar.setVisibility(false);

		CANVAS.addEventListener('mousemove', this.handleMouseMove);
		CANVAS.addEventListener('mouseout', this.handleMouseOut);
		CANVAS.addEventListener('click', this.handleTileClick);
	}

	generateEnemies = () => {
		this.enemies = GAME_MAPS[this.currentMap].enemies.types.reduce((enemies, enemy) => {
			const {x, y} = generatePositionForNewEnemies(GAME_MAPS[this.currentMap].enemies.spawnArea[enemy][0]);

			return {
				...enemies,
				[`${x}_${y}`]: new Enemy({x, y}, enemy)
			};
		}, {});
	}

	isEnemyHere = ({x, y}) => {
		return this.enemies[`${x}_${y}`];
	}

	removeEnemy = ({x, y}) => {
		delete this.enemies[`${x}_${y}`];
	}

	drawEnemies = () => {
		Object.values(this.enemies).forEach(enemy => enemy.draw());
	}

	setMap = mapName => {
		this.currentMap = mapName;
		this.generateEnemies();
		this.getShortestPath = aStar({
			grid: GAME_MAPS[mapName].layers[0],
			legend: MAP_SPRITE
		});
	}

	handleMouseMove = ({pageX, pageY}) => {
		this.xStart = pageX - CANVAS.offsetLeft;
		this.yStart = pageY - CANVAS.offsetTop;

		if(Inventar.isVisible && this.xStart > CANVAS_WIDTH - INVENTAR_WIDTH) {
			this.xStart = null;
			this.yStart = null;

			this.rowHovered = null;
			this.columnHovered = null;
		}

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

	handleMouseOut = event => {
		this.xStart = null;
		this.yStart = null;

		this.rowHovered = null;
		this.columnHovered = null;
	}

	handleTileClick = () => {
		if(Camera.hasNotMoved && this.columnHovered !== null && this.rowHovered !== null) {
			if(GameButtons.handleClickOnPosition({
				positionX: this.xStart,
				positionY: this.yStart
			})) return;
				
			this.checkPosition({
				x: this.columnHovered,
				y: this.rowHovered
			});
		} else {
			//console.log('moving');
		}
	}

	getPath = ({character, destination, willInteract}) => {
		const startTile = character.movement.isMoving ? character.movement.nextTile : character.currentTile;
		const newPath = this.getShortestPath(startTile, destination);

		if(Array.isArray(newPath)) {
			willInteract && newPath.pop();

			return [startTile, ...newPath];
		} else {
			return;
		}
	}

	checkPosition = position => {
		const enemy = this.isEnemyHere(position);

		if(enemy) {
			Hero.setAction({
				type: 'ATTACK',
				target: enemy,
				path: this.getPath({
					character: Hero,
					destination: position,
					willInteract: true
				})
			});

			return false;
		}

		if(MAP_SPRITE[GAME_MAPS[this.currentMap].layers[0][position.y][position.x]].isWalkable) {
			Hero.setAction({
				type: 'WALK',
				target: {currentTile: position},
				path: this.getPath({
					character: Hero,
					destination: position
				})
			});

			return false;
		}

		//if(NPCS.isNPCHere(position))
		
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
		const {startColumn, endColumn, startRow, endRow, offsetX, offsetY, x, y} = Camera;

		for(let row = startRow; row < endRow; row++) {
			for(let column = startColumn; column < endColumn; column++) {
				const positionX = Math.round(((column - startColumn) * TILE_WIDTH) + offsetX);
				const positionY = Math.round(((row - startRow) * TILE_HEIGHT) + offsetY);
				const isTileHovered = this.isTileHovered({positionX, positionY, row, column});

				GAME_MAPS[this.currentMap].layers.forEach(layer => 
					SpriteSheet.drawTile(layer[row][column], isTileHovered, {positionX, positionY})
				);
			}
		}
	}

	draw = () => {
		Camera.update();

		this.drawMap();
		this.drawEnemies();
		Hero.draw();
		Inventar.draw();
		GameButtons.draw();
	}
}