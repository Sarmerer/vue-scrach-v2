import { createModule } from '.'
import { BlockInput, BlockField, Connection } from './types'

export default createModule({
  name: 'lists',

  style: {
    background: 'brown',
  },

  blocks: [
    {
      name: 'new',
      connections: [Connection.Output],
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

      compile(context) {
        const items = Object.values(context.input).join(', ')
        return [`[${items}]`]
      },
    },
  ],
})
