import Hero from './hero.js';
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
	}

	getAttackDuration = character => {
		this.attackDuration = GAME_SPEED / 2;

		return this.attackDuration - (this.attackDuration * character.stats.attackSpeed) / 100;
	}

	enemyAttack = () => {
		if((Date.now() - this.enemyCastAttack) >= this.enemyAttackDuration) {
			this.enemyCastAttack = Date.now();
			this.enemy.attack(Hero);
		}
	}

	heroAttack = enemy => {
		if((Date.now() - this.heroCastAttack) >= this.heroAttackDuration) {
			this.heroCastAttack = Date.now();
			Hero.attack(this.enemy);
		}
	}

	startFighting = enemy => {
		this.isFighting = true;
		this.enemy = enemy;

		this.enemyAttackDuration = this.getAttackDuration(enemy);
		this.heroAttackDuration = this.getAttackDuration(Hero);

		this.fight(enemy);
	}

	fight = enemy => {
		if(!Hero.currentHealth || !enemy.currentHealth) {
			this.isFighting = false;
		} else {
			this.enemyAttack();
			this.heroAttack(enemy);

			requestAnimationFrame(() => this.fight(enemy));			
		}
	}
};