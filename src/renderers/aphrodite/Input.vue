<template>
  <g>
    <BlockField
      v-for="field of input.fields"
      :key="field.id"
      v-bind="{ field }"
    />
  </g>
</template>

<script>
import { BlockInput } from '../../types/block-input'

import BlockField from './Field.vue'

export default {
  props: {
    input: {
      type: BlockInput,
      required: true,
    },
  },

  components: { BlockField },
}
</script>
