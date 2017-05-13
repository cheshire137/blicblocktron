import EventEmitter from 'events'
import { remote, shell } from 'electron'
import path from 'path'

const { Menu, app } = remote
const packageInfo = require(path.join(__dirname, '..', '..', 'package.json'))

class AppMenu extends EventEmitter {
  constructor() {
    super()
    this.altOrOption = process.platform === 'darwin' ? 'Option' : 'Alt'
    const self = this
    this.aboutOption = {
      label: `About ${packageInfo.name}`,
      click() { self.emit('about-app') }
    }
    this.bugReportOption = {
      label: 'Report a bug',
      click() { shell.openExternal(packageInfo.bugs.url) }
    }
    this.template = []
    this.buildMenu()
    this.menu = Menu.buildFromTemplate(this.template)
    Menu.setApplicationMenu(this.menu)
  }

  buildMenu() {
    if (process.platform === 'darwin') {
      this.buildMacOSMenu()
    } else {
      this.buildNonMacOSMenu()
    }
  }

  buildMacOSMenu() {
    this.template.push(this.getAppMenu())
    this.template.push(this.getGameMenu())
    this.template.push(this.getToolsMenu())
    this.template.push({
      label: 'Help',
      role: 'help',
      submenu: [
        this.bugReportOption,
      ],
    })
  }

  buildNonMacOSMenu() {
    this.template.push(this.getGameMenu())
    this.template.push(this.getToolsMenu())
    this.template.push({
      label: 'Help',
      submenu: [
        this.aboutOption,
        this.bugReportOption,
      ],
    })
  }

  getAppMenu() {
    return {
      label: packageInfo.name,
      submenu: [
        this.aboutOption,
        // { label: 'About', selector: 'orderFrontStandardAboutPanel:' },
        { type: 'separator' },
        {
          label: 'Quit',
          accelerator: 'Command+Q',
          click() { app.quit() },
        },
      ],
    }
  }

  getGameMenu() {
    const self = this
    return {
      label: 'Game',
      submenu: [
        {
          label: 'New Game',
          click() { self.emit('new-game') }
        },
        {
          label: 'Pause Game',
          click() { self.emit('pause-game') }
        }
      ]
    }
  }

  getToolsMenu() {
    return {
      label: 'Tools',
      submenu: [
        {
          label: 'Developer Tools',
          accelerator: `CmdOrCtrl+${this.altOrOption}+I`,
          click(item, win) {
            if (win) {
              win.webContents.toggleDevTools()
            }
          },
        },
      ],
    }
  }
}

module.exports = AppMenu
