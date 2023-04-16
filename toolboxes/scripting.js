import { defineToolbox } from '.'
import functions from '../blocks/functions'
import lists from '../blocks/lists'
import loops from '../blocks/loops'
import math from '../blocks/math'
import strings from '../blocks/strings'
import variables from '../blocks/variables'
import logic from '../blocks/logic'

export default defineToolbox({
  categories: [
    { name: 'functions', blocks: functions },
    { name: 'logic', blocks: logic },
    { name: 'math', blocks: math },
    { name: 'strings', blocks: strings },
    { name: 'lists', blocks: lists },
    { name: 'loops', blocks: loops },
    { name: 'variables', blocks: variables },
  ],
})
