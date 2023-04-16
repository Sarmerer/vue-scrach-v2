import { defineBlocks } from '.'
import { BlockInput, BlockField } from './types'

export default defineBlocks(
  {
    prefix: 'loops',
    style: { background: 'orange', text: 'black' },
  },

  [
    {
      type: 'repeat',
      inline: true,
      previous: true,
      next: true,
      inputs: [
        {
          type: BlockInput.Value,
          name: 'count',
          fields: [{ type: BlockField.Label, value: 'repeat' }],
        },
        {
          type: BlockInput.Statement,
          name: 'body',
        },
      ],

      compiler(context) {
        const count = context.input.count || 10
        const body = context.input.body || ''
        return [`for (let i = 0; i < ${count}; i++) {`, body, '}']
      },
    },

    {
      type: 'foreach',
      previous: true,
      next: true,
      inputs: [
        {
          type: BlockInput.Value,
          name: 'list',
          fields: [
            { type: BlockField.Label, value: 'for each' },
            { type: BlockField.Variable, name: 'item' },
            { type: BlockField.Label, value: 'in' },
          ],
        },
        {
          type: BlockInput.Statement,
          name: 'body',
        },
      ],

      compiler(context) {
        const item = context.item?.name || 'i'
        const list = context.input.list || '[]'
        const body = context.input.body || ''

        return [`for (var ${item} in ${list}) {`, body, '}']
      },
    },

    {
      type: 'lifecycle',
      previous: true,
      inputs: [
        {
          type: BlockInput.Dummy,
          fields: [
            {
              type: BlockField.Select,
              name: 'action',
              value: 'break',
              options: ['break', 'continue'],
            },
          ],
        },
      ],

      compiler: ['${action}'],
    },
  ]
)
