import { BlockField } from '../../../types/block-field'

export const props = {
  field: {
    type: BlockField,
    required: true,
  },
}

export const computed = {
  absolutePosition() {
    return this.field.position
  },

  relativePosition() {
    return this.field.relativePosition
  },
}

export default { props, computed }
