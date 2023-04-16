import { defineBlocks } from '.'
import { BlockInput, BlockField } from './types'

export default defineBlocks(
  {
    prefix: 'lists',
    style: { background: 'brown' },
  },

  [
    {
      type: 'new',
      output: true,
      inputs: [
        {
          type: BlockInput.Value,
          name: 'item0',
          fields: [
            {
              type: BlockField.Label,
              value: 'create list with',
            },
          ],
        },
        {
          type: BlockInput.Value,
          name: 'item1',
        },
        {
          type: BlockInput.Value,
          name: 'item2',
        },
      ],

      compiler(context) {
        const items = Object.values(context.input).join(', ')
        return [`[${items}]`]
      },
    },
  ]
)
