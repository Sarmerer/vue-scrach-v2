import { Drawer } from './block-drawer'

export class Renderer {
  BlocksContainerComponent = null
  BlockComponent = null

  Drawer = Drawer

  constructor(name, scratch) {
    this.scratch = scratch
    this.name = name
    this.didInit = false

    this.drawers = {}
  }

  getDrawer(block) {
    if (!block) return null

    return this.drawers[block.id]
  }

  addDrawer(block) {
    const d = new Drawer(block, this)
    d.update()
    this.drawers[block.id] = d
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
