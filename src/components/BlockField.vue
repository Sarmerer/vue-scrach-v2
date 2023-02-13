<template>
  <component :is="component" v-bind="{ field }"></component>
</template>

<script>
import { BlockField } from '../types/block-input'
import { props } from './block-fields/mixins'

import TextField from './block-fields/Text.vue'
import LabelField from './block-fields/Label.vue'
import NumberField from './block-fields/Number.vue'
import SelectField from './block-fields/Select.vue'

export default {
  name: 'BlockField',

  mixins: [{ props }],

  components: {
    TextField,
    LabelField,
    NumberField,
    SelectField,
  },

  computed: {
    component() {
      const types = {
        [BlockField.Text]: 'TextField',
        [BlockField.Label]: 'LabelField',
        [BlockField.Number]: 'NumberField',
        [BlockField.Select]: 'SelectField',
      }

      return types[this.field.type]
    },
  },
}
</script>

<style lang="scss" scoped></style>
