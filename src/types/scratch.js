export class Scratch {
  constructor() {
    this.blocks = []
    this.variables = []

    this.activeBlock = null
  }

  findComponent(blockId, componentId) {
    const block = this.blocks.find((b) => b.id == blockId)
    if (!block) return null

    return block.template.components.find((c) => c.id == componentId)
  }

  getBlocks() {
    return this.blocks.filter((b) => !b.isChild())
  }

  setActiveBlock(block) {
    this.activeBlock = block
  }

  addBlock(block) {
    if (!block.scratch) {
      block.scratch = this
    }

    this.blocks.push(block)
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
