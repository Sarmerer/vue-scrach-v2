import { defineBlocks } from '..'
import { BlockInput, BlockField } from '../types'

export default defineBlocks(
  {
    prefix: 'fields',

    style: {
      background: 'darkgreen',
    },
  },

  [
    {
      type: 'field:label',
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
          value: context.value,
        }
      },
    },

    {
      type: 'field:text',
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
          type: BlockField.Label,
          value: context.value,
          placeholder: context.placeholder,
        }
      },
    },
  ]
)
