import { defineBlocks } from '..'
import { BlockField, BlockInput } from '../types'

export const style = { background: '#febc37', text: 'white' }

export const blocks = defineBlocks(
  {
    prefix: 'variables',
    style,
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

export default { blocks, style }
