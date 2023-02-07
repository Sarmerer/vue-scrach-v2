<template>
  <div class="block__field__text">
    <label
      v-if="field.label"
      class="block__field__text__label"
      v-text="field.label"
    ></label>
    <DynamicInput
      type="text"
      :placeholder="field.placeholder"
      v-model="field.value"
    />
  </div>
</template>

<script>
import { BlockField } from '../../types/block-input'
import DynamicInput from './DynamicInput.vue'

export default {
  name: 'BlockTextField',
  props: {
    field: {
      type: BlockField,
      required: true,
    },
  },

  components: { DynamicInput },
}
</script>

<style lang="scss" scoped>
.block__field__text__label {
  margin-right: 7px;
}
</style>
