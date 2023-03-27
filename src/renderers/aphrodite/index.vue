<template>
  <InputsMask v-bind="{ scratch }">
    <svg
      version="1.1"
      width="100%"
      height="100%"
      xmlns="http://www.w3.org/2000/svg"
      :id="scratch.id"
      class="scratch__blocks scratch__blocks-aphrodite"
    >
      <Block v-for="(drawer, id) of drawers" :key="id" v-bind="{ drawer }" />
    </svg>
  </InputsMask>
</template>

<script>
import { Scratch } from '../../types/scratch'

import Block from './Block.vue'
import InputsMask from './InputsMask.vue'

export default {
  name: 'BlocksRenderer',

  props: {
    scratch: {
      type: Scratch,
      required: true,
    },
  },

  components: { Block, InputsMask },

  computed: {
    drawers() {
      return this.scratch
        .getBlocks()
        .map((b) => this.scratch.renderer.getDrawer(b))
    },
  },
}
</script>

<style lang="scss" scoped>
.scratch__blocks-aphrodite {
  position: absolute;
  left: 0;
  top: 0;
}
</style>
