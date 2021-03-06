import { ipcRenderer, remote } from 'electron'

import MacOSMenu from './models/macos-menu'
import NonMacOSMenu from './models/non-macos-menu'

import Play from './components/play'
import HighScores from './components/high-scores'

const { Menu } = remote

window.onload = function() {
  const rootEl = document.getElementById('root')
  const playTemplate = document.getElementById('game-board-template')
  const highScoresTemplate = document.getElementById('high-scores-template')

  const play = new Play(rootEl, playTemplate)
  play.render()

  const highScores = new HighScores(rootEl, highScoresTemplate)

  const classifyBody = (add, remove) => {
    add.split(' ').forEach(cls => document.body.classList.add(cls))
    remove.split(' ').forEach(cls => document.body.classList.remove(cls))
  }

  const setMenu = (options) => {
    const isMacOS = process.platform === 'darwin'
    const menuBuilder = isMacOS ? new MacOSMenu() : new NonMacOSMenu()
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
      highScores.render()
    })
  }

  play.on('pause-game', () => {
    classifyBody('play paused', 'in-progress game-over high-scores')
    setMenu({ paused: true, gameOver: false })
  })

  play.on('in-progress', () => {
    classifyBody('play in-progress', 'paused game-over high-scores')
    setMenu({ paused: false, gameOver: false })
  })

  play.on('game-over', () => {
    classifyBody('play game-over', 'paused in-progress high-scores')
    setMenu({ paused: false, gameOver: true })
  })

  highScores.on('render', () => {
    classifyBody('high-scores', 'paused in-progress play game-over')
    setMenu({ paused: true, highScores: true })
  })

  window.addEventListener('keydown', (event) => play.onKeydown(event))

  play.startGame()
}
