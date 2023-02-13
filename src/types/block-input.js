import { DOMElement } from './dom-element'
import { Block } from './block'
import { uuidv4 } from '../utils'
import { Connection } from './connection'

/**
 * @typedef {Object} BlockFieldOptions
 * @property {any} BlockFieldOptions.value
 * @property {String} BlockFieldOptions.placeholder
 * @property {Array<String>} BlockFieldOptions.options
 */

export class BlockField {
  static Text = 1
  static Label = 2
  static Select = 3
  static Number = 4

  /**
   * @param {String} type
   * @param {BlockFieldOptions} options
   */
  constructor(name, type, options = null) {
    this.type = type

    options = Object.assign(
      { value: null, placeholder: null, options: [] },
      options
    )
    this.name = name
    this.value = options.value
    this.placeholder = options.placeholder

    this.optionsUpdater = null
    if (typeof options.options == 'function') {
      this.optionsUpdater = options.options.bind(this)
      this.updateOptions()
    } else {
      this.options = options.options
    }
  }

  updateOptions() {
    if (typeof this.optionsUpdater !== 'function') return

    this.options = this.optionsUpdater()
  }
}

export class BlockInput extends DOMElement {
  static Dummy = 1
  static Value = 2
  static Statement = 3

  static Alignment = {
    Right: 1,
    Left: 2,
    Center: 3,
  }

  /**
   * @param {Block} block
   * @param {String} name
   * @param {Number} type
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

  /**
   *
   * @param {Number} type
   * @param {String} name
   * @param {BlockFieldOptions} options
   */
  addField(type, name = null, options = null) {
    const types = [
      BlockField.Label,
      BlockField.Text,
      BlockField.Number,
      BlockField.Select,
    ]

    if (!types.includes(type)) {
      console.error('unknown block field type:', type)
      return
    }

    this.fields.push(new BlockField(name, type, options))
    return this
  }

  /** @param {BlockFieldOptions} options */
  addLabelField(options) {
    this.addField(BlockField.Label, options)
    return this
  }

  /**
   * @param {String} name
   * @param {BlockFieldOptions} options
   */
  addTextField(name, options) {
    this.addField(BlockField.Text, options)
    return this
  }

  /**
   * @param {String} name
   * @param {BlockFieldOptions} options
   */
  addNumberField(name, options) {
    this.addField(BlockField.Number, options)
    return this
  }

  /**
   * @param {String} name
   * @param {BlockFieldOptions} options
   */
  addSelectField(name, options) {
    this.addField(BlockField.Select, options)
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
    super(block, name, BlockInput.Value)
    this.connection = new Connection(Connection.Input, block, this)
  }
}

export class BlockStatementInput extends BlockInput {
  /**
   * @param {Block} block
   * @param {String} name
   */
  constructor(block, name) {
    super(block, name, BlockInput.Statement)
    this.connection = new Connection(Connection.Statement, block, this)
    this.group++
  }
}

export class BlockDummyInput extends BlockInput {
  /** @param {Block} block */
  constructor(block) {
    super(block, null, BlockDummyInput.Dummy)
  }
}
