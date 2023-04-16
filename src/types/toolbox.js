import { Scratch } from './scratch'

export class Toolbox {
  constructor(scratch, toolboxDef) {
    this.scratch = scratch

    this.categories = toolboxDef?.categories || []
    this.blocks = toolboxDef?.blocks || []
  }

  getWidestBlock(blocks) {
    return blocks.reduce((acc, block) => {
      return acc > block.width ? acc : block.width
    }, 0)
  }

  getTotalBlocksHeight(blocks) {
    return blocks.reduce((acc, block) => acc + block.height, 0)
  }

  spawnBlock(event, block) {
    event = this.scratch.normalizeMouseEvent(event)
    block = this.scratch.spawnBlock(block.type, event.clientX, event.clientY)

    block.dragStart(event)
  }

  addVariable() {
    const name = prompt('Enter a name for a variable')
    if (!name?.length) return

    this.scratch.addVariable(name)
  }
}
