import { defineBlocks } from '.'
import { BlockInput, BlockField } from './types'

export default defineBlocks(
  {
    prefix: 'sql',
    style: { background: 'cadetblue', text: 'white' },
  },

  [
    {
      type: 'insert',
      previous: true,
      next: true,
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

      compiler: ['INSERT', '${inputs.rows}', 'INTO ${fields.table}'],
    },

    {
      type: 'update',
      previous: true,
      next: true,
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

      compiler: [
        'UPDATE',
        '${inputs.rows}',
        'WITH',
        '${inputs.with}',
        'IN ${fields.table}',
      ],
    },

    {
      type: 'row',
      previous: true,
      next: true,
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

      compiler: ['${fields.row}'],
    },

    {
      type: 'value',
      previous: true,
      next: true,
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

      compiler: ['${fields.value}'],
    },

    {
      type: 'row-value',
      previous: true,
      next: true,
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

      compiler: ['${fields.row}: ${fields.value}'],
    },
  ]
)
