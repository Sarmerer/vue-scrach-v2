<template>
  <component :is="component" v-bind="{ block, input }"></component>
</template>

<script>
import { props } from './block-inputs/mixins'
import Value from './block-inputs/Value.vue'
import Statement from './block-inputs/Statement.vue'
import { BlockInput } from '../../types/block-input'

export default {
  name: 'BlockInput',

  mixins: [{ props }],

  components: {
    Dummy: Value,
    Statement,
    Value,
  },

  computed: {
    component() {
      const types = {
        [BlockInput.Dummy]: 'Dummy',
        [BlockInput.Value]: 'Value',
        [BlockInput.Statement]: 'Statement',
      }

      return types[this.input.type]
    },
  },
}
</script>
