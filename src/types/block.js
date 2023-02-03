import { BlockTemplate } from './block-template'
import store from '../store'
import { uuidv4 } from '../utils'

export class Block {
  constructor() {
    this.id = uuidv4()

    this.x = 0
    this.y = 0
    this.offsetX = 0
    this.offsetY = 0
    this.targetType = null
    this.targetBlock = null
    this.targetComponent = null

    this.blockAfter = null
    this.childOf = null

    this.isActive = false
    this.isFrozen = false
    this.isRelative = false

    this.template = new BlockTemplate()

    this.listeners = {
      drag: this.drag.bind(this),
      dragEnd: this.dragEnd.bind(this),
    }
  }

  get scratch() {
    return store.state.scratch
  }

  setTarget(type, block, component) {
    this.targetType = type
    this.targetBlock = block
    this.targetComponent = component
  }

  resolveTarget() {
    switch (this.targetType) {
      case 'child':
        this.targetComponent.children.push(this.id)
        this.childOf = this.targetBlock.id
        this.isRelative = true
        break
      case 'before':
        this.targetBlock.isRelative = true
        this.isRelative = false
        this.blockAfter = this.targetBlock.id
        break
      case 'after':
        this.isRelative = true
        this.targetBlock.blockAfter = this.id
        break
      default:
        break
    }

    this.targetType = null
    this.target = null
  }

  dragStart(event) {
    if (this.isFrozen) return

    if (this.isRelative) {
      const el = document.getElementById(this.id)
      const { x, y } = el.getBoundingClientRect()
      this.x = x
      this.y = y
      this.isRelative = false
      this.childOf = null
      this.blockAfter = null
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

    this.resolveTarget()

    this.isActive = false
    this.scratch.setActiveBlock(null)
  }
}
