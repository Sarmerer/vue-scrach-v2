import { createModule } from '.'
import { BlockInput } from '../types/block-input'
import { BlockField } from '../types/block-field'
import { Connection } from '../types/connection'

export default createModule({
  name: 'loops',

  style: { background: 'Orange', text: 'black' },

  blocks: [
    {
      name: 'repeat',
      inline: true,
      connections: [Connection.Prev, Connection.Next],
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

      compile(context) {
        const count = context.input.count || 10
        const body = context.input.body || ''
        return [`for (let i = 0; i < ${count}; i++) {`, body, '}']
      },
    },

    {
      name: 'foreach',
      connections: [Connection.Prev, Connection.Next],
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

      compile(context) {
        const item = context.item?.name || 'i'
        const list = context.input.list || []
        const body = context.input.body || ''

        return [`for (var ${item} in ${list}) {}`, body, '}']
      },
    },
  ],
})
