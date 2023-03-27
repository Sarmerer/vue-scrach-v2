<template>
  <text
    transform="translate(7 22)"
    class="block__field__text"
    :fill="color"
    v-text="field.value"
  ></text>
</template>

<script>
import { BlockField } from '../../../types/block-field'

export default {
  props: {
    field: {
      type: BlockField,
      required: true,
    },
  },

  computed: {
    color() {
      return this.field.block.colors.text
    },
  },
}
</script>

<style lang="scss" scoped>
.block__field__text {
  font: normal 11pt sans-serif;
  user-select: none;
}
</style>
