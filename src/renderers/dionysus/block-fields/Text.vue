<template>
  <DynamicInput
    type="text"
    class="block__field__text"
    :placeholder="field.placeholder"
    v-model="field.value"
  />
</template>

<script>
import mixins from './mixins'

export default {
  name: 'BlockTextField',

  mixins: [mixins],
}
</script>
