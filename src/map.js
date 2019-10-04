import Camera from './camera.js';
import GAME_CONFIG from './game-config.js';
import Assets from './assets-loader.js';

const {CANVAS, CONTEXT, TILE_WIDTH, TILE_HEIGHT, GAME_MAPS, LEGEND} = GAME_CONFIG;

export default class Map {
	constructor(hero) {
		this.currentMap = 'MAP_1';

		this.rowHovered = null;
		this.columnHovered = null;

		this.xStart = null;
		this.yStart = null;

		this.hero = hero;

		Camera.follow(hero);

		this.mapTiles = Assets.getImage('mapTiles');

		this.init();
	}

	init = () => {
		CANVAS.addEventListener('mousemove', this.handleMouseMove);
		CANVAS.addEventListener('mouseout', this.handleMouseOut);
		CANVAS.addEventListener('click', this.handleTileClick);
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
			console.log('clicked');
		} else {
			console.log('moving');
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
		const {x, y} = LEGEND[layer[row][column]];

		CONTEXT.drawImage(
			this.mapTiles,
			this.isTileHovered({xPosition, yPosition, row, column}) ? 200 : x,
			this.isTileHovered({xPosition, yPosition, row, column}) ? 0 : y,
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
		Camera.update();

		this.drawMap();
		this.hero.draw();
	}
}