import { createModule } from '..'
import { BlockInput, BlockField, Connection } from '../types'

export default createModule({
  name: 'inputs',

  style: {
    background: 'darkgreen',
  },

  blocks: [
    {
      name: 'input:value',
      connections: [Connection.Prev, Connection.Next],
      inputs: [
        {
          type: BlockInput.Dummy,
          fields: [
            { type: BlockField.Label, value: 'value input' },
            { type: BlockField.Text, name: 'name', value: 'name' },
          ],
        },
        {
          type: BlockInput.Statement,
          name: 'fields',
        },
      ],

      compile(context) {
        const fields = []

        return {
          type: BlockInput.Value,
          name: context.name,
          fields: context.input.fields || [],
        }
      },
    },

    {
      name: 'input:statement',
      connections: [Connection.Prev, Connection.Next],
      inputs: [
        {
          type: BlockInput.Dummy,
          fields: [
            { type: BlockField.Label, value: 'statement input' },
            { type: BlockField.Text, name: 'name', value: 'name' },
          ],
        },
        {
          type: BlockInput.Statement,
          name: 'fields',
        },
      ],

      compile(context) {
        const fields = []

        return {
          type: BlockInput.Statement,
          name: context.name,
          fields: context.input.fields || [],
        }
      },
    },

    {
      name: 'input:dummy',
      connections: [Connection.Prev, Connection.Next],
      inputs: [
        {
          type: BlockInput.Dummy,
          fields: [{ type: BlockField.Label, value: 'dummy input' }],
        },
        {
          type: BlockInput.Statement,
          name: 'fields',
        },
      ],

      compile(context) {
        return {
          type: BlockInput.Dummy,
          fields: context.input.fields || [],
        }
      },
    },
  ],
})
