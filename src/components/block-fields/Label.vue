<template>
  <label class="block__field__label" v-text="field.label"></label>
</template>

<script>
import { BlockField } from '../../types/block-input'
import DynamicInput from './DynamicInput.vue'

export default {
  name: 'BlockLabelField',

  props: {
    field: {
      type: BlockField,
      required: true,
    },
  },

  components: { DynamicInput },
}
</script>
