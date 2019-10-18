export default class LevelingSystem {
	constructor() {
		this.level = 1;
		this.experience = 0;
	}

	setExperience = newExp => {
		this.experience += newExp;
		console.log("this.experience", this.experience);

		this.level = this.setLevel();
		console.log("this.level", this.level);
	};

	setLevel = () => {
		switch(this.experience) {
			case this.experience <= 10:
				return 1;

			case this.experience > 10 && this.experience <= 20:
				return 2;

			case this.experience > 20  && this.experience <= 35:
				return 3;

			case this.experience > 35 && this.experience <= 50:
				return 4;

			case this.experience > 50 && this.experience <= 70:
				return 5;

			default:
				return 6;
		};
	};
}