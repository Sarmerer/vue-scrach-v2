import { Block } from './block'
import { BlockInput } from './block-input'
import { Point } from './point'
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
    if (this.block.isInline) return this.getInputGroupsInline()

    return this.block.inputs.reduce((acc, input) => {
      if (input.group > acc.length - 1) acc.push([])
      acc[acc.length - 1].push(input)
      return acc
    }, [])
  }

  getInputGroupsInline() {
    return this.block.inputs.reduce((acc, input) => {
      if (input.type == BlockInput.Statement) {
        acc.push([input])
        return acc
      }

      if (!acc.length) {
        acc.push([])
      }

      acc[0].push(input)
      return acc
    }, [])
  }

  /**
   * @param {Object} options
   * @param {Point} options.delta
   * @param {Boolean} options.fast
   * @param {Boolean} options.propagateUp
   */
  update(options) {}
}
