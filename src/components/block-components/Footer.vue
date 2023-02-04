<template>
  <div class="block__footer" :style="componentStyle"></div>
</template>

<script>
import mixins from './mixins'

export default {
  name: 'BlockHeader',

  mixins: [mixins],
}
</script>

<style lang="scss" scoped>
.block__footer {
  padding: 10px 15px;
  border-radius: 0 6px 6px 6px;
}
</style>
