import { defineBlocks } from '..'
import { BlockInput, BlockField } from '../types'

export const style = { background: '#6B5B95', text: 'white' }

export const blocks = defineBlocks(
  {
    prefix: 'fields',
    style,
  },

  [
    {
      type: 'label',
      previous: true,
      next: true,
      inputs: [
        {
          type: BlockInput.Dummy,
          fields: [
            { type: BlockField.Label, value: 'label' },
            { type: BlockField.Text, name: 'value', value: 'text' },
          ],
        },
      ],

      compiler(context) {
        return {
          type: BlockField.Label,
          value: context.getField('value'),
        }
      },
    },

    {
      type: 'text',
      previous: true,
      next: true,
      inputs: [
        {
          type: BlockInput.Dummy,
          fields: [
            { type: BlockField.Label, value: 'text input' },
            { type: BlockField.Text, name: 'value', value: 'value' },
            {
              type: BlockField.Text,
              name: 'placeholder',
              placeholder: 'placeholder',
            },
          ],
        },
      ],

      compiler(context) {
        return {
          type: BlockField.Text,
          value: context.getField('value'),
          placeholder: context.getField('placeholder'),
        }
      },
    },

    {
      type: 'number',
      previous: true,
      next: true,
      inputs: [
        {
          type: BlockInput.Dummy,
          fields: [
            { type: BlockField.Label, value: 'number input' },
            { type: BlockField.Text, name: 'value', value: 0 },
          ],
        },
      ],

      compiler(context) {
        return {
          type: BlockField.Text,
          value: context.getField('value'),
          placeholder: context.getField('placeholder'),
        }
      },
    },
  ]
)

export default { blocks, style }
