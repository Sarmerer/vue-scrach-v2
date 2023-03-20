<template>
  <div :id="scratch.id" class="scratch__blocks">
    <Block v-for="(drawer, id) of drawers" :key="id" v-bind="{ drawer }" />
  </div>
</template>

<script>
import { Scratch } from '../../types/scratch'

import Block from './Block.vue'

export default {
  name: 'BlocksRenderer',

  props: {
    scratch: {
      type: Scratch,
      required: true,
    },
  },

  components: { Block },

  computed: {
    drawers() {
      return this.scratch
        .getBlocks()
        .map((b) => this.scratch.renderer.getDrawer(b))
    },
  },
}
</script>

<style scoped>
.scratch__blocks {
  position: relative;
  flex: 1 1 auto;
  overflow: scroll;
}
</style>
