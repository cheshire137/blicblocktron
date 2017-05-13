import Play from './components/play'

window.onload = function() {
  const rootEl = document.getElementById('root')
  const playTemplate = document.getElementById('game-board-template')
  const play = new Play(rootEl, playTemplate)
  play.render()
  play.startGame()

  window.addEventListener('keydown', function(event) {
    play.onKeydown(event)
  })
}
