import Config from 'electron-config'

const scoresKey = 'scores'

// Stores Blicblock scores in descending order.
class Scoreboard {
  constructor() {
    this.config = new Config()
  }

  highestScoreForInitials(initials) {
    return this.getScores().filter(s => s.initials === initials)[0]
  }

  getScores() {
    return this.config.get(scoresKey) || []
  }

  getScoresWithRank() {
    const scores = this.getScores()
    if (scores.length < 1) {
      return scores
    }
    scores[0].rank = 1
    let previousValue = scores[0].value
    for (let i = 1; i < scores.length; i++) {
      const value = scores[i].value
      scores[i].rank = scores[i - 1].rank
      if (value !== previousValue) {
        scores[i].rank++
      }
      previousValue = value
    }
    return scores
  }

  saveScore(initials, value) {
    const newScore = { initials, value, time: new Date() }
    const scores = this.getScores()
    let newScores = null
    let rank = -1
    if (scores.length > 0) {
      for (let i = 0; i < scores.length; i++) {
        if (scores[i].value <= value) {
          const head = scores.slice(0, i)
          const tail = scores.slice(i, scores.length)
          rank = i + 1
          newScores = head.concat([newScore]).concat(tail)
          break
        }
      }
      if (rank < 0) {
        newScores = scores.concat([newScore])
        rank = newScores.length
      }
    } else {
      rank = 1
      newScores = [newScore]
    }
    this.config.set(scoresKey, newScores)
    return { rank: rank, total: newScores.length, newScore }
  }
}

module.exports = Scoreboard
