import { DOMElement } from './dom-element'
import { Block } from './block'
import { uuidv4 } from '../utils'

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
  constructor(type, options = null) {
    this.type = type

    options = Object.assign(
      { value: null, label: null, placeholder: null, options: [] },
      options
    )
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
   * @param {'Value' | 'Dummy' | 'Statement'} type
   */
  constructor(block, type) {
    const id = uuidv4()
    super(id)

    this.id = id
    this.block = block
    this.type = type
    this.fields = []

    this.align = BlockInput.Alignment.Left

    this.index = block.inputs.length
    this.group = 0

    const prev = this.getPrev()
    if (prev) {
      this.group = prev.group
    }
  }

  /** @param {String} label */
  addLabelField(label) {
    this.fields.push(new BlockField('LabelField', { label }))
    return this
  }

  /** @param {BlockFieldOptions} options */
  addTextField(options) {
    this.fields.push(new BlockField('TextField', options))
    return this
  }

  /** @param {BlockFieldOptions} options */
  addNumberField(options) {
    this.fields.push(new BlockField('NumberField', options))
    return this
  }

  /** @param {BlockFieldOptions} options */
  addSelectField(options) {
    this.fields.push(new BlockField('SelectField', options))
    return this
  }

  /** @param {Number} align */
  setAlign(align) {
    this.align = align
    return this
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
}

export class BlockValueInput extends BlockInput {
  /** @param {Block} block */
  constructor(block) {
    super(block, 'Value')
  }
}

export class BlockStatementInput extends BlockInput {
  /** @param {Block} block */
  constructor(block) {
    super(block, 'Statement')
    this.group++
  }
}

export class BlockDummyInput extends BlockInput {
  /** @param {Block} block */
  constructor(block) {
    super(block, 'Dummy')
  }
}
