<template>
  <div class="scratch__workspace--aphrodite">
    <Toolbox v-bind="{ toolbox }" />
    <Blocks
      class="scratch__workspace__blocks--aphrodite"
      v-bind="{ scratch }"
    />
  </div>
</template>

<script>
import { Scratch } from '../../types/scratch'

import CodePreview from '../common/CodePreview.vue'
import Toolbox from './Toolbox.vue'
import Blocks from './Blocks.vue'

export default {
  name: 'BlocksRenderer',

  props: {
    scratch: {
      type: Scratch,
      required: true,
    },
  },

  components: {
    CodePreview,
    Toolbox,
    Blocks,
  },

  computed: {
    toolbox() {
      return this.scratch.toolbox
    },
  },
}
</script>

<style scoped>
.scratch__workspace--aphrodite {
  position: relative;
  width: 100%;
  height: 100%;

  display: flex;
}

.scratch__workspace__blocks--aphrodite {
  flex: 1 100%;
}
</style>
