import { DOMElement } from './dom-element'
import { Scratch } from './scratch'
import { uuidv4 } from '../utils'
import {
  BlockDummyInput,
  BlockInput,
  BlockStatementInput,
  BlockValueInput,
} from './block-input'

export class Block extends DOMElement {
  static Connection = {
    Prev: 1,
    Next: 2,
    Input: 3,
    Statement: 4,
  }

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
    this.hasOutput = false
    this.hasPrev = false
    this.hasNext = false

    this.inputOf = null
    this.prevBlock = null
    this.nextBlock = null
    this.inputs = []

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
    return this.prevBlock || this.inputOf
  }

  /** @returns {Boolean} */
  isActive() {
    return (
      this.isDragged ||
      this.prevBlock?.isActive() ||
      this.inputOf?.block.isActive()
    )
  }

  /** @returns {Array<Array<BlockInput>>} */
  getInputGroups() {
    return this.inputs.reduce((acc, input) => {
      if (input.group > acc.length - 1) acc.push([])
      acc[acc.length - 1].push(input)
      return acc
    }, [])
  }

  /** @returns {Block} */
  getHead() {
    if (this.prevBlock) {
      return this.prevBlock.getHead()
    }

    return this
  }

  /** @returns {Block} */
  getTail() {
    if (this.nextBlock) {
      return this.nextBlock.getTail()
    }

    return this
  }

  /** @param {BlockInput} input */
  setInputOf(input) {
    if (
      !(this.hasOutput || (this.hasPrev && input.type == 'Statement')) ||
      input.type == 'Dummy'
    ) {
      return
    }

    const oldInput = this.scratch.blocks.find((b) => b.inputOf?.id == input.id)
    if (oldInput) {
      this.setNext(oldInput)
      oldInput.inputOf = null
    }

    this.inputOf = input
  }

  /** @param {Block} block */
  setPrev(block) {
    if (!this.hasPrev || !block.hasNext) return

    if (block.nextBlock) {
      const tail = this.getTail()
      tail.nextBlock = block.nextBlock
      block.nextBlock.prevBlock = tail
    }

    this.prevBlock = block
    block.nextBlock = this
  }

  /** @param {Block} block */
  setNext(block) {
    if (!this.hasNext || !block.hasPrev) return

    if (block.prevBlock) {
      block.prevBlock.nextBlock = this
      this.prevBlock = block.prevBlock
    }

    if (block.inputOf) {
      this.inputOf = block.inputOf
      block.inputOf = null
    }

    const tail = this.getTail()
    tail.nextBlock = block
    block.prevBlock = tail
  }

  detachPrev() {
    if (!this.prevBlock) return

    this.prevBlock.nextBlock = null
    this.prevBlock = null
  }

  detachNext() {
    if (!this.nextBlock) return

    this.nextBlock.prevBlock = null
    this.nextBlock = null
  }

  detachAll() {
    this.inputOf = null

    this.detachPrev()
    this.detachNext()
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

      this.inputOf = null
      this.detachPrev()
    }

    this.x = nextX
    this.y = nextY

    this.scratch.proximity.update(this)
  }

  dragEnd() {
    if (!this.isDragged) return

    window.removeEventListener('mousemove', this.listeners_.drag)

    this.isDragged = false
    this.scratch.proximity.connect(this)
  }

  /** @returns {BlockDummyInput} */
  addValueInput() {
    const input = new BlockValueInput(this)
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
    this.inputs.push(input)
    return input
  }

  /** @returns {Block} */
  allowOutput() {
    this.hasOutput = true
    this.hasNext = false
    this.hasPrev = false
    return this
  }

  /** @returns {Block} */
  allowPrev() {
    this.hasPrev = true
    this.hasOutput = false
    return this
  }

  /** @returns {Block} */
  allowNext() {
    this.hasNext = true
    this.hasOutput = false
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
