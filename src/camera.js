class Camera {
	constructor({canvasWidth, canvasHeight, tileWidth, tileHeight, mapWidth, mapHeight}) {
		this.following;
		this.fixedCamera;

		this.isMoving = false;

		this.x = 0;
		this.y = 0;

		this.maxX = (mapWidth * tileWidth) - canvasWidth;
		this.maxY = (mapHeight * tileHeight) - canvasHeight;
		this.canvasWidth = canvasWidth;
		this.canvasHeight = canvasHeight;

		this.startCol = 0;
		this.endCol = 0;
		this.startRow = 0;
		this.endRow = 0;

		this.xStart = 0;
		this.yStart = 0;
		this.xEnd = 0;
		this.yEnd = 0;

		this.contextElement = document.getElementsByTagName('canvas')[0];

		this.init();
	}

	lockFixedCamera = () => {
		this.contextElement.removeEventListener('mousedown', this.handleMouseDown);
		this.contextElement.removeEventListener('mousemove', this.handleMouseMove);
		this.contextElement.removeEventListener('mouseup', this.handleMouseUp);
	}

	handleMouseDown = event => {
		this.xStart = event.pageX - this.contextElement.offsetLeft;
		this.yStart = event.pageY - this.contextElement.offsetTop;

		this.isMoving = true;		
	}

	handleMouseMove =  event => {
		if(this.isMoving) {
			this.xEnd = event.pageX - this.contextElement.offsetLeft;
			this.yEnd = event.pageY - this.contextElement.offsetTop;

			this.y -= Math.round(this.xEnd - this.xStart);
			this.x -= Math.round(this.yEnd - this.yStart);

			this.xStart = this.xEnd;
			this.yStart = this.yEnd;

			this.isMoving = true;
		}
	}

	handleMouseUp = () => {
		this.isMoving = false;

		this.xStart = this.xEnd;
		this.yStart = this.yEnd;
	}

	unlockFixedCamera = () => {
		this.contextElement.addEventListener('mousedown', this.handleMouseDown);
		this.contextElement.addEventListener('mousemove', this.handleMouseMove);
		this.contextElement.addEventListener('mouseup', this.handleMouseUp);
	}

	init = () => {
		this.lockFixedCamera();
	}

	follow = hero => {
		this.following = hero;
	}

	update = () => {
		if(this.following) {
			const {position} = this.following;
			// todo switch x and y
    		this.y = position.x - this.canvasWidth / 2 - 15;
    		this.x = position.y - this.canvasHeight / 2 - 15;
    	} 

		this.x = Math.max(0, Math.min(this.x, this.maxX));
		this.y = Math.max(0, Math.min(this.y, this.maxY));

		this.startCol = Math.floor(this.y / 50);
		this.endCol = this.startCol + (this.canvasWidth / 50) + 1;
		this.startRow = Math.floor(this.x / 50);
		this.endRow = this.startRow + (this.canvasHeight / 50) + 1;
		
		this.endCol = Math.min(this.startCol + (this.canvasWidth / 50) + 1, 20);
		this.endRow = Math.min(this.startRow + (this.canvasHeight / 50) + 1, 20);

 		this.offsetX = -this.x + (this.startRow * 50);
 		this.offsetY = -this.y + (this.startCol * 50);
	}
}