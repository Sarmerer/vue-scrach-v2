<template>
  <select v-model="field.value" @click="updateOptions">
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
  mixins: [mixins],

  methods: {
    updateOptions() {
      this.field.updateOptions()
    },
  },
}
</script>
