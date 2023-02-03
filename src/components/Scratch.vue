<template>
  <div class="scratch">
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

export default {
  name: 'Scratch',

  components: { BlockRenderer },

  computed: {
    ...mapState(['scratch']),
  },

  mounted() {
    const block = new Block()
    block.template
      .header('Sample Header')
      .children()
      .footer()
      .children()
      .footer()

    const block2 = new Block()
    block2.template.header('Block2').backgroundColor('orange')

    this.scratch.addBlock(block)
    this.scratch.addBlock(block2)
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
