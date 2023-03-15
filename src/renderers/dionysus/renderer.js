import { BlockInput } from '../../types/block-input'
import { Renderer } from '../../types/renderer'
import { Block } from '../../types/block'

export class DionysusRenderer extends Renderer {
  BlocksContainerComponent = () => import('./index.vue')
  BlockComponent = () => import('./Block.vue')

  constructor(scratch) {
    super('dionysus', scratch)

    this.inputGroups = {}
  }

  init_() {
    this.inputGroups = {}
  }

  /**
   * @param {Block} block
   * @returns {Array<Array<BlockInput>>}
   */
  getInputGroups(block) {
    return block.inputs.reduce((acc, input) => {
      if (input.group > acc.length - 1) acc.push([])
      acc[acc.length - 1].push(input)
      return acc
    }, [])
  }
}
