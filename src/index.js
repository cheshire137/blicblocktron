import { ipcRenderer, remote } from 'electron'
import Play from './components/play'
import MacOSMenu from './models/macos-menu'
import NonMacOSMenu from './models/non-macos-menu'

const { Menu } = remote

window.onload = function() {
  const rootEl = document.getElementById('root')
  const playTemplate = document.getElementById('game-board-template')

  const play = new Play(rootEl, playTemplate)
  play.render()

  const setMenu = (options) => {
    const menuBuilder = process.platform === 'darwin' ? new MacOSMenu() : new NonMacOSMenu()
    const template = menuBuilder.getTemplate(options)
    const menu = Menu.buildFromTemplate(template)

    Menu.setApplicationMenu(menu)

    menuBuilder.on('about-app', () => {
      ipcRenderer.send('title', 'About')
      // TODO: display info about app
    })

    menuBuilder.on('new-game', () => play.newGame())
    menuBuilder.on('pause-game', () => play.pauseGame())
    menuBuilder.on('resume-game', () => play.resumeGame())
  }

  play.on('pause-game', () => setMenu({ paused: true, gameOver: false }))
  play.on('in-progress', () => setMenu({ paused: false, gameOver: false }))
  play.on('game-over', () => setMenu({ paused: false, gameOver: true }))

  window.addEventListener('keydown', (event) => play.onKeydown(event))

  play.startGame()
}
