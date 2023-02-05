import { Block } from '../../types/block'
import { BlockInput } from '../../types/block-input'

import TextField from '../block-fields/Text.vue'

export const props = {
  block: { type: Block, required: true },
  input: { type: BlockInput, required: true },
}

export const components = { TextField }

export const computed = {
  scratch() {
    return this.block.scratch
  },

  fields() {
    return this.input.fields
  },

  nextInput() {
    if (this.index >= this.block.inputs.length) {
      return null
    }

    return this.block.inputs[this.index + 1]
  },

  style() {
    return {
      backgroundColor: this.block.colors.background,
      color: this.block.colors.text,
    }
  },
}

export const methods = {
  nextInputIs(type) {
    return this.input.getNext()?.type == type
  },

  prevInputIs(type) {
    return this.input.getPrev()?.type == type
  },
}

export default { props, components, computed, methods }
