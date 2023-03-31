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
import { Point } from './point'

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

    this.initialPosition = new Point(x, y)
    this.relativePosition = new Point(x, y)
    this.position = new Point(x, y)
    this.dragOffset = new Point()
    this.width = 0
    this.height = 0

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
    return !!(
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

  /** @returns {Block | null} */
  getParent() {
    if (this.hasPrev() && this.previousConnection.isConnected()) {
      return this.previousConnection.getTargetBlock()
    } else if (this.hasOutput() && this.outputConnection.isConnected()) {
      return this.outputConnection.getTargetBlock()
    }

    return null
  }

  getAscendants() {
    const blocks = [this]
    let parent = this.getParent()
    while (parent) {
      blocks.push(parent)
      parent = parent.getParent()
    }

    return blocks
  }

  /** @returns {Array<Block>} */
  getDescendants() {
    const blocks = [this]
    for (const child of this.getChildren()) {
      blocks.push(...child.getDescendants())
    }

    return blocks
  }

  /** @returns {Array<Block>} */
  getChildren() {
    const blocks = []
    for (const input of this.inputs) {
      if (!input.connection?.isConnected()) continue

      blocks.push(input.connection.getTargetBlock())
    }

    if (this.hasNext() && this.nextConnection.isConnected()) {
      blocks.push(this.nextConnection.getTargetBlock())
    }

    return blocks
  }

  /** @param {MouseEvent} event */
  dragStart(event) {
    if (this.isDragged || this.isFrozen) return

    event = this.scratch.normalizeMouseEvent(event)

    this.initialPosition.moveTo(this.position.x, this.position.y)
    this.dragOffset
      .moveTo(this.initialPosition.x, this.initialPosition.y)
      .moveBy(-event.clientX, -event.clientY)

    this.isDragged = true
    this.scratch.proximity.activate(this)

    window.addEventListener('mousemove', this.listeners_.drag)
    window.addEventListener('mouseup', this.listeners_.dragEnd, { once: true })
  }

  /** @param {MouseEvent} event */
  drag(event) {
    if (!this.isDragged) return

    event = this.scratch.normalizeMouseEvent(event)

    const delta = new Point(
      event.clientX - this.position.x + this.dragOffset.x,
      event.clientY - this.position.y + this.dragOffset.y
    )

    if (this.isRelative()) {
      const dx = Math.abs(this.initialPosition.x - this.position.x + delta.x)
      const dy = Math.abs(this.initialPosition.y - this.position.y + delta.y)
      if (dx < 30 && dy < 30) return

      this.outputConnection?.disconnect()
      this.previousConnection?.disconnect()
    }

    this.position.moveBy(delta.x, delta.y)
    this.scratch.renderer.update(this, {
      propagateDown: true,
      fast: true,
      delta,
    })
    this.scratch.proximity.update(this)
  }

  dragEnd() {
    if (!this.isDragged) return

    window.removeEventListener('mousemove', this.listeners_.drag)

    this.isDragged = false
    this.scratch.proximity.deactivate(this)
    this.scratch.events.dispatch(Scratch.Events.BLOCK_DRAG, {
      x: this.position.x,
      y: this.position.y,
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

      x: this.position.x,
      y: this.position.y,

      inputs: this.inputs.map((i) => i.toJSON()),
      outputConnection: this.outputConnection?.toJSON(),
      previousConnection: this.previousConnection?.toJSON(),
      nextConnection: this.nextConnection?.toJSON(),
    }
  }
}
