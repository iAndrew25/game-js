import GAME_CONFIG from './game-config.js';

const {GAME_SPEED} = GAME_CONFIG;

export default new class CombatSystem {

	constructor() {
		this.isFighting = false;
		this.attackDuration = GAME_SPEED / 2;

		this.heroCastAttack = 0;
		this.enemyCastAttack = 0;

		this.enemyAttackDuration;
		this.heroAttackDuration;

		this.enemy;
		this.hero;
	}

	getAttackDuration = character => {
		this.attackDuration = GAME_SPEED / 2;

		return this.attackDuration - (this.attackDuration * character.stats.attackSpeed) / 100;
	}

	enemyAttack = () => {
		if((Date.now() - this.enemyCastAttack) >= this.enemyAttackDuration) {
			this.enemyCastAttack = Date.now();
			this.enemy.attack(this.hero);
		}
	}

	heroAttack = enemy => {
		if((Date.now() - this.heroCastAttack) >= this.heroAttackDuration) {
			this.heroCastAttack = Date.now();
			this.hero.attack(this.enemy);
		}
	}

	startFighting = (hero, enemy) => {
		this.isFighting = true;
		this.enemy = enemy;
		this.hero = hero;

		this.enemyAttackDuration = this.getAttackDuration(enemy);
		this.heroAttackDuration = this.getAttackDuration(this.hero);

		this.fight(enemy);
	}

	stopFighting = () => {

	}

	fight = enemy => {
		if(!this.hero.currentHealth || !enemy.currentHealth || this.hero.isMoving) {
			this.isFighting = false;
			this.hero.setCharacterMode('IDLE');
			return;
		} else {
			console.log('attack');
			this.enemyAttack();
			this.heroAttack(enemy);

			requestAnimationFrame(() => this.fight(enemy));			
		}
	}
};