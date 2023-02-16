import { createModule } from '..'
import { BlockInput } from '../../types/block-input'
import { BlockField } from '../../types/block-field'
import { Connection } from '../../types/connection'

export default createModule({
  name: 'base',

  style: {
    background: 'darkgreen',
  },

  blocks: [
    {
      name: 'block',
      inputs: [
        {
          type: BlockInput.Dummy,
          fields: [
            { type: BlockField.Label, value: 'name' },
            { type: BlockField.Text, name: 'name', value: 'block_name' },
          ],
        },
        {
          type: BlockInput.Statement,
          name: 'inputs',
        },
        {
          type: BlockInput.Dummy,
          fields: [
            {
              type: BlockField.Select,
              name: 'display',
              value: 'block',
              options: ['block', 'inline'],
            },
            { type: BlockField.Label, value: 'inputs' },
          ],
        },
        {
          type: BlockInput.Dummy,
          fields: [
            {
              type: BlockField.Select,
              name: 'connections',
              placeholder: "can't connect",
              options: ['has output', 'has prev', 'has next', 'has prev+next'],
            },
          ],
        },
        {
          type: BlockInput.Dummy,
          fields: [
            { type: BlockField.Label, value: 'background color' },
            { type: BlockField.Text, name: 'background_color', value: 'red' },
          ],
        },
        {
          type: BlockInput.Dummy,
          fields: [
            { type: BlockField.Label, value: 'text color' },
            { type: BlockField.Text, name: 'text_color', value: 'white' },
          ],
        },
      ],

      compile(context) {
        const connections = {
          'has output': [Connection.Output],
          'has prev': [Connection.Prev],
          'has next': [Connection.Next],
          'has prev+next': [Connection.Prev, Connection.Next],
        }

        return {
          name: context.name,
          inline: context.display == 'inline',
          connections: connections[context.connections],
          inputs: context.input.inputs || [],
          style: {
            background: context.background_color,
            text: context.text_color,
          },
        }
      },
    },
  ],
})
