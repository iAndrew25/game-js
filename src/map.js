import Camera from './camera.js';
import Character from './character.js';
import GAME_CONFIG from './game-config.js';
import Assets from './assets-loader.js';

import aStar from './util/a-star.js';
import {generatePositionForNewEnemies} from './util/helpers.js';

const {CANVAS, CONTEXT, TILE_WIDTH, TILE_HEIGHT, GAME_MAPS, LEGEND} = GAME_CONFIG;

export default class Map {
	constructor(hero) {
		this.currentMapName;
		this.currentMap;

		this.rowHovered = null;
		this.columnHovered = null;

		this.xStart = null;
		this.yStart = null;

		this.hero = hero;


		Camera.follow(hero);

		this.mapTiles = Assets.getImage('mapTiles');

		this.enemies = [];

		this.init();
	}

	init = () => {
		this.setMap('MAP_1');
		this.placeMobsOnMap();

		CANVAS.addEventListener('mousemove', this.handleMouseMove);
		CANVAS.addEventListener('mouseout', this.handleMouseOut);
		CANVAS.addEventListener('click', this.handleTileClick);


	}

	placeMobsOnMap = () => {
		GAME_MAPS[this.currentMapName].enemies.types.forEach(enemy => {

			this.enemies.push(new Character(generatePositionForNewEnemies(GAME_MAPS[this.currentMapName].enemies.spawnArea[enemy][0]), enemy));
			
		});
			console.log("this.enemies", this.enemies);
	}

	setMap = mapName => {
		this.currentMapName = mapName;
		this.currentMap = aStar({
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
			try {
				const newPath = aStar({
					grid: GAME_MAPS[this.currentMapName].layers[0],
					legend: LEGEND
				})(this.hero.currentTile, {
					x: this.columnHovered,
					y: this.rowHovered
				});

				if(Array.isArray(newPath)) {
					this.hero.setPath([this.hero.currentTile, ...newPath]);
				}

			} catch (err) {
				console.log('err', err)
			}
		} else {
			//console.log('moving');
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
			
				GAME_MAPS[this.currentMapName].layers.forEach(layer => this.drawLayer(layer, row, column, xPosition, yPosition));
			}
		}
	}

	draw = () => {
		Camera.update();

		this.drawMap();
		this.hero.draw();
		this.enemies.forEach(enemy => {
			enemy.draw()
		});
	}
}