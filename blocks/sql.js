import { createModule } from '.'
import { BlockInput, BlockField, Connection } from './types'

export default createModule({
  name: 'sql',

  style: {
    background: 'cadetblue',
    text: 'white',
  },

  blocks: [
    {
      name: 'insert',
      connections: [Connection.Prev, Connection.Next],
      inputs: [
        {
          type: BlockInput.Dummy,
          fields: [{ type: BlockField.Label, value: 'INSERT' }],
        },
        {
          name: 'rows',
          type: BlockInput.Statement,
        },
        {
          type: BlockInput.Dummy,
          fields: [
            { type: BlockField.Label, value: 'INTO' },
            {
              type: BlockField.Select,
              name: 'table',
              value: 'addresses',
              options: ['addresses', 'users'],
            },
          ],
        },
      ],

      compile: ['INSERT', '${input.rows}', 'INTO ${table}'],
    },

    {
      name: 'update',
      connections: [Connection.Prev, Connection.Next],
      inputs: [
        {
          type: BlockInput.Dummy,
          fields: [{ type: BlockField.Label, value: 'UPDATE' }],
        },
        {
          name: 'rows',
          type: BlockInput.Statement,
        },
        {
          type: BlockInput.Dummy,
          fields: [{ type: BlockField.Label, value: 'WITH' }],
        },
        {
          name: 'with',
          type: BlockInput.Statement,
        },
        {
          type: BlockInput.Dummy,
          fields: [
            { type: BlockField.Label, value: 'IN' },
            {
              type: BlockField.Select,
              name: 'table',
              value: 'addresses',
              options: ['addresses', 'users'],
            },
          ],
        },
      ],

      compile: [
        'UPDATE',
        '${input.rows}',
        'WITH',
        '${input.with}',
        'IN ${table}',
      ],
    },

    {
      name: 'row',
      connections: [Connection.Prev, Connection.Next],
      inputs: [
        {
          type: BlockInput.Dummy,
          fields: [
            {
              type: BlockField.Select,
              name: 'row',
              value: 'firstName',
              options: ['firstName', 'lastName', 'email'],
            },
          ],
        },
      ],

      compile: ['${row}'],
    },

    {
      name: 'value',
      connections: [Connection.Prev, Connection.Next],
      inputs: [
        {
          type: BlockInput.Dummy,
          fields: [
            {
              type: BlockField.Text,
              name: 'value',
              placeholder: 'John Doe',
            },
          ],
        },
      ],

      compile: ['${value}'],
    },

    {
      name: 'row-value',
      connections: [Connection.Prev, Connection.Next],
      inputs: [
        {
          type: BlockInput.Dummy,
          fields: [
            {
              type: BlockField.Select,
              name: 'row',
              value: 'firstName',
              options: ['firstName', 'lastName', 'email'],
            },
            {
              type: BlockField.Text,
              name: 'value',
              placeholder: 'John Doe',
            },
          ],
        },
      ],

      compile: ['${row}: ${value}'],
    },
  ],
})
