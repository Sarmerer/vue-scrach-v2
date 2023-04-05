<template>
  <component
    class="aphrodite__field"
    :is="component"
    v-bind="{ style, field }"
  ></component>
</template>

<script>
import { BlockField } from '../../types/block-field'

import mixins from './fields/mixins'
import Text from './fields/Text.vue'
import Number from './fields/Number.vue'
import Select from './fields/Select.vue'
import Variable from './fields/Variable.vue'

export default {
  mixins: [mixins],

  computed: {
    component() {
      switch (this.field.type) {
        case BlockField.Text:
          return Text
        case BlockField.Number:
          return Number
        case BlockField.Select:
          return Select
        case BlockField.Variable:
          return Variable
      }
    },

    style() {
      return {
        width: `${this.field.width}px`,
        height: `${this.field.height}px`,
        transform: `translate(${this.absolutePosition.x}px, ${this.absolutePosition.y}px)`,
      }
    },
  },
}
</script>

<style>
.aphrodite__field {
  border: none;
  margin: 0;
  outline: none;
  padding: 0;
  text-align: center;
  box-sizing: border-box;
  border-radius: 2px;
}

.aphrodite__field::-webkit-outer-spin-button,
.aphrodite__field::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.aphrodite__field[type='number'] {
  -moz-appearance: textfield; /* Firefox */
}
</style>
