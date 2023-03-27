<template>
  <div :id="`${scratch.id}.mask`" class="scratch__aphrodite__mask">
    <slot></slot>

    <FieldMask
      v-for="field of fields"
      :key="field.id"
      v-bind="{ field }"
      class="scratch__block__field__aphrodite-mask"
    ></FieldMask>
  </div>
</template>

<script>
import { BlockField } from '../../types/block-field'
import { Scratch } from '../../types/scratch'

import FieldMask from './Field.vue'

export default {
  props: {
    scratch: {
      type: Scratch,
      required: true,
    },
  },

  components: { FieldMask },

  computed: {
    fields() {
      const maskedFields = [
        BlockField.Number,
        BlockField.Select,
        BlockField.Text,
        BlockField.Variable,
      ]
      return this.scratch.blocks.reduce((acc, block) => {
        for (const input of block.inputs) {
          for (const field of input.fields) {
            if (!maskedFields.includes(field.type)) continue
            acc.push(field)
          }
        }

        return acc
      }, [])
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
