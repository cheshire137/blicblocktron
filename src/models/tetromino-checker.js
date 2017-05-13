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

    this.blocks.forEach(block => {
      const xDiff = Math.abs(block.x - this.targetBlock.x)
      const yDiff = Math.abs(block.y - this.targetBlock.y)

      if (block.x === this.targetBlock.x && yDiff <= 3) {
        this.tetromino.push(block)
      } else if (block.y === this.targetBlock.y && xDiff <= 3) {
        this.tetromino.push(block)
      } else if (xDiff <= 2 && yDiff <= 1 || xDiff <= 1 && yDiff <= 2) {
        this.tetromino.push(block)
      }
    })

    if (this.tetromino.length === 3) {
      this.tetromino.push(this.targetBlock)
      return true
    }

    return false
  }
}

module.exports = TetrominoChecker
