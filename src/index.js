import { ipcRenderer, remote } from 'electron'

import MacOSMenu from './models/macos-menu'
import NonMacOSMenu from './models/non-macos-menu'

import Play from './components/play'
import Scoreboard from './components/scoreboard'

const { Menu } = remote

window.onload = function() {
  const rootEl = document.getElementById('root')
  const playTemplate = document.getElementById('game-board-template')
  const scoreboardTemplate = document.getElementById('scoreboard-template')

  const play = new Play(rootEl, playTemplate)
  play.render()

  const scoreboard = new Scoreboard(rootEl, scoreboardTemplate)

  const setMenu = (options) => {
    const menuBuilder = process.platform === 'darwin' ? new MacOSMenu() : new NonMacOSMenu()
    const template = menuBuilder.getTemplate(options)
    const menu = Menu.buildFromTemplate(template)

    Menu.setApplicationMenu(menu)

    menuBuilder.on('about-app', () => {
      ipcRenderer.send('title', 'About')
      // TODO: display info about app
    })

    menuBuilder.on('new-game', () => {
      ipcRenderer.send('title', 'Play Blicblock')
      play.newGame()
      play.render()
    })

    menuBuilder.on('pause-game', () => {
      ipcRenderer.send('title', 'Play Blicblock')
      play.pauseGame()
    })

    menuBuilder.on('resume-game', () => {
      ipcRenderer.send('title', 'Play Blicblock')
      play.resumeGame()
      play.render()
    })

    menuBuilder.on('view-high-scores', () => {
      ipcRenderer.send('title', 'View high scores')
      play.pauseGame()
      scoreboard.render()
    })
  }

  play.on('pause-game', () => setMenu({ paused: true, gameOver: false }))
  play.on('in-progress', () => setMenu({ paused: false, gameOver: false }))
  play.on('game-over', () => setMenu({ paused: false, gameOver: true }))

  window.addEventListener('keydown', (event) => play.onKeydown(event))

  play.startGame()
}
