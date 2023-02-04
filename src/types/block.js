import { BlockTemplate } from './block-template'
import { BlockTarget } from './block-target'
import { Scratch } from './scratch'
import { uuidv4 } from '../utils'

export class Block {
  /**
   * @param {Scratch} scratch
   * @param {Number} x
   * @param {Number} y
   */
  constructor(scratch, x = 0, y = 0) {
    this.scratch = scratch

    this.id = uuidv4()

    this.x = x
    this.y = y
    this.offsetX = 0
    this.offsetY = 0
    this.target = new BlockTarget()

    this.isActive = false
    this.isFrozen = false

    this.childOf = {
      block: null,
      component: null,
    }

    this.template = new BlockTemplate()

    this.listeners = {
      drag: this.drag.bind(this),
      dragEnd: this.dragEnd.bind(this),
    }
  }

  isChild() {
    return this.childOf.block || this.childOf.component
  }

  isRelatedTo(block) {
    return this.id == block.id || this.childOf == block.id
  }

  setChildOf(block, component) {
    this.childOf = {
      block: block?.id || null,
      component: component?.id || null,
    }
  }

  dragStart(event) {
    if (this.isFrozen || this.isActive) return

    if (this.isChild()) {
      const el = document.getElementById(this.id)
      const { x, y } = el.getBoundingClientRect()
      this.x = x
      this.y = y
      this.detach()
    }

    this.offsetX = this.x - event.clientX
    this.offsetY = this.y - event.clientY

    this.xBeforeDrag = this.x
    this.yBeforeDrag = this.y

    this.isActive = true
    this.scratch.setActiveBlock(this)

    window.addEventListener('mousemove', this.listeners.drag)
    window.addEventListener('mouseup', this.listeners.dragEnd, { once: true })
  }

  drag(event) {
    if (!this.isActive) return

    this.x = event.clientX + this.offsetX
    this.y = event.clientY + this.offsetY
  }

  dragEnd() {
    if (!this.isActive) return

    window.removeEventListener('mousemove', this.listeners.drag)

    switch (this.target.type) {
      case 'child':
        this.attachToBlockComponent(
          this.target.block,
          this.target.component,
          this.target.index
        )
        break
      case 'before':
        // this.attachToRootComponent(this.target.component, this.target.index)
        break
      case 'after':
        // this.attachToRootComponent(this.target.component, this.target.index)
        break
      default:
        this.detach()
        break
    }

    this.isActive = false
    this.scratch.setActiveBlock(null)
    this.target.reset()
  }

  detach() {
    if (!this.childOf) return

    const component = this.scratch.findComponent(
      this.childOf.block,
      this.childOf.component
    )
    this.setChildOf(null, null)
    if (!component) return

    component.removeChild(this)
  }
}
