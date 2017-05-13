import Game from '../models/game'
import Mustache from 'mustache'

class Play {
  constructor(container, templateContainer) {
    this.container = container
    this.game = new Game()
    this.template = templateContainer.innerHTML
  }

  render() {
    const templateArgs = {
      currentScore: this.game.currentScore,
      level: this.game.level,
      existingHighScore: 0,
      existingScoreDate: '',
      upcoming: this.game.upcoming,
      blocks: this.game.blocks
    }
    this.container.innerHTML = Mustache.render(this.template, templateArgs)
    // this.game.loop()
  }
}

module.exports = Play
