<template>
  <select class="block__field__select" v-model="field.value">
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
}
</script>
