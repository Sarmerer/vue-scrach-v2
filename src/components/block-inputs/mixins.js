import { Block } from '../../types/block'
import { BlockInput } from '../../types/block-input'

import TextField from '../block-fields/Text.vue'

export const props = {
  block: { type: Block, required: true },
  input: { type: BlockInput, required: true },
  index: Number,
}

export const components = { TextField }

export const computed = {
  scratch() {
    return this.block.scratch
  },

  fields() {
    return this.input.fields
  },

  isFirstInput() {
    return this.index == 0
  },

  isLastInput() {
    return this.index == this.block.inputs.length - 1
  },

  prevInput() {
    if (this.index == 0) {
      return null
    }

    return this.block.inputs[this.index - 1]
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
    return this.nextInput?.type == type
  },

  prevInputIs(type) {
    return this.prevInput?.type == type
  },
}

export default { props, components, computed, methods }
