import { defineBlocks } from '..'
import { BlockField, BlockInput } from '../types'

export const style = { background: '#9aadfd', text: 'white' }

export const blocks = defineBlocks(
  {
    prefix: 'functions',
    style,
  },
  [
    {
      type: 'lower',
      output: true,
      inputs: [
        {
          type: BlockInput.Value,
          name: 'arg',
          fields: [{ type: BlockField.Label, value: 'LOWER' }],
        },
      ],

      compiler: ['LOWER(${inputs.arg})'],
    },

    {
      type: 'to_string',
      output: true,
      inputs: [
        {
          type: BlockInput.Value,
          name: 'arg',
          fields: [{ type: BlockField.Label, value: 'TO_STRING' }],
        },
      ],

      compiler: ['TO_STRING(${inputs.arg})'],
    },

    {
      type: 'starts_with',
      previous: true,
      next: true,
      inputs: [
        {
          type: BlockInput.Value,
          name: 'var',
          fields: [{ type: BlockField.Label, value: 'Value' }],
        },
        {
          type: BlockInput.Value,
          name: 'starts_with',
          fields: [{ type: BlockField.Label, value: 'Starts with' }],
        },
      ],

      compiler: ['STARTS_WITH(${inputs.var}, ${inputs.starts_with})'],
    },

    {
      type: 'phrase',
      previous: true,
      next: true,
      inputs: [
        {
          type: BlockInput.Value,
          name: 'phrase',
          fields: [{ type: BlockField.Label, value: 'Phrase' }],
        },
        {
          type: BlockInput.Value,
          name: 'var',
          fields: [{ type: BlockField.Label, value: 'In' }],
        },
      ],

      compiler: ['PHRASE(${inputs.var}, ${inputs.phrase})'],
    },

    {
      type: 'in_range',
      previous: true,
      next: true,
      inputs: [
        {
          type: BlockInput.Value,
          name: 'var',
          fields: [{ type: BlockField.Label, value: 'Value' }],
        },
        {
          type: BlockInput.Dummy,
          name: 'var',
          fields: [{ type: BlockField.Label, value: 'Withing range' }],
        },
        {
          type: BlockInput.Value,
          name: 'min',
          fields: [{ type: BlockField.Label, value: 'Min' }],
        },
        {
          type: BlockInput.Value,
          name: 'max',
          fields: [{ type: BlockField.Label, value: 'Max' }],
        },
      ],

      compiler: ['IN_RANGE(${inputs.var}, ${inputs.min}, ${inputs.max})'],
    },
  ]
)

export default { blocks, style }
