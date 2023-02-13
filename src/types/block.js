import { DOMElement } from './dom-element'
import { Scratch } from './scratch'
import { uuidv4 } from '../utils'
import {
  BlockDummyInput,
  BlockField,
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

    this.compileTemplate = []
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

  /**
   * @param {String} inputName
   * @returns {Object}
   */
  getFieldsValues(inputName = null) {
    let inputs = this.inputs
    if (inputName) {
      const input = this.findInput(inputName)
      if (!input) return {}

      inputs = [input]
    }

    const values = {}
    for (const input of inputs) {
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
      if (!input.connection.isConnected()) continue

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
    this.scratch.generator.compile()
  }

  /**
   * @param {Number} type
   * @param {String} name
   * @returns {BlockInput}
   */
  addInput(type, name = null) {
    const types = {
      [BlockInput.Dummy]: this.addDummyInput,
      [BlockInput.Value]: this.addValueInput,
      [BlockInput.Statement]: this.addStatementInput,
    }

    let typeFn = types[type]
    if (!typeFn) {
      console.warn('unknown block input type:', type)
      return
    }

    return typeFn.bind(this)(name)
  }

  /**
   * @param {String} name
   * @returns {BlockValueInput}
   */
  addValueInput(name) {
    const input = new BlockValueInput(this, name)
    this.scratch.proximity.addConnection(input.connection)
    this.inputs.push(input)
    return input
  }

  /**
   * @param {String} name
   * @returns {BlockStatementInput}
   */
  addStatementInput(name) {
    const input = new BlockStatementInput(this, name)
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

  /** @returns {Block} */
  setCompileTemplate(template) {
    this.compileTemplate = template
  }
}
