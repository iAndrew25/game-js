import Camera from './camera.js';
import GAME_CONFIG from './game-config.js';
import Assets from './assets-loader.js';

const {CANVAS, CONTEXT, TILE_WIDTH, TILE_HEIGHT, LEGEND} = GAME_CONFIG;

export default class Map {
	constructor(hero, gameMap) {
		this.gameMap = gameMap;


		this.camera = new Camera();
		this.hero = hero;

		this.camera.follow(hero);

		this.mapTiles = Assets.getImage('mapTiles');

		this.init();
	}

	init = () => {
		CANVAS.addEventListener('mousemove', event => {
			this.xStart = event.pageX - CANVAS.offsetLeft;
			this.yStart = event.pageY - CANVAS.offsetTop;
		});

		CANVAS.addEventListener('mouseout', event => {
			this.xStart = null;
			this.yStart = null;
		});
	}

	isTileHovered = ({xPosition, yPosition}) => {
		return this.xStart && 
			this.yStart &&
			this.xStart >= xPosition && 
			this.xStart < xPosition + TILE_WIDTH &&
			this.yStart >= yPosition &&
			this.yStart < yPosition + TILE_HEIGHT;
	}

	draw = () => {
		this.camera.update();
		const {startColumn, endColumn, startRow, endRow, offsetX, offsetY, x, y} = this.camera;

		for(let row = startRow; row < endRow; row++) {
			for(let column = startColumn; column < endColumn; column++) {
				const {x, y} = LEGEND[this.gameMap[row][column]];
				const xPosition = Math.round(((column - startColumn) * TILE_WIDTH) + offsetX);
				const yPosition = Math.round(((row - startRow) * TILE_HEIGHT) + offsetY);

				CONTEXT.drawImage(
					this.mapTiles,
					this.isTileHovered({xPosition, yPosition}) ? 200 : x,
					this.isTileHovered({xPosition, yPosition}) ? 0 : y,
					TILE_WIDTH,
					TILE_HEIGHT,
					xPosition,
					yPosition,
					TILE_WIDTH,
					TILE_HEIGHT
				);				
			}
		}

		this.hero.draw({x, y});
	}
}