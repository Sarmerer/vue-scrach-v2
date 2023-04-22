import { defineBlocks } from '..'
import { BlockInput, BlockField } from '../types'

export const style = { background: 'teal', text: 'white' }

export const blocks = defineBlocks(
  {
    prefix: 'base',
    style,
  },

  [
    {
      type: 'block',
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
              value: 'stacked',
              options: ['stacked', 'inline'],
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
            { type: BlockField.Text, name: 'background_color', value: 'teal' },
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

      compiler(context) {
        let output = false
        let previous = false
        let next = false
        switch (context.getField('connections')) {
          case 'has output':
            output = true
            break
          case 'has prev':
            previous = true
            break
          case 'has next':
            next = true
            break
          case 'has prev+next':
            previous = true
            next = true
            break
        }

        return {
          type: context.getField('name'),
          inline: context.getField('display') == 'inline',
          previous,
          next,
          output,
          inputs: context.getInput('inputs', []),
          background: context.getField('background_color', 'teal'),
          text: context.getField('text_color', 'white'),
        }
      },
    },
  ]
)

export default { blocks, style }
