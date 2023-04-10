<template>
  <div :id="`${scratch.id}.mask`" class="scratch__aphrodite__mask">
    <slot></slot>

    <Field
      v-for="field of fields"
      :key="field.id"
      v-bind="{ field }"
      class="scratch__block__field__aphrodite-mask"
    ></Field>
  </div>
</template>

<script>
import { BlockField } from '../../types/block-field'
import { Scratch } from '../../types/scratch'

import Field from './Field.vue'

export default {
  props: {
    scratch: {
      type: Scratch,
      required: true,
    },

    blocks: Array,
  },

  components: { Field },

  computed: {
    blocks_() {
      if (Array.isArray(this.blocks)) return this.blocks

      return this.scratch.blocks
    },

    fields() {
      const masks = []
      for (const block of this.blocks_) {
        for (const input of block.inputs) {
          for (const field of input.fields) {
            if (field.type === BlockField.Label) continue

            masks.push(field)
          }
        }
      }

      return masks
    },
  },
}
</script>

<style lang="scss" scoped>
.scratch__aphrodite__mask {
  position: relative;
  flex: 1 1 100%;

  .aphrodite__mask__element {
    position: absolute;
    z-index: 9999;
  }
}

.scratch__block__field__aphrodite-mask {
  position: absolute;
}
</style>
