import { DOMElement } from './dom-element'
import { Scratch } from './scratch'
import { uuidv4 } from '../utils'
import {
  BlockDummyInput,
  BlockInput,
  BlockStatementInput,
  BlockValueInput,
} from './block-input'
import { BlockField } from '../types/block-field'
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
    this.outputConnection = null
    this.previousConnection = null
    this.nextConnection = null

    this.compiler = null
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
    return (
      this.previousConnection?.isConnected() ||
      this.outputConnection?.isConnected()
    )
  }

  /** @returns {Boolean} */
  isActive() {
    return (
      this.isDragged ||
      this.previousConnection?.getTargetBlock()?.isActive() ||
      this.outputConnection?.getTargetBlock()?.isActive()
    )
  }

  hasPrev() {
    return this.previousConnection !== null
  }

  hasNext() {
    return this.nextConnection !== null
  }

  hasOutput() {
    return this.outputConnection !== null
  }

  /** @returns {Array<Array<BlockInput>>} */
  getInputGroups() {
    return this.inputs.reduce((acc, input) => {
      if (input.group > acc.length - 1) acc.push([])
      acc[acc.length - 1].push(input)
      return acc
    }, [])
  }

  /**
   * @param {String} name
   * @returns {BlockInput}
   */
  findInput(name) {
    for (const input of this.inputs) {
      if (input.name === name) return input
    }

    return null
  }

  /**
   * @param {String} name
   * @returns {BlockField}
   */
  findField(name) {
    for (const input of this.inputs) {
      for (const field of input.fields) {
        if (field.name === name) return field
      }
    }

    return null
  }

  /** @returns {Object} */
  getFieldsValues() {
    const values = {}
    for (const input of this.inputs) {
      for (const field of input.fields) {
        if (field.name === null) continue

        values[field.name] = field.value
      }
    }

    return values
  }

  /** @returns {Array<BlockValueInput | BlockStatementInput>} */
  getInputs() {
    const statements = {}
    for (const input of this.inputs) {
      if (input.type === BlockInput.Dummy || input.name === null) continue
      if (!input.connection?.isConnected()) continue

      statements[input.name] = input
    }

    return statements
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

      this.outputConnection?.disconnect()
      this.previousConnection?.disconnect()
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
    this.scratch.events.dispatch(Scratch.Events.BLOCK_MOVE, {
      x: this.x,
      y: this.y,
      block: this,
    })
  }

  /**
   * @param {Number} type
   * @param {String} name
   * @returns {BlockInput}
   */
  addInput(type, name = null) {
    const types = {
      [BlockInput.Dummy]: BlockDummyInput,
      [BlockInput.Value]: BlockValueInput,
      [BlockInput.Statement]: BlockStatementInput,
    }

    const typedClass = types[type]
    if (!typedClass) {
      console.error('unknown input type:', type)
    }

    const input = new typedClass(this, name, type)
    this.inputs.push(input)
    return input
  }

  /** @param {Number} type */
  allowConnection(type) {
    const types = {
      [Connection.Prev]: this.allowPrev,
      [Connection.Next]: this.allowNext,
      [Connection.Output]: this.allowOutput,
    }

    const typeFn = types[type]
    if (!type) {
      console.warn('this connection type cannot be applied to a block:', type)
      return
    }

    typeFn.bind(this)()
  }

  /** @returns {Block} */
  allowOutput() {
    if (this.hasPrev()) {
      this.previousConnection.delete()
      this.previousConnection = null
    }

    if (this.hasNext()) {
      this.nextConnection.delete()
      this.nextConnection = null
    }

    this.outputConnection = new Connection(Connection.Output, this)
    this.scratch.proximity.addConnection(this.outputConnection)
    return this
  }

  /** @returns {Block} */
  allowPrev() {
    if (this.hasOutput()) {
      this.outputConnection.delete()
      this.outputConnection = null
    }

    this.previousConnection = new Connection(Connection.Prev, this)
    this.scratch.proximity.addConnection(this.previousConnection)
    return this
  }

  /** @returns {Block} */
  allowNext() {
    if (this.hasOutput()) {
      this.outputConnection.delete()
      this.outputConnection = null
    }

    this.nextConnection = new Connection(Connection.Next, this)
    this.scratch.proximity.addConnection(this.nextConnection)
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

  /** @returns {Block} */
  setCompiler(compiler) {
    this.compiler = compiler
  }

  toJSON() {
    return {
      id: this.id,
      type: this.type,

      x: this.x,
      y: this.y,

      inputs: this.inputs.map((i) => i.toJSON()),
      outputConnection: this.outputConnection?.toJSON(),
      previousConnection: this.previousConnection?.toJSON(),
      nextConnection: this.nextConnection?.toJSON(),
    }
  }
}
