import { defineBlocks } from '.'
import { BlockInput, BlockField } from './types'

export default defineBlocks(
  {
    prefix: 'strings',
    style: { background: 'LightSeaGreen' },
  },

  [
    {
      type: 'print',
      previous: true,
      next: true,
      inputs: [
        {
          type: BlockInput.Value,
          name: 'text',
          fields: [{ type: BlockField.Label, value: 'print' }],
        },
      ],

      compiler: ['console.log(${input.text})'],
    },

    {
      type: 'string',
      output: true,
      inputs: [
        {
          type: BlockInput.Dummy,
          fields: [
            {
              type: BlockField.Text,
              name: 'value',
              value: '',
            },
          ],
        },
      ],

      compiler: ['"${value}"'],
    },
  ]
)
