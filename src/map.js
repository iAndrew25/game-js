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
		const {startCol, endCol, startRow, endRow, offsetX, offsetY, x, y, hiddenX, hiddenY} = this.camera;

		for(let row = startRow; row < endRow; row++) {
			for(let column = startCol; column < endCol; column++) {
				const {x, y} = this.legend[this.gameMap[row][column]];
				const rightX = ((row - startRow) * 50) + offsetX;
				const rightY = ((column - startCol) * 50) + offsetY;

				this.context.drawImage(
					mapTiles,
					x,
					y,
					this.tileWidth,
					this.tileHeight,
					Math.round(rightY),
					Math.round(rightX),
					this.tileWidth,
					this.tileHeight
				);
			}
		}

		this.hero.draw(y, x);
	}
}