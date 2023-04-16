import { defineToolbox } from '.'
import sql from '../blocks/sql'

export default defineToolbox({
  categories: [{ name: 'sql', blocks: sql }],
})
