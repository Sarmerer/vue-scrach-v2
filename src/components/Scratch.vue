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
    Scratch.DeclareBlock('mess', function (b) {
      b.addValueInput().addTextField('repeat')
      b.addStatementInput()
      b.setBackgroundColor('green').allowNext().allowPrev()
    })

    Scratch.DeclareBlock('mess2', function (b) {
      b.addValueInput().addTextField('print')
      b.setBackgroundColor('lightblue').allowNext().allowPrev()
    })

    this.scratch.spawnBlock('mess')
  },

  methods: {
    spawnBlock(event) {
      this.scratch.spawnBlock('mess2', event.clientX, event.clientY)
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
