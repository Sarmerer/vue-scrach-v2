import { createModule } from '.'
import { BlockInput } from '../types/block-input'
import { BlockField } from '../types/block-field'

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
  ],
})
