<template>
  <div class="scratch">
    <Toolbox v-bind="{ scratch }" />

    <div :id="scratch.id" class="scratch__blocks">
      <BlockRenderer
        v-for="block of scratch.getBlocks()"
        :key="block.id"
        v-bind="{ block }"
      />
    </div>

    <CodePreview v-bind="{ scratch }" />
  </div>
</template>

<script>
import { Scratch } from '../types/scratch'

import Toolbox from './Toolbox.vue'
import BlockRenderer from './BlockRenderer.vue'
import CodePreview from './CodePreview.vue'

export default {
  name: 'Scratch',

  props: {
    scratch: {
      type: Scratch,
      required: true,
    },
  },

  components: { Toolbox, BlockRenderer, CodePreview },
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
