import { uuidv4 } from '../utils'

export class BlockField {
  constructor(type, label = '') {
    this.type = type
    this.value = null
    this.label = label
  }
}

export class BlockInput {
  constructor(block, type) {
    this.id = uuidv4()
    this.block = block
    this.type = type
    this.fields = []

    this.index = block.inputs.length
    this.group = 0

    const prev = this.getPrev()
    if (prev) {
      this.group = prev.group
    }
  }

  addTextField(label) {
    this.fields.push(new BlockField('TextField', label))
    return this
  }

  isFirst() {
    return this.index == 0
  }

  isLast() {
    return this.index >= this.block.inputs.length - 1
  }

  getPrev() {
    if (this.isFirst()) return null
    return this.block.inputs[this.index - 1]
  }

  getNext() {
    if (this.isLast()) return null
    return this.block.inputs[this.index + 1]
  }
}

export class BlockValueInput extends BlockInput {
  constructor(block) {
    super(block, 'Value')
  }
}

export class BlockStatementInput extends BlockInput {
  constructor(block) {
    super(block, 'Statement')
    this.group++
  }
}

export class BlockDummyInput extends BlockInput {
  constructor(block) {
    super(block, 'Dummy')
  }
}
