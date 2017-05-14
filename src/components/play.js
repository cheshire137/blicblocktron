import EventEmitter from 'events'
import Game from '../models/game'
import Mustache from 'mustache'

class Play extends EventEmitter {
  constructor(container, templateContainer) {
    super()
    this.container = container
    this.gameOptions = {
      redrawCallback: () => this.render(),
      gameOverCallback: () => this.gameOver()
    }
    this.game = new Game(this.gameOptions)
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
      isPaused: !this.game.inProgress && !this.game.isGameOver,
      showScoreForm: this.game.currentScore > 0,
      showNewHighScore: false // TODO
    }
    this.container.innerHTML = Mustache.render(this.template, templateArgs)
    this.hookUpButtons()
  }

  hookUpButtons() {
    const resumeButton = this.container.querySelector('.resume-button')
    if (resumeButton) {
      resumeButton.addEventListener('click', e => this.onResume(e))
    }

    const newGameButton = this.container.querySelector('.new-game-button')
    if (newGameButton) {
      newGameButton.addEventListener('click', e => this.onNewGame(e))
    }
  }

  startGame() {
    this.game.startGameInterval()
    this.emit('in-progress')
  }

  gameOver() {
    this.emit('game-over')
  }

  pauseGame() {
    this.game.pause()
    this.emit('pause-game')
  }

  resumeGame() {
    this.game.resume()
    this.emit('in-progress')
  }

  onNewGame(event) {
    event.target.blur()
    this.newGame()
  }

  newGame() {
    this.game = new Game(this.gameOptions)
    this.render()
    this.startGame()
  }

  onResume(event) {
    event.target.blur()
    this.resumeGame()
  }

  togglePause() {
    if (this.game.inProgress) {
      this.pauseGame()
    } else {
      this.resumeGame()
    }
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
      this.togglePause()
    }
  }
}

module.exports = Play
