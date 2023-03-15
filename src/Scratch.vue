<template>
  <div class="scratch">
    <Toolbox v-bind="{ scratch }" />

    <BlocksRenderer v-bind="{ scratch }" />

    <CodePreview v-bind="{ scratch }" />
  </div>
</template>

<script>
import { Scratch } from './types/scratch'

import Toolbox from './Toolbox.vue'
import CodePreview from './CodePreview.vue'

export default {
  name: 'Scratch',

  props: {
    scratch: {
      type: Scratch,
      required: true,
    },
  },

  components: { Toolbox, CodePreview },

  created() {
    this.$options.components.BlocksRenderer =
      this.scratch.renderer.BlocksContainerComponent
  },
}
</script>

<style lang="scss">
.scratch {
  position: relative;
  width: 100%;
  height: 100%;

  display: flex;
}

.scratch__blocks {
  &.dionysus {
    position: relative;
    flex: 1 1 auto;
    overflow: scroll;
  }
}
</style>
