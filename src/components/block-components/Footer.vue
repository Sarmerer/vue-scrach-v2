<template>
  <div class="block__footer" :style="componentStyle">footer</div>
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
}
</style>
