import { Scratch } from '../../types/scratch'
import { Renderer } from '../../types/renderer'
import { AphroditeDrawer } from './drawer'

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
      const { block, oldParent, newParent } = event.detail
      const drawers = [block, oldParent, newParent].reduce((acc, block) => {
        if (block && this.drawers.get(block.id)) {
          acc.set(block.id, this.drawers.get(block.id))
        }

        return acc
      }, new Map())

      this.update(drawers)
    }

    this.scratch.events.addEventsListener(
      [
        Scratch.Events.BLOCK_CHANGE,
        Scratch.Events.BLOCK_CREATE,
        Scratch.Events.BLOCK_MOVE,
      ],
      callback
    )
  }

  /** @param {Array<AphroditeDrawer>} drawers */
  update(drawers = this.drawers) {
    for (const [, drawer] of drawers) {
      drawer.update()
    }
  }

  /** @param {Array<AphroditeDrawer>} drawers */
  updateFast(drawers = this.drawers) {
    for (const [, drawer] of drawers) {
      drawer.updateFast()
    }
  }
}
