import { shell } from 'electron'
import path from 'path'
import EventEmitter from 'events'

const packageInfo = require(path.join(__dirname, '..', '..', 'package.json'))

class AppMenu extends EventEmitter {
  constructor() {
    super()
  }

  newGameOption() {
    const self = this
    return {
      label: 'New Game',
      click() { self.emit('new-game') }
    }
  }

  pauseGameOption(opts) {
    const self = this
    return {
      label: 'Pause Game',
      click() { self.emit('pause-game') },
      enabled: !opts.paused && !opts.gameOver
    }
  }

  reportBugOption() {
    return {
      label: 'Report a bug',
      click() { shell.openExternal(packageInfo.bugs.url) }
    }
  }

  resumeGameOption(opts) {
    const self = this
    return {
      label: 'Resume Game',
      click() { self.emit('resume-game') },
      enabled: opts.paused
    }
  }
}

module.exports = AppMenu
