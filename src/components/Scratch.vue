<template>
  <div class="scratch" @contextmenu.prevent="spawnBlock">
    <BlockRenderer
      v-for="block of scratch.getBlocks()"
      :key="block.id"
      v-bind="{ block }"
    />
  </div>
</template>

<script>
import { Scratch } from '../types/scratch'
import { Block } from '../types/block'

import BlockRenderer from './BlockRenderer.vue'

export default {
  name: 'Scratch',

  props: {
    scratch: {
      type: Scratch,
      required: true,
    },
  },

  components: { BlockRenderer },

  mounted() {
    this.scratch.spawnBlock('latest')
  },

  methods: {
    spawnBlock(event) {
      this.scratch.spawnBlock('latest', event.clientX, event.clientY)
    },
  },
}
</script>

<style type="scss" scoped>
.scratch {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>
