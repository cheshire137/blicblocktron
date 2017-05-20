class TetrominoChecker {
  constructor(blocks, targetBlock) {
    this.targetBlock = targetBlock
    this.blocks = blocks.filter(b => {
      return b.color === this.targetBlock.color &&
        b.id !== this.targetBlock.id
    })
    this.tetromino = []
  }

  // Returns true if the targetBlock given on initialization is part
  // of a tetromino. Sets this.tetromino to an array containing the blocks
  // that make up the tetromino.
  check() {
    if (this.blocks.length < 1) {
      return false
    }

    for (let i = 0; i < this.blocks.length; i++) {
      const block = this.blocks[i]
      const xDiff = Math.abs(block.x - this.targetBlock.x)
      const yDiff = Math.abs(block.y - this.targetBlock.y)

      if (this.tetromino.length > 2) {
        break
      }

      if (block.x === this.targetBlock.x && yDiff <= 3) {
        this.tetromino.push(block)
      } else if (block.y === this.targetBlock.y && xDiff <= 3) {
        this.tetromino.push(block)
      } else if (xDiff <= 2 && yDiff <= 1 || xDiff <= 1 && yDiff <= 2) {
        this.tetromino.push(block)
      }
    }

    if (this.tetromino.length === 3) {
      this.tetromino.push(this.targetBlock)
      return TetrominoChecker.areBlocksContiguous(this.tetromino)
    }

    return false
  }

  static areBlocksContiguous(blocks) {
    for (let i = 0; i < blocks.length; i++) {
      const block = blocks[i]
      const otherBlocks = blocks.slice(0, i).concat(blocks.slice(i + 1, blocks.length))
      const touchedBlocks = otherBlocks.filter(b => {
        return b.x === block.x + 1 && b.y === block.y ||
          b.x === block.x - 1 && b.y === block.y ||
          b.x === block.x && b.y === block.y + 1 ||
          b.x === block.x && b.y === block.y - 1
      })
      if (touchedBlocks.length < 1) {
        return false
      }
    }

    return true
  }
}

module.exports = TetrominoChecker
