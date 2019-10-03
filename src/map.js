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
					x,
					y,
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