import EventEmitter from 'events'
import Mustache from 'mustache'

import Game from '../models/game'
import Scoreboard from '../models/scoreboard'

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

  render(opts) {
    opts = opts || {}
    const { existingScore, submittedScore, rank, scoreCount,
            newScore, highScore } = opts

    const haveNewScore = typeof newScore === 'object'
    const haveExistingScore = typeof existingScore === 'object'
    const haveHighScore = typeof highScore === 'object'

    const showScoreForm = this.game.currentScore > 0 && !submittedScore
    const isHighestPersonalScore = haveNewScore &&
      (!haveExistingScore || newScore.value > existingScore.value)

    const templateArgs = {
      currentScore: this.game.currentScore,
      level: this.game.level,
      showRankMessage: typeof rank === 'number' &&
        typeof scoreCount === 'number',
      rank,
      scoreCount,
      upcoming: this.game.upcoming,
      blocks: this.game.blocks,
      isGameOver: this.game.isGameOver,
      inProgress: this.game.inProgress,
      isPaused: !this.game.inProgress && !this.game.isGameOver,
      showScoreForm,
      isHighestPersonalScore,
      showHighScore: haveHighScore,
      highScore
    }
    this.container.innerHTML = Mustache.render(this.template, templateArgs)

    this.hookUpHandlers()
  }

  hookUpHandlers() {
    const resumeButton = this.container.querySelector('.resume-button')
    if (resumeButton) {
      resumeButton.addEventListener('click', e => this.onResume(e))
    }

    const newGameButton = this.container.querySelector('.new-game-button')
    if (newGameButton) {
      newGameButton.addEventListener('click', e => this.onNewGame(e))
    }

    const scoreForm = this.container.querySelector('.submit-score-form')
    if (scoreForm) {
      scoreForm.addEventListener('submit', e => this.onSubmitScore(e))
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

  onSubmitScore(event) {
    event.preventDefault()

    const form = event.target
    const initials = form.querySelector('.initials-field').value.
      trim().slice(0, 3).toUpperCase()
    const value = this.game.currentScore

    const scoreboard = new Scoreboard()
    const existingScore = scoreboard.highestScoreForInitials(initials)
    const { newScore, rank, total } = scoreboard.saveScore(initials, value)

    this.render({
      existingScore,
      newScore,
      submittedScore: true,
      rank,
      scoreCount: total,
      highScore: this.getHighScoreForDisplay(newScore, existingScore)
    })
  }

  getHighScoreForDisplay(score1, score2) {
    const result = { value: score1.value }
    if (score2 && score2.value > result.value) {
      result.value = score2.value
      result.date = new Date(score2.time).toLocaleDateString()
    } else {
      result.date = new Date(score1.time).toLocaleDateString()
    }
    return result
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
