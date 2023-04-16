import { defineBlocks } from '.'
import { BlockInput, BlockField } from './types'

export default defineBlocks(
  {
    prefix: 'logic',
    style: { background: 'aquamarine', text: 'black' },
  },

  [
    {
      type: 'if',
      previous: true,
      next: true,
      inputs: [
        {
          type: BlockInput.Value,

          name: 'if',
          fields: [{ type: BlockField.Label, value: 'if' }],
        },
        {
          type: BlockInput.Statement,
          name: 'do',
        },
      ],

      compiler: ['if (${input.if}) {', '${do}', '}'],
    },

    {
      type: 'compare',
      inline: true,
      output: true,
      inputs: [
        { type: BlockInput.Value, name: 'left_side' },
        {
          type: BlockInput.Dummy,
          fields: [
            {
              type: BlockField.Select,
              name: 'operator',
              value: '==',
              options: ['==', '!=', '<', '<=', '>', '>='],
            },
          ],
        },
        { type: BlockInput.Value, name: 'right_side' },
      ],

      compiler: ['${input.left_side} ${operator} ${input.right_side}'],
    },

    {
      type: 'operator',
      inline: true,
      output: true,
      inputs: [
        { type: BlockInput.Value, name: 'left_side' },
        {
          type: BlockInput.Dummy,
          fields: [
            {
              type: BlockField.Select,
              name: 'operator',
              value: 'and',
              options: ['and', 'or'],
            },
          ],
        },
        { type: BlockInput.Value, name: 'right_side' },
      ],

      compiler: ['${input.left_side} ${operator} ${input.right_side}'],
    },

    {
      type: 'bool',
      inline: true,
      output: true,
      inputs: [
        {
          type: BlockInput.Dummy,
          fields: [
            {
              type: BlockField.Select,
              name: 'bool',
              value: 'true',
              options: ['true', 'false'],
            },
          ],
        },
      ],

      compiler: ['${bool}'],
    },
  ]
)
