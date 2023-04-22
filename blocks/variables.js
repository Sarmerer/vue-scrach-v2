import { defineBlocks } from '.'
import { BlockInput, BlockField } from './types'

export default defineBlocks(
  {
    prefix: 'variables',
    style: { background: 'coral' },
  },

  [
    {
      type: 'get',
      output: true,
      inputs: [
        {
          type: BlockInput.Dummy,
          fields: [
            {
              type: BlockField.Variable,
              name: 'variable',
            },
          ],
        },
      ],

      compiler: ['${fields.variable.name}'],
    },

    {
      type: 'set',
      previous: true,
      next: true,
      inputs: [
        {
          type: BlockInput.Value,
          name: 'value',
          fields: [
            {
              type: BlockField.Label,
              value: 'set',
            },
            {
              type: BlockField.Variable,
              name: 'variable',
            },
            {
              type: BlockField.Label,
              value: 'to',
            },
          ],
        },
      ],

      compiler: ['${fields.variable.name} = ${inputs.value}'],
    },
  ]
)
