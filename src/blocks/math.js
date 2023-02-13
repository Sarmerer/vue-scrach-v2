import { createModule } from '.'
import { BlockField, BlockInput } from '../types/block-input'
import { Connection } from '../types/connection'

export default createModule({
  name: 'math',

  style: {
    background: 'SkyBlue',
  },

  blocks: [
    {
      name: 'operation',
      inline: true,
      connections: [Connection.Output],
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

      compile: ['${input.left_side} ${operator} ${input.right_side}'],
    },

    {
      name: 'number',
      connections: [Connection.Output],
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

      compile: ['${value}'],
    },
  ],
})
