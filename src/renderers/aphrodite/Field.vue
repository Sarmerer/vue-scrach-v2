<template>
  <component
    :style="{ transform }"
    :is="component"
    v-bind="{ field }"
  ></component>
</template>

<script>
import { BlockField } from '../../types/block-field'

import Label from './fields/Label.vue'
import DionysusField from '../dionysus/BlockField.vue'

export default {
  props: {
    field: {
      type: BlockField,
      required: true,
    },
  },

  computed: {
    component() {
      switch (this.field.type) {
        case BlockField.Label:
          return Label

        default:
          return DionysusField
      }
    },

    transform() {
      if (this.field.type == BlockField.Label) return ''

      const { x, y } = this.field.position
      return `translate(${x}px, ${y}px)`
    },
  },
}
</script>

<style lang="scss" scoped></style>
