<template>
  <div class="scratch" @contextmenu.prevent="spawnBlock">
    <BlockRenderer
      v-for="block of scratch.getBlocks()"
      :key="block.id"
      :block="block"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex'

import BlockRenderer from './BlockRenderer.vue'
import { Block } from '../types/block'
import { BlockInput } from '../types/block-input'

export default {
  name: 'Scratch',

  components: { BlockRenderer },

  computed: {
    ...mapState(['scratch']),
  },

  mounted() {
    const b1 = new Block()
    b1.template.header('function').children().footer().backgroundColor('purple')
    this.scratch.addBlock(b1)
  },

  methods: {
    spawnBlock(event) {
      const block = new Block(null, event.clientX, event.clientY)
      block.template
        .header('Sample Header ' + this.scratch.blocks.length, [
          new BlockInput(0, { label: 'input' }),
        ])
        .children()
        .footer()
        .children()
        .footer()
        .backgroundColor('orange')

      this.scratch.addBlock(block)
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
