import { createModule } from '..'
import { BlockInput } from '../../types/block-input'
import { BlockField } from '../../types/block-field'
import { Connection } from '../../types/connection'

export default createModule({
  name: 'fields',

  style: {
    background: 'darkgreen',
  },

  blocks: [
    {
      name: 'field:label',
      connections: [Connection.Prev, Connection.Next],
      inputs: [
        {
          type: BlockInput.Dummy,
          fields: [
            { type: BlockField.Label, value: 'label' },
            { type: BlockField.Text, name: 'value', value: 'text' },
          ],
        },
      ],

      compile(context) {
        return {
          type: BlockField.Label,
          value: context.value,
        }
      },
    },

    {
      name: 'field:text',
      connections: [Connection.Prev, Connection.Next],
      inputs: [
        {
          type: BlockInput.Dummy,
          fields: [
            { type: BlockField.Label, value: 'text input' },
            { type: BlockField.Text, name: 'value', value: 'value' },
            {
              type: BlockField.Text,
              name: 'placeholder',
              placeholder: 'placeholder',
            },
          ],
        },
      ],

      compile(context) {
        return {
          type: BlockField.Label,
          value: context.value,
          placeholder: context.placeholder,
        }
      },
    },
  ],
})
