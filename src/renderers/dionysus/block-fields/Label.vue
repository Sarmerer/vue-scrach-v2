<template>
  <label class="block__field__label" v-text="field.value"></label>
</template>

<script>
import mixins from './mixins'

export default {
  name: 'BlockLabelField',

  mixins: [mixins],
}
</script>
