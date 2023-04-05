<template>
  <select v-model="field.value" @click="updateOptions">
    <option
      v-if="!variables.length"
      disabled
      v-text="'You have no variables'"
    ></option>
    <option
      v-for="variable in variables"
      :key="variable"
      :value="variable"
      v-text="variable"
    ></option>
  </select>
</template>

<script>
import mixins from './mixins'

export default {
  mixins: [mixins],

  data() {
    return { variables: [] }
  },

  mounted() {
    this.updateOptions()
  },

  methods: {
    updateOptions() {
      this.variables = this.field.block.scratch
        .getVariables()
        .map((v) => v.name)
    },
  },
}
</script>
