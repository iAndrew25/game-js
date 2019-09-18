class Map {
	constructor(context, {tileWidth, tileHeight, mapWidth, mapHeight, gameMap, legend}) {
		this.context = context;

		this.tileWidth = tileWidth;
		this.tileHeight = tileHeight;
		this.mapWidth = mapWidth;
		this.mapHeight = mapHeight;
		this.gameMap = gameMap;
		this.legend = legend;
	}

	draw = (mapTiles) => {
		for(let row = 0; row < this.mapHeight; row++) {
			for(let column = 0; column < this.mapWidth; column++) {
				const {x, y} = this.legend[this.gameMap[row][column]];

				this.context.drawImage(
					mapTiles,
					x,
					y,
					this.tileWidth,
					this.tileHeight,
					this.tileHeight * column,
					this.tileWidth * row,
					this.tileWidth,
					this.tileHeight
				);
			}
		}
	}
}