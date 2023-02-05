<template>
  <div class="block__field__text">
    <label
      v-if="field.label"
      class="block__field__text__label"
      v-text="field.label"
    ></label>
    <input
      @mousedown.stop
      class="block__field__text__input"
      type="text"
      v-model="field.value"
    />
  </div>
</template>

<script>
import { BlockField } from '../../types/block-input'

export default {
  name: 'BlockTextField',

  props: {
    field: {
      type: BlockField,
      required: true,
    },
  },
}
</script>

<style lang="scss" scoped>
.block__field__text__label {
  margin-right: 7px;
}

.block__field__text__input {
  width: 50px;
  border-radius: 5px;
}
</style>
