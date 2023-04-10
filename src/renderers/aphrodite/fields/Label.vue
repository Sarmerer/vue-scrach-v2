<template>
  <g v-bind="{ transform }">
    <text
      class="block__field__text"
      :fill="color"
      v-text="field.value"
      x="0"
      y="18"
    ></text>
  </g>
</template>

<script>
import mixins from './mixins'

export default {
  mixins: [mixins],

  computed: {
    transform() {
      return `translate(${this.relativePosition.x} ${this.relativePosition.y})`
    },

    color() {
      return this.field.block.colors.text
    },
  },
} 
</script>

<style scoped>
.block__field__text {
  font: normal 12pt sans-serif;
  user-select: none;
}
</style>
