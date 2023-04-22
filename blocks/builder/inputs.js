import { defineBlocks } from '..'
import { BlockInput, BlockField } from '../types'

export const style = { background: '#88B04B', text: 'white' }

export const blocks = defineBlocks(
  {
    prefix: 'inputs',
    style,
  },

  [
    {
      type: 'value',
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
        return {
          type: BlockInput.Value,
          name: context.getField('name'),
          fields: context.getInput('fields', []),
        }
      },
    },

    {
      type: 'statement',
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
        return {
          type: BlockInput.Statement,
          name: context.getField('name'),
          fields: context.getInput('fields', []),
        }
      },
    },

    {
      type: 'dummy',
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
          fields: context.getInput('fields', []),
        }
      },
    },
  ]
)

export default { blocks, style }
