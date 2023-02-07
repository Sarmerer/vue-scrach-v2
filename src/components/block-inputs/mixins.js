import { Block } from '../../types/block'
import { BlockInput } from '../../types/block-input'

import TextField from '../block-fields/Text.vue'
import LabelField from '../block-fields/Label.vue'
import NumberField from '../block-fields/Number.vue'
import SelectField from '../block-fields/Select.vue'

export const props = {
  block: { type: Block, required: true },
  input: { type: BlockInput, required: true },
}

export const components = {
  TextField,
  LabelField,
  NumberField,
  SelectField,
}

export function data() {
  this.Block = Block
  return {}
}

export const computed = {
  scratch() {
    return this.block.scratch
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

export const methods = {
  nextInputIs(type) {
    return this.input.getNext()?.type == type
  },

  prevInputIs(type) {
    return this.input.getPrev()?.type == type
  },
}

export default { props, components, data, computed, methods }
