<template>
  <DynamicInput
    type="number"
    class="block__field__text"
    :placeholder="field.placeholder"
    v-model="field.value"
  />
</template>

<script>
import mixins from './mixins'

export default {
  name: 'BlockNumberField',

  mixins: [mixins],
}
</script>
