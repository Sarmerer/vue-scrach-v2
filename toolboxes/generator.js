import { defineToolbox, withStyle } from '.'
import base from '../blocks/builder/base'
import inputs from '../blocks/builder/inputs'
import fields from '../blocks/builder/fields'

import { JSONGenerator } from '../src/types/generator/json'

export default defineToolbox({
  generator: JSONGenerator,
  categories: [
    {
      name: 'base',
      blocks: base.blocks,
      ...withStyle(base),
    },

    {
      name: 'inputs',
      blocks: inputs.blocks,
      ...withStyle(inputs),
    },

    {
      name: 'fields',
      blocks: fields.blocks,
      ...withStyle(fields),
    },
  ],
})
