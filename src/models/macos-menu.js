import EventEmitter from 'events'
import { remote, shell } from 'electron'
import path from 'path'

const { app } = remote
const packageInfo = require(path.join(__dirname, '..', '..', 'package.json'))

class MacOSMenu extends EventEmitter {
  constructor() {
    super()
  }

  getTemplate(opts) {
    const self = this
    opts = opts || {}
    return [
      {
        label: packageInfo.name,
        submenu: [
          {
            label: `About ${packageInfo.name}`,
            click() { self.emit('about-app') }
          },
          // { label: 'About', selector: 'orderFrontStandardAboutPanel:' },
          { type: 'separator' },
          {
            label: 'Quit',
            accelerator: 'Command+Q',
            click() { app.quit() },
          },
        ],
      },
      {
        label: 'Game',
        submenu: [
          {
            label: 'New Game',
            click() { self.emit('new-game') }
          },
          {
            label: 'Pause Game',
            click() { self.emit('pause-game') },
            enabled: !opts.paused && !opts.gameOver
          },
          {
            label: 'Resume Game',
            click() { self.emit('resume-game') },
            enabled: opts.paused
          }
        ]
      },
      {
        label: 'Tools',
        submenu: [
          {
            label: 'Developer Tools',
            accelerator: 'CmdOrCtrl+Option+I',
            click(item, win) {
              if (win) {
                win.webContents.toggleDevTools()
              }
            },
          },
        ],
      },
      {
        label: 'Help',
        role: 'help',
        submenu: [
          {
            label: 'Report a bug',
            click() { shell.openExternal(packageInfo.bugs.url) }
          }
        ]
      }
    ]
  }
}

module.exports = MacOSMenu
