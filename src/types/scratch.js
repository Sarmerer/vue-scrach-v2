import { Block } from './block'

export class Scratch {
  constructor() {
    this.blocks = []
    this.variables = []

    this.activeBlock = null
  }

  /** @returns {Array<Block>} */
  getBlocks() {
    return this.blocks.filter((b) => !b.isRelative())
  }

  /** @param {Block} block */
  setActiveBlock(block) {
    this.activeBlock = block
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
}
