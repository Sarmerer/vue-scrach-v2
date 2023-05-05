import { defineBlocks } from '..'
import { BlockField, BlockInput } from '../types'

export const style = { background: '#ff8c8d', text: 'white' }

export const blocks = defineBlocks(
  {
    prefix: 'loops',
    style,
  },

  [
    {
      type: 'loop',
      previous: true,
      next: true,
      inputs: [
        {
          type: BlockInput.Value,
          name: 'item',
          fields: [{ type: BlockField.Label, value: 'FOR' }],
        },
        {
          type: BlockInput.Value,
          name: 'items',
          fields: [{ type: BlockField.Label, value: 'IN' }],
        },
        {
          type: BlockInput.Statement,
          name: 'body',
        },
      ],

      compiler(context) {
        const item = context.getInput('item', '')
        const items = context.getInput('items', '')
        const body = context.getInput('body', '')
        return [`FOR ${item} IN ${items}`, body]
      },
    },

    {
      type: 'return',
      previous: true,
      inputs: [
        {
          type: BlockInput.Value,
          name: 'return',
          fields: [
            {
              type: BlockField.Label,
              value: 'RETURN',
            },
          ],
        },
      ],

      compiler: ['RETURN ${inputs.return}'],
    },

    {
      type: 'return_multiple',
      previous: true,
      inputs: [
        {
          type: BlockInput.Dummy,
          name: 'return',
          fields: [
            {
              type: BlockField.Label,
              value: 'RETURN',
            },
          ],
        },

        {
          type: BlockInput.Statement,
          name: 'return',
        },
      ],

      compiler: ['RETURN ${inputs.return}'],
    },
  ]
)

export default { blocks, style }
