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
      <Block v-for="block of blocks_" :key="block.id" v-bind="{ block }" />
    </svg>
  </InputsMask>
</template>

<script>
import { Scratch } from '../../types/scratch'

import Block from './Block.vue'
import InputsMask from './FieldsMask.vue'

export default {
  name: 'BlocksRenderer',

  props: {
    scratch: {
      type: Scratch,
      required: true,
    },

    blocks: Array,
  },

  components: { Block, InputsMask },

  computed: {
    blocks_() {
      if (Array.isArray(this.blocks)) return this.blocks

      return this.scratch.getBlocks()
    },
  },
}
</script>

<style scoped>
.scratch__blocks-aphrodite {
  position: absolute;
  left: 0;
  top: 0;
}
</style>
