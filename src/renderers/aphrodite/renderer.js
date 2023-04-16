import { Scratch } from '../../types/scratch'
import { Renderer } from '../../types/renderer'
import { AphroditeDrawer } from './drawer'
import { Block } from '../../types/block'

export class AphroditeRenderer extends Renderer {
  Drawer = AphroditeDrawer

  /** @param {Scratch} scratch */
  constructor(scratch) {
    super('aphrodite', scratch)
  }

  init_() {
    for (const block of this.scratch.blocks) {
      this.addDrawer(block)
    }
  }

  /**
   * @param {Block} block
   * @param {Object} options
   * @param {Boolean} options.propagateUp
   */
  update(block, options) {
    if (!block) return

    const updates = []

    if (options.propagateUp) {
      updates.push(...block.getAscendants())
    }

    if (!updates.length) {
      updates.push(block)
    }

    for (const block of updates) {
      const drawer = this.getDrawer(block)
      if (!drawer) continue

      drawer.update(options)
    }
  }
}
