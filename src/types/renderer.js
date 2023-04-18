import { Block } from './block'
import { Drawer } from './block-drawer'
import { Scratch } from './scratch'

export class Renderer {
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

  /** @param {Block} block */
  addDrawer(block) {
    const drawer = new this.Drawer(block, this)
    this.drawers.set(block.id, drawer)
    return drawer
  }

  /** @param {Block} block */
  removeDrawer(block) {
    if (!block) return

    this.drawers.delete(block.id)
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

  update() {}
}
