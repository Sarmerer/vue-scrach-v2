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
