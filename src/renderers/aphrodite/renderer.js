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
    const callback = this.updateAccordingDrawer.bind(this)
    this.scratch.events.addEventListeners({
      [Scratch.Events.BLOCK_CREATE]: callback,
      [Scratch.Events.BLOCK_MOVE]: callback,
      [Scratch.Events.BLOCK_CHANGE]: callback,
    })

    for (const block of this.scratch.blocks) {
      this.addDrawer(block)
    }
  }

  /** @param {CustomEvent} event */
  updateAccordingDrawer(event) {
    const block = event.detail.block
    if (!block) return

    const drawer = this.drawers.get(block.id)
    if (!drawer) return

    drawer.update()
  }

  /** @param {AphroditeDrawer} member */
  balanceStack(member) {
    let next = member.block.nextConnection?.getTargetBlock()
    if (!next) return

    while (next) {
      next.y = member.getHeight()
      next.x = 0

      next = next.nextConnection?.getTargetBlock()
    }
  }
}
