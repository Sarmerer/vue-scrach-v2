import { defineBlocks } from '..'
import { blockPlaceholder } from '../helpers/block-placeholder'
import { BlockField, BlockInput } from '../types'
import { tablesProvider } from './helpers'

export const style = { background: '#5297fe', text: 'white' }

const blockPlaceholderDefinition = {
  type: 'fields_placeholder',
  previous: true,
  next: true,
  inputs: [
    {
      type: BlockInput.Dummy,
      fields: [{ type: BlockField.Label, value: 'Fields' }],
    },
  ],
}

export const blocks = defineBlocks(
  {
    prefix: 'queries',
    style,
  },
  [
    {
      type: 'insert',
      inputs: [
        {
          type: BlockInput.Dummy,
          fields: [{ type: BlockField.Label, value: 'Insert' }],
        },
        { name: 'fields', type: BlockInput.Statement },
        {
          type: BlockInput.Dummy,
          fields: [
            { type: BlockField.Label, value: 'Into' },
            {
              type: BlockField.Select,
              name: 'table',
              value: 'addresses',
              options: tablesProvider,
            },
          ],
        },
      ],

      compiler(context) {
        const rows = (context.inputs.fields || '').split('\n')
        const table = context.getField('table') || ''

        return ['INSERT {', rows.join(',\n'), '}', `INTO ${table}`]
      },
    },

    {
      type: 'update',
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
              options: tablesProvider,
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
      type: 'search',
      previous: true,
      next: true,
      inputs: [
        {
          type: BlockInput.Dummy,
          fields: [{ type: BlockField.Label, value: 'SEARCH' }],
        },
        {
          type: BlockInput.Statement,
          name: 'fields',
        },
      ],

      compiler: ['SEARCH ${inputs.fields}'],
    },

    {
      type: 'keep',
      previous: true,
      next: true,
      inputs: [
        {
          type: BlockInput.Value,
          name: 'in',
          fields: [{ type: BlockField.Label, value: 'KEEP' }],
        },
        {
          type: BlockInput.Statement,
          name: 'fields',
        },
      ],

      compiler: ['KEEP(${inputs.in},', '${inputs.fields}', ')'],
    },

    {
      type: 'analyzer',
      previous: true,
      next: true,
      inputs: [
        {
          type: BlockInput.Dummy,
          fields: [{ type: BlockField.Label, value: 'ANALYZER' }],
        },
        {
          type: BlockInput.Value,
          name: 'field0',
        },
      ],

      compiler: ['ANALYZER(', '${inputs.fields}', ')'],
    },
  ]
)

export default { blocks, style }
