import { DOMElement } from './dom-element'
import { Block } from './block'
import { uuidv4 } from '../utils'
import { BlockField } from '../types/block-field'
import { Connection } from './connection'

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
    this.width = 0
    this.height = 0

    this.index = block.inputs.length
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
    this.fields.push(new BlockField(name, type, this.block, this, options))
    return this
  }

  /** @param {Number} align */
  setAlign(align) {
    this.align = align
    return this
  }

  toJSON() {
    return {
      id: this.id,
      fields: this.fields.map((f) => f.toJSON()),
      connection: this.connection?.toJSON() || null,
    }
  }

  /**
   * @param {Block} block
   * @param {Number} type
   * @param {String} name
   */
  static Typed(block, type, name = null) {
    const types = {
      [BlockInput.Dummy]: BlockDummyInput,
      [BlockInput.Value]: BlockValueInput,
      [BlockInput.Statement]: BlockStatementInput,
    }

    const typedClass = types[type]
    if (!typedClass) {
      console.error('unknown input type:', type)
      return null
    }

    return new typedClass(block, name)
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
  }
}

export class BlockDummyInput extends BlockInput {
  /** @param {Block} block */
  constructor(block) {
    super(block, null, BlockDummyInput.Dummy)
  }
}
