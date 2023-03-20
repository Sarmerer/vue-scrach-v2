import { Block } from './block'
import { BlockInput } from './block-input'
import { Renderer } from './renderer'

export class Drawer {
  /**
   * @param {Block} block
   * @param {Renderer} renderer
   */
  constructor(block, renderer) {
    this.block = block
    this.renderer = renderer
  }

  /** @returns {Array<Array<BlockInput>>} */
  getInputGroups() {
    return this.block.inputs.reduce((acc, input) => {
      if (input.group > acc.length - 1) acc.push([])
      acc[acc.length - 1].push(input)
      return acc
    }, [])
  }

  update() {}
}
