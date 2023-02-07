<template>
  <div class="scratch">
    <ScratchToolbox v-bind="{ scratch }" />

    <div :id="scratch.id" class="scratch__blocks">
      <BlockRenderer
        v-for="block of scratch.getBlocks()"
        :key="block.id"
        v-bind="{ block }"
      />
    </div>
  </div>
</template>

<script>
import { Scratch } from '../types/scratch'
import ScratchToolbox from './Toolbox.vue'

import BlockRenderer from './BlockRenderer.vue'

export default {
  name: 'Scratch',

  props: {
    scratch: {
      type: Scratch,
      required: true,
    },
  },

  components: { ScratchToolbox, BlockRenderer },
}
</script>

<style type="scss" scoped>
.scratch {
  position: relative;
  width: 100%;
  height: 100%;

  display: flex;
}

.scratch__blocks {
  position: relative;
  flex: 1 1 auto;
  overflow: scroll;
}
</style>
