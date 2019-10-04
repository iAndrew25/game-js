import GAME_CONFIG from './game-config.js';

const {TILE_WIDTH, TILE_HEIGHT, MAP_HEIGHT, MAP_WIDTH, CANVAS_WIDTH, CANVAS_HEIGHT, CANVAS} = GAME_CONFIG;

export default class Camera {
	constructor() {
		this.isCameraFixed = false;
		this.following;

		this.isMoving = false;

		this.x = 0;
		this.y = 0;

		this.maxX = (MAP_WIDTH * TILE_WIDTH) - CANVAS_WIDTH;
		this.maxY = (MAP_HEIGHT * TILE_HEIGHT) - CANVAS_HEIGHT;

		this.startColumn = 0;
		this.endColumn = 0;
		this.startRow = 0;
		this.endRow = 0;

		this.xStart = 0;
		this.yStart = 0;
		this.xEnd = 0;
		this.yEnd = 0;

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
		CANVAS.addEventListener('mousedown', this.handleMouseDown);
		CANVAS.addEventListener('mousemove', this.handleMouseMove);
		CANVAS.addEventListener('mouseout', this.handleMouseUp);
		CANVAS.addEventListener('mouseup', this.handleMouseUp);
	}

	lockFixedCamera = () => {
		CANVAS.removeEventListener('mousedown', this.handleMouseDown);
		CANVAS.removeEventListener('mousemove', this.handleMouseMove);
		CANVAS.removeEventListener('mouseout', this.handleMouseUp);
		CANVAS.removeEventListener('mouseup', this.handleMouseUp);
	}

	handleMouseDown = event => {
		this.xStart = event.pageX - CANVAS.offsetLeft;
		this.yStart = event.pageY - CANVAS.offsetTop;

		this.isMoving = true;		
	}

	handleMouseMove =  event => {
		if(this.isMoving) {
			this.xEnd = event.pageX - CANVAS.offsetLeft;
			this.yEnd = event.pageY - CANVAS.offsetTop;

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

			this.y = position.y - CANVAS_HEIGHT / 2 - this.following.characterHeight / 2;
			this.x = position.x - CANVAS_WIDTH / 2 - this.following.characterWidth / 2;
		} 

		this.x = Math.max(0, Math.min(this.x, this.maxX));
		this.y = Math.max(0, Math.min(this.y, this.maxY));

		this.startColumn = Math.floor(this.x / TILE_WIDTH);
		this.endColumn = this.startColumn + (CANVAS_WIDTH / TILE_WIDTH) + 1;

		this.startRow = Math.floor(this.y / TILE_HEIGHT);
		this.endRow = this.startRow + (CANVAS_HEIGHT / TILE_HEIGHT) + 1;
		
		this.endColumn = Math.min(this.startColumn + (CANVAS_WIDTH / TILE_WIDTH) + 1, MAP_WIDTH);
		this.endRow = Math.min(this.startRow + (CANVAS_HEIGHT / TILE_HEIGHT) + 1, MAP_HEIGHT);

 		this.offsetX = (this.startColumn * TILE_WIDTH) - this.x;
 		this.offsetY = (this.startRow * TILE_HEIGHT) - this.y;
	}
}