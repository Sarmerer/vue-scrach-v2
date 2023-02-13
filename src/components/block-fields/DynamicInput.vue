<template>
  <input
    class="scratch__dynamic-input"
    :style="{ width }"
    v-bind="{ type, value, placeholder }"
    @input="$emit('input', $event.target.value)"
    @mousedown.stop
  />
</template>

<script>
export default {
  name: 'DynamicInput',

  props: {
    type: String,
    value: undefined,
    placeholder: String,
  },

  data() {
    return { isMounted: false }
  },

  computed: {
    offset() {
      if (this.type == 'number') return 3
      return 1
    },

    width() {
      if (!this.isMounted) return null

      let value = this.value || this.getPlaceholder()
      if (!value) return null

      return `${value.length + this.offset}ch`
    },
  },

  mounted() {
    this.isMounted = true
  },

  methods: {
    getPlaceholder() {
      const input = this.$el
      if (!input) return ''

      return input.getAttribute('placeholder')
    },
  },
}
</script>

<style lang="scss" scoped>
.scratch__dynamic-input {
  min-width: 3ch;
  width: 3ch;
  border-radius: 5px;
  text-align: center;
  border: 1px solid gray;
}

.scratch__dynamic-input[type='number'] {
  min-width: 5ch;
  width: 5ch;
}
</style>
