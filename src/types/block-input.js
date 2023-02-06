import { DOMElement } from './dom-element'
import { Block } from './block'
import { uuidv4 } from '../utils'

export class BlockField {
  /**
   * @param {'TextField'} type
   * @param {String} label
   */
  constructor(type, label = '') {
    this.type = type
    this.value = null
    this.label = label
  }
}

export class BlockInput extends DOMElement {
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
    this.proximateBlock = null

    this.index = block.inputs.length
    this.group = 0

    const prev = this.getPrev()
    if (prev) {
      this.group = prev.group
    }
  }

  /**
   * @param {String} label
   * @returns {BlockInput}
   */
  addTextField(label) {
    this.fields.push(new BlockField('TextField', label))
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
