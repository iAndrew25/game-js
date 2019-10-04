export default class Camera {
	constructor({canvasWidth, canvasHeight, tileWidth, tileHeight, mapWidth, mapHeight}) {
		this.isCameraFixed = false;
		this.following;

		this.isMoving = false;

		this.x = 0;
		this.y = 0;

		this.tileWidth = tileWidth;
		this.tileHeight = tileHeight;

 		this.mapWidth = mapWidth;
 		this.mapHeight = mapHeight;

		this.maxX = (mapWidth * tileWidth) - canvasWidth;
		this.maxY = (mapHeight * tileHeight) - canvasHeight;
		this.canvasWidth = canvasWidth;
		this.canvasHeight = canvasHeight;

		this.startColumn = 0;
		this.endColumn = 0;
		this.startRow = 0;
		this.endRow = 0;

		this.xStart = 0;
		this.yStart = 0;
		this.xEnd = 0;
		this.yEnd = 0;

		this.contextElement = document.getElementsByTagName('canvas')[0];

		this.unlockFixedCamera();
	}

	changeCameraMode = () => {
		this.isCameraFixed = !this.isCameraFixed;

		if(this.isCameraFixed) {
			this.lockFixedCamera();
		} else {
			this.unlockFixedCamera();
		}
	}

	unlockFixedCamera = () => {
		this.contextElement.addEventListener('mousedown', this.handleMouseDown);
		this.contextElement.addEventListener('mousemove', this.handleMouseMove);
		this.contextElement.addEventListener('mouseout', this.handleMouseUp);
		this.contextElement.addEventListener('mouseup', this.handleMouseUp);
	}

	lockFixedCamera = () => {
		this.contextElement.removeEventListener('mousedown', this.handleMouseDown);
		this.contextElement.removeEventListener('mousemove', this.handleMouseMove);
		this.contextElement.removeEventListener('mouseout', this.handleMouseUp);
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

			this.y -= Math.round(this.yEnd - this.yStart);
			this.x -= Math.round(this.xEnd - this.xStart);

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

	follow = character => {
		this.following = character;
	}

	update = () => {
		if(this.isCameraFixed) {
			const {position} = this.following;

			this.y = position.y - this.canvasHeight / 2 - this.following.characterHeight / 2;
			this.x = position.x - this.canvasWidth / 2 - this.following.characterWidth / 2;
		} 

		this.x = Math.max(0, Math.min(this.x, this.maxX));
		this.y = Math.max(0, Math.min(this.y, this.maxY));

		this.startColumn = Math.floor(this.x / this.tileWidth);
		this.endColumn = this.startColumn + (this.canvasWidth / this.tileWidth) + 1;

		this.startRow = Math.floor(this.y / this.tileHeight);
		this.endRow = this.startRow + (this.canvasHeight / this.tileHeight) + 1;
		
		this.endColumn = Math.min(this.startColumn + (this.canvasWidth / this.tileWidth) + 1, this.mapWidth);
		this.endRow = Math.min(this.startRow + (this.canvasHeight / this.tileHeight) + 1, this.mapHeight);

 		this.offsetX = (this.startColumn * this.tileWidth) - this.x;
 		this.offsetY = (this.startRow * this.tileHeight) - this.y;
	}
}