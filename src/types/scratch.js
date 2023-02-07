import { BlockProximityDetector } from './block-proximity-detector'
import { Block } from './block'

export class Scratch {
  static Blocks = {}

  constructor() {
    this.blocks = []
    this.variables = []

    this.proximity = new BlockProximityDetector(this)
  }

  /** @returns {Array<Block>} */
  getBlocks() {
    return this.blocks.filter((b) => !b.isRelative())
  }

  /**
   * @param {String} type
   * @param {Number} x
   * @param {Number} y
   */
  spawnBlock(type, x = 0, y = 0) {
    const factory = Scratch.Blocks[type]
    if (!factory) return

    const block = new Block(this, x, y)
    factory(block)
    this.addBlock(block)
  }

  /** @param {Block} block */
  addBlock(block) {
    if (!block.scratch) {
      block.scratch = this
    }

    this.blocks.push(block)
  }

  /** @param {Block} block */
  removeBlock(block) {
    if (!block) return

    const index = this.blocks.indexOf(block)
    if (index === -1) return

    this.blocks.splice(index, 1)
  }

  addVariable(variable) {
    this.variables.push(variable)
  }

  removeVariable(variable) {
    if (!variable) return

    const index = this.variables.indexOf(variable)
    if (index == -1) return

    this.variables.splice(index, 1)
  }

  /**
   *  @callback BlockTypeFactory
   * @param {Block} block
   */

  /**
   * @param {String} name
   * @param {BlockTypeFactory} factory
   */
  static DeclareBlock(name, factory) {
    if (Scratch.Blocks[name]) {
      console.warn('overriding existing block type with name:', name)
    }

    Scratch.Blocks[name] = factory
  }
}
