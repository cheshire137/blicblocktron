const colors = ['magenta', 'orange', 'yellow', 'green', 'blue', 'white']

class Block {
  static randomColor() {
    return colors[Math.floor(Math.random() * colors.length)]
  }

  static uniqueId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0
      const v = c === 'x' ? r : (r & 0x3 | 0x8)
      return v.toString(16)
    })
  }

  constructor(opts) {
    opts = opts || {}
    this.x = opts.x
    this.y = opts.y
    this.id = opts.id || Block.uniqueId()
    this.color = opts.color || Block.randomColor()
    this.isSliding = typeof opts.isSliding === 'boolean' ? opts.isSliding : false
    this.isLocked = typeof opts.isLocked === 'boolean' ? opts.isLocked : false
    this.isActive = typeof opts.isActive === 'boolean' ? opts.isActive : true
    this.isPlummeting = typeof opts.isPlummeting === 'boolean' ? opts.isPlummeting : false
    this.isHighlighted = typeof opts.isHighlighted === 'boolean' ? opts.isHighlighted : false
  }

  lock() {
    this.isLocked = true
  }

  deactivate() {
    this.isActive = false
  }

  moveTo(x, y) {
    this.x = x
    this.y = y
  }

  moveLeft() {
    this.x--
  }

  moveDown() {
    this.y++
  }

  moveRight() {
    this.x++
  }

  slide() {
    this.isSliding = true
  }

  stopSliding() {
    this.isSliding = false
  }

  highlight() {
    this.isHighlighted = true
  }

  dehighlight() {
    this.isHighlighted = false
  }

  plummet() {
    this.isPlummeting = true
  }

  stopPlummeting() {
    this.isPlummeting = false
  }

  // Returns true if this Block is one row higher than the given Block,
  // in the same column.
  isDirectlyAbove(otherBlock) {
    return otherBlock.y === this.y + 1 &&
      otherBlock.x === this.x // same column
  }
}

module.exports = Block
