var Keyboard = {};

Keyboard.LEFT = 37;
Keyboard.RIGHT = 39;
Keyboard.UP = 38;
Keyboard.DOWN = 40;

Keyboard._keys = {};

Keyboard.listenForEvents = function (keys) {
    window.addEventListener('keydown', this._onKeyDown.bind(this));
    window.addEventListener('keyup', this._onKeyUp.bind(this));

    keys.forEach(function (key) {
        this._keys[key] = false;
    }.bind(this));
}

Keyboard._onKeyDown = function (event) {
	console.log("event", event);
    var keyCode = event.keyCode;
    if (keyCode in this._keys) {
        event.preventDefault();
        this._keys[keyCode] = true;
    }
};

Keyboard._onKeyUp = function (event) {
    var keyCode = event.keyCode;
    if (keyCode in this._keys) {
        event.preventDefault();
        this._keys[keyCode] = false;
    }
};

Keyboard.isDown = function (keyCode) {
    if (!keyCode in this._keys) {
        throw new Error('Keycode ' + keyCode + ' is not being listened to');
    }
    return this._keys[keyCode];
};

class Camera {
	constructor({canvasWidth, canvasHeight, tileWidth, tileHeight, mapWidth, mapHeight}) {
		this.following;
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

		    Keyboard.listenForEvents(
        [Keyboard.LEFT, Keyboard.RIGHT, Keyboard.UP, Keyboard.DOWN]);
	}

	follow = hero => {
		this.following = hero;
	}

	update = () => {
	    // handle camera movement with arrow keys
	    var dirx = 0;
	    var diry = 0;
	    if (Keyboard.isDown(Keyboard.LEFT)) { diry = -1; }
	    if (Keyboard.isDown(Keyboard.RIGHT)) { diry = 1; }
	    if (Keyboard.isDown(Keyboard.UP)) { dirx = -1; }
	    if (Keyboard.isDown(Keyboard.DOWN)) { dirx = 1; }


		// if(this.following) {
			// const {position} = this.following;
    		this.x += dirx * 4;
    		this.y += diry * 4;

			this.x = Math.max(0, Math.min(this.x, this.maxX));
			this.y = Math.max(0, Math.min(this.y, this.maxY));
		// }

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