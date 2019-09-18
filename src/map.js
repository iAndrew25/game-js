class Map {
	constructor({tileWidth, tileHeight, mapWidth, mapHeight, gameMap, legend}) {
		this.tileWidth = tileWidth;
		this.tileHeight = tileHeight;
		this.mapWidth = mapWidth;
		this.mapHeight = mapHeight;
		this.gameMap = gameMap;
		this.legend = legend;
	}

	draw = (context, mapTiles) => {
		for(let x = 0; x < this.mapHeight; x++) {
			for(let y = 0; y < this.mapWidth; y++) {
				context.drawImage(
					mapTiles,
					this.legend[this.gameMap[x][y]].x,
					this.legend[this.gameMap[x][y]].y,
					this.tileWidth,
					this.tileHeight,
					this.tileWidth * x,
					this.tileHeight * y,
					this.tileWidth,
					this.tileHeight
				);
			}
		}
	}
}