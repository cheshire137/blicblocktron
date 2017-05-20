import EventEmitter from 'events'
import Mustache from 'mustache'

class HighScores extends EventEmitter {
  constructor(container, templateContainer) {
    super()
    this.container = container
    this.template = templateContainer.innerHTML
  }

  render(opts) {
    opts = opts || {}
    const templateArgs = {
      scores: []
    }
    this.container.innerHTML = Mustache.render(this.template, templateArgs)
  }
}

module.exports = HighScores
