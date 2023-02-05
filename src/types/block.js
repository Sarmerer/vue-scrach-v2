import { BlockTarget } from './block-target'
import { Scratch } from './scratch'
import {
  BlockDummyInput,
  BlockStatementInput,
  BlockValueInput,
} from './block-input'
import { uuidv4 } from '../utils'

export class Block {
  /**
   * @param {Scratch} scratch
   * @param {Number} x
   * @param {Number} y
   */
  constructor(scratch, x = 0, y = 0) {
    this.id = uuidv4()
    this.scratch = scratch

    this.x = x
    this.y = y
    this.offsetX = 0
    this.offsetY = 0
    this.target = new BlockTarget()

    this.isDragged = false
    this.hasOutput = false
    this.hasPrev = false
    this.hasNext = false

    this.firstStatementOf = null
    this.inputOf = null
    this.prevBlock = null
    this.nextBlock = null
    this.inputs = []

    this.colors = {
      background: 'cyan',
      text: 'white',
    }

    this.listeners = {
      drag: this.drag.bind(this),
      dragEnd: this.dragEnd.bind(this),
    }
  }

  isRelative() {
    return this.prevBlock || this.inputOf || this.firstStatementOf
  }

  isActive() {
    return (
      this.isDragged ||
      this.prevBlock?.isActive() ||
      this.inputOf?.block.isActive() ||
      this.firstStatementOf?.block.isActive()
    )
  }

  getHead() {
    if (this.prevBlock) {
      return this.prevBlock.getHead()
    }

    return this
  }

  getTail() {
    if (this.nextBlock) {
      return this.nextBlock.getTail()
    }

    return this
  }

  applyToTarget() {
    switch (this.target.type) {
      case 'statement':
        this.setAsOutputStatementOf(this.target.input, this.target.index)
        break
      case 'input':
        this.setAsOutputOf(this.target.input)
        break
      case 'prev':
        this.setNext(this.target.block)
        break
      case 'next':
        this.setPrev(this.target.block)
        break
      default:
        break
    }
  }

  /**
   * @param {BlockValueInput} input
   */
  setAsOutputOf(input) {
    if (!this.hasOutput) return

    this.inputOf = input
  }

  /**
   * @param {Block} block
   */
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

  /**
   * @param {Block} block
   */
  setNext(block) {
    if (!this.hasNext || !block.hasPrev) return

    if (block.prevBlock) {
      block.prevBlock.nextBlock = this
      this.prevBlock = block.prevBlock
    }

    if (block.firstStatementOf) {
      this.firstStatementOf = block.firstStatementOf
      block.firstStatementOf = null
    }

    const tail = this.getTail()
    tail.nextBlock = block
    block.prevBlock = tail
  }

  /**
   * @param {BlockStatementInput} statement
   */
  setAsOutputStatementOf(statement) {
    this.firstStatementOf = statement
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
    this.firstStatementOf = null
    this.inputOf = null

    this.detachPrev()
    this.detachNext()
  }

  dragStart(event) {
    if (this.isDragged) return

    if (this.isRelative()) {
      const el = document.getElementById(this.id)
      const { x, y } = el.getBoundingClientRect()
      this.x = x
      this.y = y
    }

    this.offsetX = this.x - event.clientX
    this.offsetY = this.y - event.clientY

    this.xBeforeDrag = this.x
    this.yBeforeDrag = this.y

    this.isDragged = true
    this.scratch.setActiveBlock(this)

    window.addEventListener('mousemove', this.listeners.drag)
    window.addEventListener('mouseup', this.listeners.dragEnd, { once: true })
  }

  drag(event) {
    if (!this.isDragged) return

    const nextX = event.clientX + this.offsetX
    const nextY = event.clientY + this.offsetY

    if (this.isRelative()) {
      const dx = Math.abs(this.xBeforeDrag - nextX)
      const dy = Math.abs(this.yBeforeDrag - nextY)
      if (dx < 15 && dy < 15) return

      this.firstStatementOf = null
      this.inputOf = null
      this.detachPrev()
    }

    this.x = nextX
    this.y = nextY
  }

  dragEnd() {
    if (!this.isDragged) return

    window.removeEventListener('mousemove', this.listeners.drag)

    this.applyToTarget()

    this.isDragged = false
    this.scratch.setActiveBlock(null)
    this.target.reset()
  }

  addValueInput() {
    const input = new BlockValueInput(this)
    this.inputs.push(input)
    return input
  }

  addStatementInput() {
    const input = new BlockStatementInput(this)
    this.inputs.push(input)
    return input
  }

  addDummyInput() {
    const input = new BlockDummyInput(this)
    this.inputs.push(input)
    return input
  }

  allowOutput() {
    this.hasOutput = true
    this.hasNext = false
    this.hasPrev = false
    return this
  }

  allowPrev() {
    this.hasPrev = true
    this.hasOutput = false
    return this
  }

  allowNext() {
    this.hasNext = true
    this.hasOutput = false
    return this
  }

  setBackgroundColor(cssColor) {
    this.colors.background = cssColor
    return this
  }

  setTextColor(cssColor) {
    this.colors.text = cssColor
    return this
  }

  clearInputs() {
    this.inputs = []
    return this
  }
}
