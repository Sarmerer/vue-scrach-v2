import { Block } from '../../types/block'
import { BlockInput } from '../../types/block-input'

export const props = {
  block: { type: Block, required: true },
  input: { type: BlockInput, required: true },
}

export const computed = {
  scratch() {
    return this.block.scratch
  },

  inputBlock() {
    return this.input.connection?.getTargetBlock()
  },

  nextInputIsStatement() {
    return this.input.getNext()?.type == BlockInput.Statement
  },

  style() {
    return {
      backgroundColor: this.block.colors.background,
      color: this.block.colors.text,
    }
  },

  fieldsStyle() {
    const align = {
      [BlockInput.Alignment.Right]: 'flex-end',
      [BlockInput.Alignment.Left]: 'flex-start',
      [BlockInput.Alignment.Center]: 'center',
    }

    return { justifyContent: align[this.input.align] }
  },
}

export default { props, computed }
