import { DOMElement } from './dom-element'
import { Scratch } from './scratch'
import { uuidv4 } from '../utils'
import {
  BlockDummyInput,
  BlockInput,
  BlockStatementInput,
  BlockValueInput,
} from './block-input'
import { Connection } from './connection'

export class Block extends DOMElement {
  /**
   * @param {Scratch} scratch
   * @param {Number} x
   * @param {Number} y
   */
  constructor(scratch, x = 0, y = 0, type = null) {
    const id = uuidv4()
    super(id)

    this.id = id
    this.scratch = scratch
    this.type = type

    this.x = x
    this.y = y
    this.offsetX = 0
    this.offsetY = 0

    this.isDragged = false
    this.isFrozen = false

    this.isInline = false

    this.inputs = []
    this.outputBlock = null
    this.prevBlock = null
    this.nextBlock = null

    this.colors = {
      background: 'cyan',
      text: 'white',
    }

    this.listeners_ = {
      drag: this.drag.bind(this),
      dragEnd: this.dragEnd.bind(this),
    }
  }

  /** @returns {Boolean} */
  isRelative() {
    return this.prevBlock?.isConnected() || this.outputBlock?.isConnected()
  }

  /** @returns {Boolean} */
  isActive() {
    return (
      this.isDragged ||
      this.prevBlock?.getTargetBlock()?.isActive() ||
      this.outputBlock?.getTargetBlock()?.isActive()
    )
  }

  hasPrev() {
    return this.prevBlock !== null
  }

  hasNext() {
    return this.nextBlock !== null
  }

  hasOutput() {
    return this.outputBlock !== null
  }

  /** @returns {Array<Array<BlockInput>>} */
  getInputGroups() {
    return this.inputs.reduce((acc, input) => {
      if (input.group > acc.length - 1) acc.push([])
      acc[acc.length - 1].push(input)
      return acc
    }, [])
  }

  /** @param {MouseEvent} event */
  dragStart(event) {
    if (this.isDragged || this.isFrozen) return

    if (this.isRelative()) {
      const rect = this.getBoundingClientRect()
      const { x, y } = this.scratch.normalizePosition(rect.x, rect.y)
      this.x = x
      this.y = y
    }

    event = this.scratch.normalizeMouseEvent(event)
    this.offsetX = this.x - event.clientX
    this.offsetY = this.y - event.clientY

    this.xBeforeDrag = this.x
    this.yBeforeDrag = this.y

    this.isDragged = true
    this.scratch.proximity.prepare(this)

    window.addEventListener('mousemove', this.listeners_.drag)
    window.addEventListener('mouseup', this.listeners_.dragEnd, { once: true })
  }

  /** @param {MouseEvent} event */
  drag(event) {
    if (!this.isDragged) return

    event = this.scratch.normalizeMouseEvent(event)
    const nextX = event.clientX + this.offsetX
    const nextY = event.clientY + this.offsetY

    if (this.isRelative()) {
      const dx = Math.abs(this.xBeforeDrag - nextX)
      const dy = Math.abs(this.yBeforeDrag - nextY)
      if (dx < 15 && dy < 15) return

      this.outputBlock?.disconnect()
      this.prevBlock?.disconnect()
    }

    this.x = nextX
    this.y = nextY

    this.scratch.proximity.update(this)
  }

  dragEnd() {
    if (!this.isDragged) return

    window.removeEventListener('mousemove', this.listeners_.drag)

    this.isDragged = false
    this.scratch.proximity.reset(this)
  }

  /** @returns {BlockDummyInput} */
  addValueInput() {
    const input = new BlockValueInput(this)
    this.scratch.proximity.addConnection(input.connection)
    this.inputs.push(input)
    return input
  }

  /** @returns {BlockDummyInput} */
  addDummyInput() {
    const input = new BlockDummyInput(this)
    this.inputs.push(input)
    return input
  }

  /** @returns {BlockDummyInput} */
  addStatementInput() {
    const input = new BlockStatementInput(this)
    this.scratch.proximity.addConnection(input.connection)
    this.inputs.push(input)
    return input
  }

  /** @returns {Block} */
  allowOutput() {
    if (this.hasPrev()) {
      this.prevBlock.delete()
      this.prevBlock = null
    }

    if (this.hasNext()) {
      this.nextBlock.delete()
      this.nextBlock = null
    }

    this.outputBlock = new Connection(Connection.Output, this)
    this.scratch.proximity.addConnection(this.outputBlock)
    return this
  }

  /** @returns {Block} */
  allowPrev() {
    if (this.hasOutput()) {
      this.outputBlock.delete()
      this.outputBlock = null
    }

    this.prevBlock = new Connection(Connection.Prev, this)
    this.scratch.proximity.addConnection(this.prevBlock)
    return this
  }

  /** @returns {Block} */
  allowNext() {
    if (this.hasOutput()) {
      this.outputBlock.delete()
      this.outputBlock = null
    }

    this.nextBlock = new Connection(Connection.Next, this)
    this.scratch.proximity.addConnection(this.nextBlock)
    return this
  }

  setInline() {
    this.isInline = true
    return this
  }

  /** @returns {Block} */
  setBackgroundColor(cssColor) {
    this.colors.background = cssColor
    return this
  }

  /** @returns {Block} */
  setTextColor(cssColor) {
    this.colors.text = cssColor
    return this
  }
}
