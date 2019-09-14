const map = {
	tileWidth: 20,
	tileHeight: 20,
	gameMap: [
		[1, 1, 1, 1, 1],
		[1, 0, 0, 0, 1],
		[1, 0, 1, 0, 1],
		[1, 0, 0, 0, 1],
		[1, 1, 1, 1, 1]
	]
};

window.onload = () => {
	const contextElement = document.createElement('canvas');
	document.body.appendChild(contextElement);

	const hero = new Character({
		x: 1,
		y: 1
	}, 15, 15, {
		tileWidth: 20,
		tileHeight: 20,
		gameSpeed: 300
	});

	new Game(contextElement.getContext('2d'), map, hero, {
		gameSpeed: 700
	});
};

// map class
