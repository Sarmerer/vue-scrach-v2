<template>
  <div
    class="block__header"
    :style="componentStyle"
    v-text="component.text"
  ></div>
</template>

<script>
import mixins from './mixins'

export default {
  name: 'BlockHeader',

  mixins: [mixins],
}
</script>

<style lang="scss" scoped>
.block__header {
  width: 200px;
  padding: 10px 15px;
  user-select: none;
  border-radius: 6px 6px 6px 0;
}
</style>
