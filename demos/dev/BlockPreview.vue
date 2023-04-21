<template>
  <div class="scratch--block-preview">
    <ScratchRenderer v-bind="{ scratch }" />

    <div class="scratch__block-preview">
      <ScratchRenderer
        v-if="block"
        v-bind="{ scratch: previewScratch, blocks: [block] }"
      />
    </div>
  </div>
</template>

<script>
import { Scratch } from '../../src/types/scratch'
import toolbox from '../../toolboxes/generator'
import { Block } from '../../blocks/types'

import ScratchRenderer from '../../src/index.vue'
import BlockRenderer from '../../src/renderers/aphrodite/Block.vue'

export default {
  props: {
    scratch: {
      type: Scratch,
      required: true,
    },
  },

  components: { ScratchRenderer, BlockRenderer },

  watch: {
    'scratch.generator.code': {
      immediate: true,
      handler(def) {
        if (!Array.isArray(def) || !def.length) return

        if (this.block) {
          this.previewScratch.removeBlock(this.block)
        }

        const block = new Block(this.scratch)
        block.applyDefinition(def[0])
        this.previewScratch.addBlock(block)
        this.block = block
      },
    },
  },

  data() {
    return {
      block: null,
      previewScratch: new Scratch(),
    }
  },

  created() {
    this.scratch.setToolbox(toolbox)
  },
}
</script>

<style scoped>
.scratch--block-preview {
  display: flex;
  height: 100%;
}

.scratch__block-preview {
  flex: 0 0 25%;
  border-left: 1px solid gray;
}
</style>
