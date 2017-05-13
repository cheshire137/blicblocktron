import Block from './block'
import TetrominoChecker from './tetromino-checker'

const rowCount = 7
const columnCount = 5
const middleColumnIndex = (columnCount - 1) / 2

class Game {
  constructor(opts) {
    opts = opts || {}
    this.level = opts.level || 1
    this.tickLength = opts.tickLength || 1000 // ms
    this.tickLengthDecrementPct = opts.tickLengthDecrementPct || 0.09
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
    this.redrawCallback = opts.redrawCallback
  }

  togglePause() {
    if (this.inProgress) {
      this.pause()
    } else {
      this.resume()
    }
  }

  pause() {
    if (this.plummetingBlock) {
      return
    }
    this.inProgress = false
    this.cancelGameInterval()
  }

  redraw() {
    if (typeof this.redrawCallback === 'function') {
      this.redrawCallback()
    }
  }

  resume() {
    if (this.isGameOver) {
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
      this.redraw()
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
      this.redraw()
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
    this.redraw()
    setTimeout(() => {
      block.dehighlight()
      this.redraw()
    }, this.tickLength * 0.21)
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
    this.redraw()

    const blocksOnTop = this.blocksOnTop(blocksToRemove).filter(b => !b.isActive)
    if (blocksOnTop.length > 0) {
      this.plummetBlocks(blocksOnTop)
    }
    this.checkForTetrominos()
  }

  incrementLevelIfNecessary() {
    if (this.currentScore % 4000 === 0) {
      this.level++
      this.tickLength -= this.tickLength * this.tickLengthDecrementPct
      this.cancelGameInterval()
      this.startGameInterval()
    }
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

  moveDown() {
    if (!this.inProgress) {
      return
    }
    const block = this.getActiveBlock()
    if (!block || block.isPlummeting || block.isSliding) {
      return
    }
    if (block.y === rowCount - 1) { // In bottom row already
      return
    }
    const blockBelow = this.closestBlockBelow(block)
    let newY = rowCount - 1
    if (blockBelow) {
      newY = blockBelow.y - 1
    }
    this.plummetBlock(block, newY, () => {
      this.cancelGameInterval()
      this.dropQueuedBlockIfNoActive()
      this.startGameInterval()
    })
  }

  moveLeft() {
    if (!this.inProgress) {
      return
    }
    const block = this.getActiveBlock()
    if (!block || block.isPlummeting || block.isSliding) {
      return
    }
    if (block.x === 0) { // Furthest left already
      return
    }
    block.slide()
    this.slidingBlock = true
    const blockToLeft = this.closestBlockToLeft(block)
    if (blockToLeft && blockToLeft.x === block.x - 1) {
      this.stopSliding(block)
      return
    }
    block.moveLeft()
    this.redraw()
    setTimeout(() => this.stopSliding(block), 100)
  }

  moveRight() {
    if (!this.inProgress) {
      return
    }
    const block = this.getActiveBlock()
    if (!block || block.isPlummeting || block.isSliding) {
      return
    }
    if (block.x === columnCount - 1) { // Furthest right already
      return
    }
    const blockToRight = this.closestBlockToRight(block)
    if (blockToRight && blockToRight.x === block.x + 1) {
      this.stopSliding(block)
      return
    }
    block.moveRight()
    this.redraw()
    setTimeout(() => this.stopSliding(block), 100)
  }

  stopSliding(block) {
    block.stopSliding()
    this.slidingBlock = false
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
    const dropBlock = () => {
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
      this.redraw()
    }
    dropBlock()
    interval = setInterval(dropBlock, 25)
  }

  closestBlockBelow(block) {
    const { x, y } = block
    const blocksBelow = this.blocks.filter(b => b.y > y && b.x === x)
    blocksBelow.sort((a, b) => {
      if (a.y < b.y) {
        return -1
      }
      return (a.y > b.y) ? 1 : 0
    })
    return blocksBelow[0]
  }

  closestBlockToLeft(block) {
    const { x, y } = block
    const blocksToLeft = this.blocks.filter(b => b.y === y && b.x < x)
    blocksToLeft.sort((a, b) => {
      if (a.x < b.x) {
        return -1
      }
      return (a.x > b.x) ? 1 : 0
    })
    return blocksToLeft[blocksToLeft.length - 1]
  }

  closestBlockToRight(block) {
    const { x, y } = block
    const blocksToRight = this.blocks.filter(b => b.y === y && b.x > x)
    blocksToRight.sort((a, b) => {
      if (a.x < b.x) {
        return -1
      }
      return (a.x > b.x) ? 1 : 0
    })
    return blocksToRight[0]
  }
}

module.exports = Game
