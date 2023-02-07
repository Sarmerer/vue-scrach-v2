import { BlockField } from '../../types/block-input'
import DynamicInput from './DynamicInput.vue'

export const props = {
  field: {
    type: BlockField,
    required: true,
  },
}

export const components = { DynamicInput }

export default { props, components }
