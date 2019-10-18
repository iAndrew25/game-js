import Enemies from './enemies.js';
import Camera from './camera.js';
import Character from './character.js';
import Hero from './hero.js';
import Inventar from './inventar.js';
import GAME_CONFIG from './game-config.js';
import Assets from './assets-loader.js';
import CombatSystem from './combat-system.js';
import GameButtons from './game-buttons.js';
import SpriteSheet from './spritesheet.js';

import aStar from './util/a-star.js';
import {generatePositionForNewEnemies, isHovered} from './util/helpers.js';

const {CANVAS, CONTEXT, CANVAS_WIDTH, TILE_WIDTH, TILE_HEIGHT, GAME_MAPS, INVENTAR_WIDTH, MAP_SPRITE} = GAME_CONFIG;

export default class Map {
	constructor() {
		this.currentMap;
		this.getPath;

		this.rowHovered = null;
		this.columnHovered = null;

		this.xStart = null;
		this.yStart = null;

		Camera.follow(Hero);

		this.init();
	}

	init = () => {
		this.setMap('MAP_1');
		Inventar.setVisibility(true);

		Enemies.generateEnemies('MAP_1');

		CANVAS.addEventListener('mousemove', this.handleMouseMove);
		CANVAS.addEventListener('mouseout', this.handleMouseOut);
		CANVAS.addEventListener('click', this.handleTileClick);
	}

	setMap = mapName => {
		this.currentMap = mapName;
		this.getPath = aStar({
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

	checkPosition = ({x, y}) => {
		const enemy = Enemies.isEnemyHere({x, y});

		if(enemy) {
			Hero.setAction(enemy, this.getPath, 'ATTACK');
		// } else if(NPCS.isNPCHere({x, y})) {
		} else if(MAP_SPRITE[GAME_MAPS[this.currentMap].layers[0][y][x]].isWalkable) {
			Hero.setAction({x, y}, this.getPath, 'WALK');
		} else {
			return false;
		}
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
		Hero.draw();
		Enemies.draw();
		Inventar.draw();
		GameButtons.draw();
	}
}