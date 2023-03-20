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
    const callback = (event) => {
      const block = event.detail.block
      if (!block) return

      const drawer = this.drawers.get(block.id)
      if (!drawer) return

      this.updateDrawer(drawer)
    }

    this.scratch.events.addEventListeners({
      [Scratch.Events.BLOCK_CREATE]: callback,
      [Scratch.Events.BLOCK_MOVE]: callback,
      [Scratch.Events.BLOCK_CHANGE]: callback,
    })

    for (const block of this.scratch.blocks) {
      this.addDrawer(block)
    }
  }

  update() {
    for (const [, drawer] of this.drawers) {
      drawer.update()
    }
  }

  /** @param {AphroditeDrawer} drawer */
  updateDrawer(drawer) {
    drawer.update()
  }
}
