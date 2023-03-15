<template>
  <svg
    version="1.1"
    width="100%"
    height="100%"
    xmlns="http://www.w3.org/2000/svg"
  >
    <Block
      v-for="(drawer, id) of absoluteDrawers"
      :key="id"
      v-bind="{ drawer }"
    />
  </svg>
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
    renderer() {
      return this.scratch.renderer
    },

    absoluteDrawers() {
      return this.scratch.getBlocks().map((b) => this.renderer.getDrawer(b))
    },
  },
}
</script>
