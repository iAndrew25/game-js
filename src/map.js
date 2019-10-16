import Enemies from './enemies.js';
import Camera from './camera.js';
import Character from './character.js';
import Hero from './hero.js';
import Inventar from './inventar.js';
import GAME_CONFIG from './game-config.js';
import Assets from './assets-loader.js';
import CombatSystem from './combat-system.js';
import GameButtons from './game-buttons.js';

import aStar from './util/a-star.js';
import {generatePositionForNewEnemies, isHovered, drawTile} from './util/helpers.js';

const {CANVAS, CONTEXT, CANVAS_WIDTH, TILE_WIDTH, TILE_HEIGHT, GAME_MAPS, INVENTAR_WIDTH, LEGEND} = GAME_CONFIG;

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
			legend: LEGEND
		});
	}

	handleMouseMove = event => {
		this.xStart = event.pageX - CANVAS.offsetLeft;
		this.yStart = event.pageY - CANVAS.offsetTop;

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
		} else if(LEGEND[GAME_MAPS[this.currentMap].layers[0][y][x]].isWalkable) {
			Hero.setAction({x, y}, this.getPath, 'WALK');
		} else {
			return false;
		}
	}

	isTileHovered = ({xPosition, yPosition, row, column}) => {
		if(isHovered(this.xStart, this.yStart, TILE_WIDTH, TILE_HEIGHT, xPosition, yPosition)) {
			this.rowHovered = row;
			this.columnHovered = column;
			return true;
		} else {
			return false;
		}
	}

	drawLayer = (layer, row, column, xPosition, yPosition) => {
		const {sourceX, sourceY} = LEGEND[layer[row][column]];

		drawTile(
			this.mapTiles,
			this.isTileHovered({xPosition, yPosition, row, column}) ? 200 : sourceX,
			this.isTileHovered({xPosition, yPosition, row, column}) ? 0 : sourceY,
			TILE_WIDTH,
			TILE_HEIGHT,
			xPosition,
			yPosition
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
		Camera.update();

		this.drawMap();
		Hero.draw();
		Enemies.draw();
		Inventar.draw();
		GameButtons.draw();
	}
}