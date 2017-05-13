import Game from '../models/game'
import Mustache from 'mustache'

class Play {
  constructor(container, templateContainer) {
    this.container = container
    this.game = new Game({
      redrawCallback: () => this.render()
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
    this.hookUpButtons()
  }

  hookUpButtons() {
    const resumeButton = this.container.querySelector('.resume-button')
    if (resumeButton) {
      resumeButton.addEventListener('click', e => this.onResume(e))
    }
  }

  startGame() {
    this.game.startGameInterval()
  }

  onResume(event) {
    event.target.blur()
    this.game.resume()
  }

  onKeydown(event) {
    const keyCode = event.keyCode

    if (keyCode === 40) { // down arrow
      this.game.moveDown()
    } else if (keyCode === 39) { // right arrow
      this.game.moveRight()
    } else if (keyCode === 37) { // left arrow
      this.game.moveLeft()
    } else if (keyCode === 32) { // space
      this.game.togglePause()
    }
  }
}

module.exports = Play
