import EventEmitter from 'events'
import Mustache from 'mustache'

import Scoreboard from '../models/scoreboard'

class HighScores extends EventEmitter {
  constructor(container, templateContainer) {
    super()
    this.container = container
    this.template = templateContainer.innerHTML
  }

  render(opts) {
    opts = opts || {}
    const scoreboard = new Scoreboard()
    const templateArgs = {
      scores: scoreboard.getScoresWithRank()
    }
    this.container.innerHTML = Mustache.render(this.template, templateArgs)
    this.emit('render')
  }
}

module.exports = HighScores
