import Game from '../models/game'
import Mustache from 'mustache'

class Play {
  constructor(container, templateContainer) {
    this.container = container
    this.game = new Game({
      onUpdate: () => this.render()
    })
    this.template = templateContainer.innerHTML
  }

  render() {
    const templateArgs = {
      currentScore: this.game.currentScore,
      level: this.game.level,
      existingHighScore: 0, // TODO
      existingScoreDate: '', // TODO
      upcoming: this.game.upcoming,
      blocks: this.game.blocks,
      isGameOver: this.game.isGameOver,
      inProgress: this.game.inProgress,
      isPaused: !this.game.inProgress && !this.game.isGameOver
    }
    this.container.innerHTML = Mustache.render(this.template, templateArgs)
  }

  startGame() {
    this.game.startGameInterval()
  }
}

module.exports = Play
