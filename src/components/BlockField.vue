<template>
  <component :is="component" v-bind="{ field }"></component>
</template>

<script>
import { BlockField } from '../types/block-field'
import { props } from './block-fields/mixins'

import TextField from './block-fields/Text.vue'
import LabelField from './block-fields/Label.vue'
import NumberField from './block-fields/Number.vue'
import SelectField from './block-fields/Select.vue'
import VariableField from './block-fields/Variable.vue'

export default {
  name: 'BlockField',

  mixins: [{ props }],

  components: {
    TextField,
    LabelField,
    NumberField,
    SelectField,
    VariableField,
  },

  computed: {
    component() {
      const types = {
        [BlockField.Text]: 'TextField',
        [BlockField.Label]: 'LabelField',
        [BlockField.Number]: 'NumberField',
        [BlockField.Select]: 'SelectField',
        [BlockField.Variable]: 'VariableField',
      }

      return types[this.field.type]
    },
  },
}
</script>

<style lang="scss" scoped></style>
