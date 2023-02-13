import { createModule } from '.'
import { BlockField, BlockInput } from '../types/block-input'
import { Connection } from '../types/connection'

export default createModule({
  name: 'function',

  style: {
    background: 'green',
  },

  blocks: [
    {
      name: 'with-return',
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

      compile: [
        'function ${name} () {',
        '${input.body}',
        'return ${input.returns}',
        '}',
      ],
    },

    {
      name: 'without-return',
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

      compile: ['function ${name} () {', '${input.body}', '}'],
    },

    {
      name: 'arg',
      connections: [Connection.Output],
      inputs: [
        {
          type: BlockInput.Value,
          fields: [
            {
              type: BlockField.Text,
              name: 'value',
              value: 'arg',
            },
          ],
        },
      ],

      compile: ['"${value}"'],
    },
  ],
})
