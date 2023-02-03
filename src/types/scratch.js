export class Scratch {
  constructor() {
    this.blocks = []
    this.variables = []

    this.activeBlock = null
  }

  getBlocks() {
    return this.blocks.filter((b) => !b.isRelative)
  }

  addBlock(block) {
    this.blocks.push(block)
  }

  setActiveBlock(block) {
    this.activeBlock = block
  }

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
