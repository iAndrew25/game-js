import GAME_CONFIG from './game-config.js';

const {GAME_SPEED} = GAME_CONFIG;

export default new class CombatSystem {

	constructor() {
		this.isFighting = false;
		this.attackDuration = GAME_SPEED / 2;

		this.heroCastAttack = 0;
		this.enemyCastAttack = 0;

		this.enemy;
		this.hero;
	}

	enemyAttack = () => {
		if((Date.now() - this.enemyCastAttack) >= this.enemy.attackDuration) {
			this.enemyCastAttack = Date.now();
			this.enemy.attack(this.hero);
		}
	}

	heroAttack = enemy => {
		if((Date.now() - this.heroCastAttack) >= this.hero.attackDuration) {
			this.heroCastAttack = Date.now();
			this.hero.attack(this.enemy);
		}
	}

	startFighting = (hero, enemy) => {
		this.isFighting = true;
		this.enemy = enemy;
		this.hero = hero;

		this.enemy.setCharacterMode('ATTACK');
		this.hero.setCharacterMode('ATTACK');

		this.fight();
	}

	endFight = () => {
		this.isFighting = false;

		this.enemy.setCharacterMode('IDLE');
		this.hero.setCharacterMode('IDLE');


		if(!this.enemy.currentHealth) {
			// drop items
		}

		if(!this.hero.currentHealth) {
			this.hero.revive();
		}
	}

	fight = () => {
		if(!this.hero.currentHealth || !this.enemy.currentHealth || this.hero.isMoving) {
			this.endFight();
			return;
		} else {
			this.enemyAttack();
			this.heroAttack(this.enemy);

			requestAnimationFrame(() => this.fight(this.enemy));			
		}
	}
};