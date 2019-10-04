export default new class Assets {
	images = {};

	getImage = key => this.images[key]

	setImage = (key, src) => {
		const img = new Image();
		img.src = src;

		return new Promise((resolve, reject) => {
			img.onload = () => {
				this.images[key] = img;
				resolve(img);
			}

			img.onerror = () => {
				reject(`Could not load image: ${src}`);
			}
		});
	}
};