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

export default {
  name: 'Scratch',

  components: { BlockRenderer },

  computed: {
    ...mapState(['scratch']),
  },

  mounted() {
    const b = new Block(null, event?.clientX, event?.clientY)
    b.addValueInput().addTextField('name')
    b.addValueInput().addTextField('name')
    b.addValueInput().addTextField('name')
    b.addDummyInput()
    b.addValueInput().addTextField('name')
    b.addStatementInput()
    b.addStatementInput()
    b.setBackgroundColor('green').allowNext().allowPrev()
    this.scratch.addBlock(b)
  },

  methods: {
    spawnBlock(event) {
      const b = new Block(null, event?.clientX, event?.clientY)
      b.addValueInput().addTextField('longer name')
      b.setBackgroundColor('orange').allowNext().allowPrev()
      this.scratch.addBlock(b)
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
