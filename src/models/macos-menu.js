import { remote } from 'electron'
import path from 'path'
import AppMenu from './app-menu'

const { app } = remote
const packageInfo = require(path.join(__dirname, '..', '..', 'package.json'))

class MacOSMenu extends AppMenu {
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
            click() { app.quit() }
          }
        ],
      },
      {
        label: 'Game',
        submenu: [
          this.newGameOption(),
          this.pauseGameOption(opts),
          this.resumeGameOption(opts)
        ]
      },
      {
        label: 'Scores',
        submenu: [
          this.viewHighScoresOption()
        ]
      },
      {
        label: 'Tools',
        submenu: [
          {
            label: 'Developer tools',
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
          this.reportBugOption()
        ]
      }
    ]
  }
}

module.exports = MacOSMenu
