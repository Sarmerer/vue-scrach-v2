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

  /**
   * @param {Object} options
   * @param {Point} options.delta
   * @param {Boolean} options.fast
   * @param {Boolean} options.propagateUp
   */
  update(options) {}
}
