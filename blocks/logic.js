import { createModule } from '.'
import { BlockInput, BlockField, Connection } from './types'

export default createModule({
  name: 'logic',

  style: {
    background: 'Aquamarine',
    text: 'black',
  },

  blocks: [
    {
      name: 'if',
      connections: [Connection.Prev, Connection.Next],
      inputs: [
        {
          type: BlockInput.Value,

          name: 'if',
          fields: [{ type: BlockField.Label, value: 'if' }],
        },
        {
          type: BlockInput.Statement,
          name: 'do',
        },
      ],

      compile: ['if (${input.if}) {', '${do}', '}'],
    },

    {
      name: 'compare',
      inline: true,
      connections: [Connection.Output],
      inputs: [
        { type: BlockInput.Value, name: 'left_side' },
        {
          type: BlockInput.Dummy,
          fields: [
            {
              type: BlockField.Select,
              name: 'operator',
              value: '==',
              options: ['==', '!=', '<', '<=', '>', '>='],
            },
          ],
        },
        { type: BlockInput.Value, name: 'right_side' },
      ],

      compile: ['${input.left_side} ${operator} ${input.right_side}'],
    },

    {
      name: 'operator',
      inline: true,
      connections: [Connection.Output],
      inputs: [
        { type: BlockInput.Value, name: 'left_side' },
        {
          type: BlockInput.Dummy,
          fields: [
            {
              type: BlockField.Select,
              name: 'operator',
              value: 'and',
              options: ['and', 'or'],
            },
          ],
        },
        { type: BlockInput.Value, name: 'right_side' },
      ],

      compile: ['${input.left_side} ${operator} ${input.right_side}'],
    },

    {
      name: 'bool',
      inline: true,
      connections: [Connection.Output],
      inputs: [
        {
          type: BlockInput.Dummy,
          fields: [
            {
              type: BlockField.Select,
              name: 'bool',
              value: 'true',
              options: ['true', 'false'],
            },
          ],
        },
      ],

      compile: ['${bool}'],
    },
  ],
})
