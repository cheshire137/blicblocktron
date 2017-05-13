import Block from './block'
import TetrominoChecker from './tetromino-checker'

const rowCount = 7
const columnCount = 5
const middleColumnIndex = (columnCount - 1) / 2

class Game {
  constructor(opts) {
    opts = opts || {}
    this.level = opts.level || 1
    this.tickLength = opts.tickLength || 1200 // ms
    this.upcoming = [new Block(), new Block()]
    this.blocks = []
    this.inProgress = true
    this.isGameOver = false
    this.interval = null
    this.checking = false
    this.plummetingBlock = false
    this.slidingBlock = false
    this.currentScore = opts.currentScore || 0
    this.scoreValue = opts.scoreValue || 1000
    this.onUpdate = opts.onUpdate
  }

  pause() {
    if (this.plummetingBlock) {
      return
    }
    this.inProgress = false
    this.cancelGameInterval()
  }

  triggerUpdate() {
    if (typeof this.onUpdate === 'function') {
      console.log('updating', new Date().toLocaleTimeString())
      this.onUpdate()
    }
  }

  resume() {
    if (this.gameOver) {
      return
    }
    this.inProgress = true
    this.startGameInterval()
  }

  startGameInterval() {
    if (typeof this.interval !== 'undefined' && this.interval !== null) {
      return
    }
    this.interval = setInterval(() => {
      if (!this.inProgress || this.plummetingBlock || this.slidingBlock) {
        return
      }
      this.dropBlocks()
      this.dropQueuedBlockIfNoActive()
      this.triggerUpdate()
    }, this.tickLength)
  }

  dropBlocks() {
    if (!this.inProgress) {
      return
    }

    const lastRowY = rowCount - 1
    for (const block of this.blocks.filter(b => b && !b.isSliding)) {
      if (block.isActive || !block.isLocked) {
        if (block.y === lastRowY) {
          block.lock()
          block.deactivate()
          this.onBlockLand(block)
        }

        if (this.isBlockDirectlyBelow(block)) {
          block.lock()
          block.deactivate()
          this.onBlockLand(block)
        }
      }

      if (block.isLocked) {
        continue
      }

      block.moveDown()
    }
  }

  dropQueuedBlockIfNoActive() {
    const activeBlock = this.getActiveBlock()
    if (activeBlock) {
      return
    }

    this.dropQueuedBlock()
  }

  getActiveBlock() {
    return this.blocks.filter(b => b.isActive)[0]
  }

  dropQueuedBlock() {
    if (this.checking) {
      return
    }

    const middleColumnBlocks = this.getMiddleColumnBlocks()
    if (middleColumnBlocks.length < rowCount) {
      const x = middleColumnIndex // centered horizontally
      const y = 0 // at the top
      const topMidBlock = this.blocks.filter(b => b.y === y && b.x === x)[0]
      console.log(x, y, topMidBlock)
      if (topMidBlock) { // Currently dropping or sliding at the top
        return
      }

      const block = this.upcoming[0]
      block.moveTo(x, y)
      this.upcoming[0] = this.upcoming[1]
      this.enqueueBlock()
      this.blocks.push(block)
    } else {
      this.gameOver()
    }
  }

  getMiddleColumnBlocks() {
    return this.blocks.filter(b => b.x === middleColumnIndex)
  }

  enqueueBlock() {
    this.upcoming[1] = new Block()
  }

  gameOver() {
    this.inProgress = false
    this.isGameOver = true
    this.cancelGameInterval()
    this.saveHighScore()
  }

  cancelGameInterval() {
    if (this.interval) {
      clearInterval(this.interval)
      this.interval = null
    }
  }

  saveHighScore() {
    // TODO
  }

  isBlockDirectlyBelow(block) {
    const blocksBelow = this.blocks.filter(b => block.isDirectlyAbove(b))
    return blocksBelow.length > 0
  }

  onBlockLand(block) {
    this.highlight(block)
    this.checkForTetrominos()
  }

  highlight(block) {
    block.highlight()
    setTimeout(() => block.dehighlight(), this.tickLength * 0.21)
  }

  checkForTetrominos() {
    if (!this.inProgress || this.checking) {
      return
    }
    this.checking = true
    for (const block of this.blocks.filter(b => b && b.isLocked && !b.isActive)) {
      const checker = new TetrominoChecker(this.blocks, block)
      if (checker.check()) {
        this.removeBlocks(checker.tetromino)
      }
    }
    this.checking = false
  }

  removeBlocks(blocksToRemove) {
    if (!this.inProgress) {
      return
    }
    const idsToRemove = blocksToRemove.map(b => b.id)
    let idx = this.blocks.length - 1
    while (idx >= 0) {
      if (idsToRemove.indexOf(this.blocks[idx].id) > -1) {
        this.blocks.splice(idx, 1)
      }
      idx--
    }
    this.currentScore += this.scoreValue
    this.incrementLevelIfNecessary()
    const blocksOnTop = this.blocksOnTop(blocksToRemove).filter(b => !b.isActive)
    if (blocksOnTop.length > 0) {
      this.plummetBlocks(blocksOnTop)
    }
    this.checkForTetrominos()
  }

  // Returns an array of blocks anywhere over top of the given blocks.
  blocksOnTop(targetBlocks) {
    const xCoords = targetBlocks.map(b => b.x)
    const yCoords = targetBlocks.map(b => b.y)
    const maxY = Math.max.apply(null, yCoords)
    const onTop = this.blocks.filter(b => b.y < maxY && xCoords.indexOf(b.x) > -1)
    onTop.sort((a, b) => {
      if (a.y < b.y) {
        return 1
      }
      return (a.y > b.y) ? -1 : 0
    })
    return onTop
  }

  plummetBlocks(blocksToPlummet, index) {
    if (typeof index === 'undefined') {
      index = 0
    }
    const block = blocksToPlummet[index]
    const blockBelow = this.closestBlockBelow(block)
    const newY = blockBelow ? blockBelow.y - 1 : rowCount - 1
    this.plummetBlock(block, newY, () => {
      if (index < blocksToPlummet.length - 1) {
        this.plummetBlocks(blocksToPlummet, index + 1)
      }
    })
  }

  plummetBlock(block, y, callback) {
    if (block.y === y) {
      callback()
      return
    }
    let interval = null
    dropBlock = () => {
      block.plummet()
      this.plummetingBlock = true
      if (block.y < y) {
        block.moveDown()
      } else if (block.y === y) {
        if (interval) {
          clearInterval(interval)
        }
        block.lock()
        block.deactivate()
        this.plummetingBlock = false
        block.stopPlummeting()
        this.onBlockLand(block)
        callback()
      }
    }
    dropBlock()
    interval = setInterval(dropBlock, 25)
  }

  closestBlockBelow(block) {
    const x = block.x
    const y = block.y
    const blocksBelow = this.blocks.filter(b => b.y > y && b.x === x)
    blocksBelow.sort((a, b) => {
      if (a.y < b.y) {
        return -1
      }
      return (a.y > b.y) ? 1 : 0
    })
    return blocksBelow[0]
  }
}

module.exports = Game
