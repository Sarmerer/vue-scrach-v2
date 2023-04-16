import { defineBlocks } from '.'
import { BlockInput, BlockField } from './types'

export default defineBlocks(
  {
    prefix: 'functions',
    style: { background: 'green' },
  },

  [
    {
      type: 'with-return',
      inputs: [
        {
          type: BlockInput.Dummy,
          fields: [
            {
              type: BlockField.Text,
              name: 'name',
              value: 'add',
            },
          ],
        },
        {
          type: BlockInput.Statement,
          name: 'body',
        },
        {
          type: BlockInput.Value,
          name: 'returns',
          fields: [{ type: BlockField.Label, value: 'return' }],
        },
      ],

      compiler: [
        'function ${name} () {',
        '${input.body}',
        'return ${input.returns}',
        '}',
      ],
    },

    {
      type: 'without-return',
      inputs: [
        {
          type: BlockInput.Dummy,
          fields: [
            {
              type: BlockField.Text,
              name: 'name',
              value: 'add',
            },
          ],
        },
        {
          type: BlockInput.Statement,
          name: 'body',
        },
      ],

      compiler: ['function ${name} () {', '${input.body}', '}'],
    },
  ]
)
