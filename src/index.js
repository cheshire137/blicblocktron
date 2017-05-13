import { ipcRenderer } from 'electron'
import Play from './components/play'
import AppMenu from './models/app-menu'

window.onload = function() {
  const rootEl = document.getElementById('root')
  const playTemplate = document.getElementById('game-board-template')
  const play = new Play(rootEl, playTemplate)
  const appMenu = new AppMenu()

  play.render()
  play.startGame()

  window.addEventListener('keydown', function(event) {
    play.onKeydown(event)
  })

  appMenu.on('about-app', () => {
    ipcRenderer.send('title', 'About')
    // TODO: display info about app
  })

  appMenu.on('new-game', () => play.newGame())
  appMenu.on('pause-game', () => play.pauseGame())
}
