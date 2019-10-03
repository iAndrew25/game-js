class Map {
	constructor(context, hero, {tileWidth, tileHeight, mapWidth, mapHeight, gameMap, legend, canvasWidth, canvasHeight}) {
		this.context = context;

		this.tileWidth = tileWidth;
		this.tileHeight = tileHeight;
		this.mapWidth = mapWidth;
		this.mapHeight = mapHeight;
		this.gameMap = gameMap;
		this.legend = legend;

		this.camera = new Camera({canvasWidth, canvasHeight, tileWidth, tileHeight, mapWidth, mapHeight})

		this.hero = hero;
		this.camera.follow(hero);

		this.contextElement = document.getElementsByTagName('canvas')[0];

		this.init();
	}

	init = () => {
		this.contextElement.addEventListener('mousemove', event => {
			console.log("event.pageX", event.pageX);
			this.xStart = event.pageX - this.contextElement.offsetLeft;
			this.yStart = event.pageY - this.contextElement.offsetTop;
		});

		this.contextElement.addEventListener('mouseout', event => {
			console.log("event.pageX", event.pageX);
			this.xStart = null;
			this.yStart = null;
		});
	}

	isTileHovered = ({xPosition, yPosition}) => {
		return this.xStart && 
			this.yStart &&
			this.xStart >= xPosition && 
			this.xStart <= xPosition + this.tileWidth &&
			this.yStart >= yPosition &&
			this.yStart <= yPosition + this.tileHeight;
	}

	draw = (mapTiles) => {
		this.camera.update();
		const {startColumn, endColumn, startRow, endRow, offsetX, offsetY, x, y} = this.camera;

		for(let row = startRow; row < endRow; row++) {
			for(let column = startColumn; column < endColumn; column++) {
				const {x, y} = this.legend[this.gameMap[row][column]];
				const xPosition = Math.round(((column - startColumn) * this.tileWidth) + offsetX);
				const yPosition = Math.round(((row - startRow) * this.tileHeight) + offsetY);

				this.context.drawImage(
					mapTiles,
					this.isTileHovered({xPosition, yPosition}) ? 200 : x,
					this.isTileHovered({xPosition, yPosition}) ? 0 : y,
					this.tileWidth,
					this.tileHeight,
					xPosition,
					yPosition,
					this.tileWidth,
					this.tileHeight
				);				
			}
		}

		this.hero.draw({x, y});
	}
}