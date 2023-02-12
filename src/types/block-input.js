import { DOMElement } from './dom-element'
import { Block } from './block'
import { uuidv4 } from '../utils'
import { Connection } from './connection'

/**
 * @typedef {Object} BlockFieldOptions
 * @property {any} BlockFieldOptions.value
 * @property {String} BlockFieldOptions.label
 * @property {String} BlockFieldOptions.placeholder
 * @property {Array<String>} BlockFieldOptions.options
 */

export class BlockField {
  /**
   * @param {String} type
   * @param {BlockFieldOptions} options
   */
  constructor(name, type, options = null) {
    this.type = type

    options = Object.assign(
      { value: null, label: null, placeholder: null, options: [] },
      options
    )
    this.name = name
    this.value = options.value
    this.label = options.label
    this.options = options.options
    this.placeholder = options.placeholder
  }
}

export class BlockInput extends DOMElement {
  static Alignment = {
    Right: 1,
    Left: 2,
    Center: 3,
  }

  /**
   * @param {Block} block
   * @param {String} name
   * @param {'Value' | 'Dummy' | 'Statement'} type
   */
  constructor(block, name, type) {
    const id = uuidv4()
    super(id)

    this.id = id
    this.name = name
    this.block = block
    this.type = type
    this.fields = []

    this.connection = null
    this.align = BlockInput.Alignment.Left

    this.index = block.inputs.length
    this.group = 0

    const prev = this.getPrev()
    if (prev) {
      this.group = prev.group
    }
  }

  /** @returns {Boolean} */
  hasValue() {
    return this.connection !== null
  }

  /** @returns {Boolean} */
  isFirst() {
    return this.index == 0
  }

  /** @returns {Boolean} */
  isLast() {
    return this.index >= this.block.inputs.length - 1
  }

  /** @returns {BlockInput | null} */
  getPrev() {
    if (this.isFirst()) return null
    return this.block.inputs[this.index - 1]
  }

  /** @returns {BlockInput | null} */
  getNext() {
    if (this.isLast()) return null
    return this.block.inputs[this.index + 1]
  }

  /** @param {String} label */
  addLabelField(label = '') {
    this.fields.push(new BlockField(null, 'LabelField', { label }))
    return this
  }

  /**
   * @param {String} name
   * @param {BlockFieldOptions} options
   */
  addTextField(name, options) {
    this.fields.push(new BlockField(name, 'TextField', options))
    return this
  }

  /**
   * @param {String} name
   * @param {BlockFieldOptions} options
   */
  addNumberField(name, options) {
    this.fields.push(new BlockField(name, 'NumberField', options))
    return this
  }

  /**
   * @param {String} name
   * @param {BlockFieldOptions} options
   */
  addSelectField(name, options) {
    this.fields.push(new BlockField(name, 'SelectField', options))
    return this
  }

  /** @param {Number} align */
  setAlign(align) {
    this.align = align
    return this
  }
}

export class BlockValueInput extends BlockInput {
  /**
   * @param {Block} block
   * @param {String} name
   */
  constructor(block, name) {
    super(block, name, 'Value')
    this.connection = new Connection(Connection.Input, block, this)
  }
}

export class BlockStatementInput extends BlockInput {
  /**
   * @param {Block} block
   * @param {String} name
   */
  constructor(block, name) {
    super(block, name, 'Statement')
    this.connection = new Connection(Connection.Statement, block, this)
    this.group++
  }
}

export class BlockDummyInput extends BlockInput {
  /** @param {Block} block */
  constructor(block, name) {
    super(block, null, 'Dummy')
  }
}
