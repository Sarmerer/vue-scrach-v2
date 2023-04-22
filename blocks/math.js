import { defineBlocks } from '.'
import { BlockInput, BlockField } from './types'

export default defineBlocks(
  {
    prefix: 'math',
    style: { background: 'skyblue' },
  },

  [
    {
      type: 'operation',
      inline: true,
      output: true,
      inputs: [
        { type: BlockInput.Value, name: 'left_side' },
        {
          type: BlockInput.Dummy,
          name: 'operator',
          fields: [
            {
              type: BlockField.Select,
              name: 'operator',
              value: '+',
              options: ['+', '-', '*', '/', '%'],
            },
          ],
        },
        { type: BlockInput.Value, name: 'right_side' },
      ],

      compiler: ['${inputs.left_side} ${fields.operator} ${inputs.right_side}'],
    },

    {
      type: 'number',
      output: true,
      inputs: [
        {
          type: BlockInput.Dummy,
          fields: [
            {
              type: BlockField.Number,
              name: 'value',
              value: 0,
            },
          ],
        },
      ],

      compiler: ['${fields.value}'],
    },
  ]
)
