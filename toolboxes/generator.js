import base from '../../blocks/builder/base'
import inputs from '../../blocks/builder/inputs'
import fields from '../../blocks/builder/fields'

export default defineToolbox({
  categories: [
    { name: 'base', blocks: base },
    { name: 'inputs', blocks: inputs },
    { name: 'fields', blocks: fields },
  ],
})
