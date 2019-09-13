window.onload = () => {
	const contextElement = document.createElement('context');
	const ctx = contextElement.getContext('2d');

	document.body.appendChild(contextElement);

	new Game(ctx, 'hero', {
		gameSpeed: 700
	});
};


class Game {
	// map
	constructor(context, hero, config) {
		const {gameSpeed} = config;

		this.context = context;
		this.hero = hero;
		this.gameSpeed = gameSpeed;

		this.init();
	}

	init = () => {
		// loading assets
		console.log('init');
	}

	drawMap = () => {

	}
};