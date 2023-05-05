import { defineBlocks } from '..'
import { BlockField, BlockInput } from '../types'
import { fieldsProvider } from './helpers'

export const style = { background: '#c588e9', text: 'white' }

export const blocks = defineBlocks(
  {
    prefix: 'fields',
    style,
  },

  [
    {
      type: 'row',
      output: true,
      inputs: [
        {
          type: BlockInput.Dummy,
          fields: [
            {
              type: BlockField.Select,
              name: 'row',
              value: 'firstName',
              options: fieldsProvider,
            },
          ],
        },
      ],

      compiler: ['${fields.row}'],
    },

    {
      type: 'value',
      output: true,
      inputs: [
        {
          type: BlockInput.Dummy,
          fields: [
            {
              type: BlockField.Text,
              name: 'string',
              placeholder: 'John Doe',
            },
          ],
        },
      ],

      compiler: ['"${fields.string}"'],
    },

    {
      type: 'row-value',
      output: true,
      inputs: [
        {
          type: BlockInput.Dummy,
          fields: [
            {
              type: BlockField.Select,
              name: 'row',
              value: 'firstName',
              options: fieldsProvider,
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

    {
      type: 'filter',
      output: true,
      inline: true,
      inputs: [
        {
          type: BlockInput.Value,
          name: 'comp_1',
        },
        {
          type: BlockInput.Dummy,
          fields: [
            {
              type: BlockField.Select,
              name: 'operator',
              value: '==',
              options: ['==', '!=', '<', '>', '<=', '>='],
            },
          ],
        },
        {
          type: BlockInput.Value,
          name: 'comp_2',
        },
      ],

      compiler: ['FILTER ${inputs.comp_1} ${fields.operator} ${inputs.comp_2}'],
    },

    {
      type: 'sort',
      output: true,
      inputs: [
        {
          type: BlockInput.Dummy,
          fields: [
            {
              type: BlockField.Label,
              value: 'Sort',
            },
            {
              type: BlockField.Variable,
              name: 'var',
            },
            {
              type: BlockField.Select,
              name: 'sort',
              value: 'asc',
              options: ['asc', 'desc'],
            },
          ],
        },
      ],

      compiler: ['SORT ${fields.var} ${fields.sort}'],
    },

    {
      type: 'and',
      output: true,
      inputs: [
        {
          type: BlockInput.Dummy,
          fields: [
            {
              type: BlockField.Label,
              value: 'AND',
            },
          ],
        },
      ],

      compiler: ['AND'],
    },

    {
      type: 'or',
      output: true,
      inputs: [
        {
          type: BlockInput.Dummy,
          fields: [
            {
              type: BlockField.Label,
              value: 'OR',
            },
          ],
        },
      ],

      compiler: ['OR'],
    },
  ]
)

export default { blocks, style }
