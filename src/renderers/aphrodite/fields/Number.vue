<template>
  <input type="number" :placeholder="field.placeholder" v-model="field.value" />
</template>

<script>
import mixins from './mixins'

export default {
  mixins: [mixins],
}
</script>
