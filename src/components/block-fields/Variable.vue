<template>
  <select ref="select" class="block__field__variable" v-model="field.value">
    <option
      v-for="variable in variables"
      :key="variable.name"
      :value="variable"
      v-text="variable.name"
    ></option>
  </select>
</template>

<script>
import mixins from './mixins'

export default {
  name: 'BlockVariableField',

  mixins: [mixins],

  computed: {
    variables() {
      return this.field.block.scratch.getVariables()
    },
  },
}
</script>

<style scoped>
.block__field__variable {
  border-radius: 5px;
}
</style>
