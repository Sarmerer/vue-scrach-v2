import { createModule } from '.'
import { BlockInput } from '../types/block-input'
import { BlockField } from '../types/block-field'
import { Connection } from '../types/connection'

export default createModule({
  name: 'variables',

  style: {
    background: 'coral',
  },

  blocks: [
    {
      name: 'get',
      connections: [Connection.Output],
      inputs: [
        {
          type: BlockInput.Dummy,
          fields: [
            {
              type: BlockField.Variable,
              name: 'variable',
              value: { name: 'i', value: 0 },
            },
          ],
        },
      ],

      compile: ['${variable.name}'],
    },

    {
      name: 'set',
      connections: [Connection.Prev, Connection.Next],
      inputs: [
        {
          type: BlockInput.Value,
          name: 'value',
          fields: [
            {
              type: BlockField.Label,
              value: 'set',
            },
            {
              type: BlockField.Variable,
              name: 'variable',
              value: { name: 'i', value: 0 },
            },
            {
              type: BlockField.Label,
              value: 'to',
            },
          ],
        },
      ],

      compile: ['${variable.name} = ${input.value}'],
    },
  ],
})
