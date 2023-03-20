import { Drawer } from './block-drawer'
import { Scratch } from './scratch'

export class Renderer {
  BlocksContainerComponent = null
  BlockComponent = null

  Drawer = Drawer

  /**
   * @param {String} name
   * @param {Scratch} scratch
   */
  constructor(name, scratch) {
    this.scratch = scratch
    this.name = name
    this.didInit = false

    this.drawers = new Map()
  }

  getDrawer(block) {
    if (!block) return null

    return this.drawers.get(block.id)
  }

  addDrawer(block) {
    this.drawers.set(block.id, new this.Drawer(block, this))
  }

  init() {
    this.didInit = false
    this.init_()
    this.didInit = true
  }

  init_() {
    for (const block of this.scratch.blocks) {
      this.addDrawer(block)
    }
  }
}
