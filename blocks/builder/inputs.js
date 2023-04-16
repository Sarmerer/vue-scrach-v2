import { defineBlocks } from '..'
import { BlockInput, BlockField } from '../types'

export default defineBlocks(
  {
    prefix: 'inputs',
    style: { background: 'darkgreen' },
  },

  [
    {
      type: 'input:value',
      previous: true,
      next: true,
      inputs: [
        {
          type: BlockInput.Dummy,
          fields: [
            { type: BlockField.Label, value: 'value input' },
            { type: BlockField.Text, name: 'name', value: 'name' },
          ],
        },
        {
          type: BlockInput.Statement,
          name: 'fields',
        },
      ],

      compiler(context) {
        const fields = []

        return {
          type: BlockInput.Value,
          name: context.name,
          fields: context.input.fields || [],
        }
      },
    },

    {
      type: 'input:statement',
      previous: true,
      next: true,
      inputs: [
        {
          type: BlockInput.Dummy,
          fields: [
            { type: BlockField.Label, value: 'statement input' },
            { type: BlockField.Text, name: 'name', value: 'name' },
          ],
        },
        {
          type: BlockInput.Statement,
          name: 'fields',
        },
      ],

      compiler(context) {
        const fields = []

        return {
          type: BlockInput.Statement,
          name: context.name,
          fields: context.input.fields || [],
        }
      },
    },

    {
      type: 'input:dummy',
      previous: true,
      next: true,
      inputs: [
        {
          type: BlockInput.Dummy,
          fields: [{ type: BlockField.Label, value: 'dummy input' }],
        },
        {
          type: BlockInput.Statement,
          name: 'fields',
        },
      ],

      compiler(context) {
        return {
          type: BlockInput.Dummy,
          fields: context.input.fields || [],
        }
      },
    },
  ]
)
