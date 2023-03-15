<template>
  <div :id="scratch.id" class="scratch__blocks">
    <Block
      v-for="(block, id) of scratch.getBlocks()"
      :key="id"
      v-bind="{ block }"
    />
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
}
</script>

<style scoped>
.scratch__blocks {
  position: relative;
  flex: 1 1 auto;
  overflow: scroll;
}
</style>
