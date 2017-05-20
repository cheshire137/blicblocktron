import Block from '../../src/models/block'
import TetrominoChecker from '../../src/models/tetromino-checker'

describe('TetrominoChecker', () => {
  it('starts with no tetromino blocks', () => {
    const checker = new TetrominoChecker([], {})
    expect(checker.tetromino).toEqual([])
  })

  it('returns false when no blocks are given', () => {
    const checker = new TetrominoChecker([], {})
    expect(checker.check()).toEqual(false)
  })

  // 1**
  // * *
  it('returns true when tetromino could form in two ways', () => {
    const b1 = new Block({ x: 0, y: 0, color: 'blue', id: 'b1' })
    const b2 = new Block({ x: 0, y: 1, color: 'blue', id: 'b2' })
    const b3 = new Block({ x: 1, y: 0, color: 'blue', id: 'b3' })
    const b4 = new Block({ x: 2, y: 0, color: 'blue', id: 'b4' })
    const b5 = new Block({ x: 2, y: 1, color: 'blue', id: 'b5' })
    const blocks = [b1, b2, b3, b4, b5]
    const checker = new TetrominoChecker(blocks, b1)
    expect(checker.check()).toEqual(true)
    expect(checker.tetromino.length).toEqual(4)
    const actualIDs = checker.tetromino.map(b => b.id).sort()
    expect(actualIDs).toEqual([b1.id, b2.id, b3.id, b4.id])
  })

  it('returns false when matching blocks are not contiguous', () => {
    const b1 = new Block({ x: 1, y: 6, color: 'white' })
    const b2 = new Block({ x: 3, y: 6, color: 'white' })
    const b3 = new Block({ x: 3, y: 5, color: 'white' })
    const b4 = new Block({ x: 2, y: 5, color: 'white' })
    const blocks = [b1, b2, b3, b4]
    const checker = new TetrominoChecker(blocks, b1)
    expect(checker.check()).toEqual(false)
  })

  it('filters out blocks of a different color', () => {
    const b1 = new Block({ x: 0, y: 0, color: 'blue' })
    const b2 = new Block({ x: 0, y: 1, color: 'magenta' })
    const b3 = new Block({ x: 0, y: 2, color: 'white' })
    const b4 = new Block({ x: 0, y: 3, color: 'blue' })
    const blocks = [b1, b2, b3, b4]
    const checker = new TetrominoChecker(blocks, b1)
    expect(checker.blocks.length).toEqual(1)
    expect(checker.blocks[0].id).toEqual(b4.id)
  })

  // 1***
  it('returns true when straight horizontal tetromino exists', () => {
    const b1 = new Block({ x: 0, y: 0, color: 'blue' })
    const b2 = new Block({ x: 0, y: 1, color: 'blue' })
    const b3 = new Block({ x: 0, y: 2, color: 'blue' })
    const b4 = new Block({ x: 0, y: 3, color: 'blue' })
    const blocks = [b1, b2, b3, b4]
    const checker = new TetrominoChecker(blocks, b1)
    expect(checker.check()).toEqual(true)
  })

  // 1
  // *
  // *
  // *
  it('returns true when straight vertical tetromino exists', () => {
    const b1 = new Block({ x: 0, y: 0, color: 'blue' })
    const b2 = new Block({ x: 1, y: 0, color: 'blue' })
    const b3 = new Block({ x: 2, y: 0, color: 'blue' })
    const b4 = new Block({ x: 3, y: 0, color: 'blue' })
    const blocks = [b1, b2, b3, b4]
    const checker = new TetrominoChecker(blocks, b1)
    expect(checker.check()).toEqual(true)
  })

  // 1*
  // **
  it('returns true when square tetromino exists', () => {
    const b1 = new Block({ x: 0, y: 0, color: 'blue' })
    const b2 = new Block({ x: 0, y: 1, color: 'blue' })
    const b3 = new Block({ x: 1, y: 0, color: 'blue' })
    const b4 = new Block({ x: 1, y: 1, color: 'blue' })
    const blocks = [b1, b2, b3, b4]
    const checker = new TetrominoChecker(blocks, b1)
    expect(checker.check()).toEqual(true)
  })

  //  1       1*
  //  *  1    *   **1
  // **  ***  *     *
  // A   B    C   D
  it('returns true when left L A tetromino exists', () => {
    const b1 = new Block({ x: 0, y: 1, color: 'blue' })
    const b2 = new Block({ x: 1, y: 1, color: 'blue' })
    const b3 = new Block({ x: 2, y: 0, color: 'blue' })
    const b4 = new Block({ x: 2, y: 1, color: 'blue' })
    const blocks = [b1, b2, b3, b4]
    const checker = new TetrominoChecker(blocks, b1)
    expect(checker.check()).toEqual(true)
  })

  it('returns true when left L B tetromino exists', () => {
    const b1 = new Block({ x: 0, y: 0, color: 'blue' })
    const b2 = new Block({ x: 1, y: 0, color: 'blue' })
    const b3 = new Block({ x: 1, y: 1, color: 'blue' })
    const b4 = new Block({ x: 1, y: 2, color: 'blue' })
    const blocks = [b1, b2, b3, b4]
    const checker = new TetrominoChecker(blocks, b1)
    expect(checker.check()).toEqual(true)
  })

  it('returns true when left L C tetromino exists', () => {
    const b1 = new Block({ x: 0, y: 0, color: 'blue' })
    const b2 = new Block({ x: 0, y: 1, color: 'blue' })
    const b3 = new Block({ x: 1, y: 0, color: 'blue' })
    const b4 = new Block({ x: 2, y: 0, color: 'blue' })
    const blocks = [b1, b2, b3, b4]
    const checker = new TetrominoChecker(blocks, b1)
    expect(checker.check()).toEqual(true)
  })

  it('returns true when left L D tetromino exists', () => {
    const b1 = new Block({ x: 0, y: 2, color: 'blue' })
    const b2 = new Block({ x: 1, y: 2, color: 'blue' })
    const b3 = new Block({ x: 0, y: 1, color: 'blue' })
    const b4 = new Block({ x: 0, y: 0, color: 'blue' })
    const blocks = [b1, b2, b3, b4]
    const checker = new TetrominoChecker(blocks, b1)
    expect(checker.check()).toEqual(true)
  })

  // 1        *1
  // *     1   *  1**
  // **  ***   *  *
  // A   B     C  D
  it('returns true when right L A tetromino exists', () => {
    const b1 = new Block({ x: 0, y: 0, color: 'blue' })
    const b2 = new Block({ x: 1, y: 0, color: 'blue' })
    const b3 = new Block({ x: 2, y: 0, color: 'blue' })
    const b4 = new Block({ x: 2, y: 1, color: 'blue' })
    const blocks = [b1, b2, b3, b4]
    const checker = new TetrominoChecker(blocks, b1)
    expect(checker.check()).toEqual(true)
  })

  it('returns true when right L B tetromino exists', () => {
    const b1 = new Block({ x: 0, y: 2, color: 'blue' })
    const b2 = new Block({ x: 1, y: 2, color: 'blue' })
    const b3 = new Block({ x: 1, y: 1, color: 'blue' })
    const b4 = new Block({ x: 1, y: 0, color: 'blue' })
    const blocks = [b1, b2, b3, b4]
    const checker = new TetrominoChecker(blocks, b1)
    expect(checker.check()).toEqual(true)
  })

  it('returns true when right L C tetromino exists', () => {
    const b1 = new Block({ x: 0, y: 1, color: 'blue' })
    const b2 = new Block({ x: 0, y: 0, color: 'blue' })
    const b3 = new Block({ x: 1, y: 1, color: 'blue' })
    const b4 = new Block({ x: 2, y: 1, color: 'blue' })
    const blocks = [b1, b2, b3, b4]
    const checker = new TetrominoChecker(blocks, b1)
    expect(checker.check()).toEqual(true)
  })

  it('returns true when right L D tetromino exists', () => {
    const b1 = new Block({ x: 0, y: 0, color: 'blue' })
    const b2 = new Block({ x: 1, y: 0, color: 'blue' })
    const b3 = new Block({ x: 0, y: 1, color: 'blue' })
    const b4 = new Block({ x: 0, y: 2, color: 'blue' })
    const blocks = [b1, b2, b3, b4]
    const checker = new TetrominoChecker(blocks, b1)
    expect(checker.check()).toEqual(true)
  })

  //           1    1
  // *1    1*  **  **
  //  **  **    *  *
  //  A   B    C   D
  it('returns true when Z A tetromino exists', () => {
    const b1 = new Block({ x: 1, y: 0, color: 'blue' })
    const b2 = new Block({ x: 0, y: 0, color: 'blue' })
    const b3 = new Block({ x: 1, y: 1, color: 'blue' })
    const b4 = new Block({ x: 2, y: 1, color: 'blue' })
    const blocks = [b1, b2, b3, b4]
    const checker = new TetrominoChecker(blocks, b1)
    expect(checker.check()).toEqual(true)
  })

  it('returns true when Z B tetromino exists', () => {
    const b1 = new Block({ x: 0, y: 1, color: 'blue' })
    const b2 = new Block({ x: 1, y: 0, color: 'blue' })
    const b3 = new Block({ x: 1, y: 1, color: 'blue' })
    const b4 = new Block({ x: 0, y: 2, color: 'blue' })
    const blocks = [b1, b2, b3, b4]
    const checker = new TetrominoChecker(blocks, b1)
    expect(checker.check()).toEqual(true)
  })

  it('returns true when Z C tetromino exists', () => {
    const b1 = new Block({ x: 0, y: 0, color: 'blue' })
    const b2 = new Block({ x: 1, y: 0, color: 'blue' })
    const b3 = new Block({ x: 1, y: 1, color: 'blue' })
    const b4 = new Block({ x: 2, y: 1, color: 'blue' })
    const blocks = [b1, b2, b3, b4]
    const checker = new TetrominoChecker(blocks, b1)
    expect(checker.check()).toEqual(true)
  })

  it('returns true when Z D tetromino exists', () => {
    const b1 = new Block({ x: 0, y: 1, color: 'blue' })
    const b2 = new Block({ x: 1, y: 0, color: 'blue' })
    const b3 = new Block({ x: 1, y: 1, color: 'blue' })
    const b4 = new Block({ x: 2, y: 0, color: 'blue' })
    const blocks = [b1, b2, b3, b4]
    const checker = new TetrominoChecker(blocks, b1)
    expect(checker.check()).toEqual(true)
  })

  // 1    1
  // **  **   1   *1*
  // *    *  ***   *
  // A    B   C    D
  it('returns true when T A tetromino exists')
  it('returns true when T B tetromino exists')
  it('returns true when T C tetromino exists')
  it('returns true when T D tetromino exists')
})
