<template>
  <select
    ref="select"
    class="block__field__select"
    v-model="field.value"
    @mousedown="updateOptions"
  >
    <option
      selected
      disabled
      hidden
      :value="null"
      v-text="field.placeholder"
    ></option>
    <option
      v-for="(option, index) in field.options"
      :key="index"
      :value="option"
      v-text="option"
    ></option>
  </select>
</template>

<script>
import mixins from './mixins'

export default {
  name: 'BlockSelectField',

  mixins: [mixins],

  methods: {
    updateOptions() {
      this.field.updateOptions()
    },
  },
}
</script>

<style scoped>
.block__field__select {
  border-radius: 5px;
}
</style>
