import { createModule } from '.'
import { BlockField, BlockInput } from '../types/block-input'
import { Connection } from '../types/connection'

export default createModule({
  name: 'loop',

  blocks: [
    {
      name: 'repeat',
      connections: [Connection.Prev, Connection.Next],
      inputs: [
        {
          type: BlockInput.Dummy,
          fields: [
            { type: BlockField.Label, value: 'repeat' },
            { type: BlockField.Number, value: 10, name: 'count' },
          ],
        },
        {
          type: BlockInput.Statement,
          name: 'body',
        },
      ],

      compile: ['for (let i = 0; i < ${count}; i++) {', '${input.body}', '}'],
    },
  ],
})
