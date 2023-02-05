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
  }

  addTextField(label) {
    this.fields.push(new BlockField('TextField', label))
    return this
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
  }
}

export class BlockDummyInput extends BlockInput {
  constructor(block) {
    super(block, 'Dummy')
  }
}
