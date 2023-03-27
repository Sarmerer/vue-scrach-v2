import { Scratch } from '../../types/scratch'
import { Renderer } from '../../types/renderer'
import { AphroditeDrawer } from './drawer'
import { Block } from '../../types/block'
import { Point } from '../../types/point'

export class AphroditeRenderer extends Renderer {
  BlocksContainerComponent = () => import('./index.vue')
  BlockComponent = () => import('./Block.vue')

  Drawer = AphroditeDrawer

  /** @param {Scratch} scratch */
  constructor(scratch) {
    super('aphrodite', scratch)
  }

  init_() {
    for (const block of this.scratch.blocks) {
      this.addDrawer(block)
    }

    const callback = (event) => {
      const { block } = event.detail
      this.update(block, { propagateUp: true })
    }

    this.scratch.events.addEventsListener(
      [Scratch.Events.BLOCK_CHANGE],
      callback
    )
  }

  /**
   * @param {Block} block
   * @param {Object} options
   * @param {Boolean} options.propagateUp
   * @param {Boolean} options.propagateDown
   */
  update(block, options) {
    if (!block) return

    const updates = []
    if (options.propagateUp) {
      updates.push(...block.getAscendants())
    }

    if (options.propagateDown) {
      updates.push(...block.getDescendants())
    }

    if (!updates.length) {
      updates.push(block)
    }

    for (const block of updates) {
      const drawer = this.getDrawer(block)
      if (drawer) drawer.update(options)
    }
  }
}
