<template>
  <g
    class="scratch__block"
    :transform="position"
    @mousedown.stop="block.dragStart($event)"
  >
    <path
      :id="block.id"
      :fill="block.colors.background"
      :d="drawer.path"
    ></path>

    <Input v-for="input of block.inputs" :key="input.id" v-bind="{ input }" />

    <Block v-for="block in relativeBlocks" :drawer="block" />
  </g>
</template>

<script>
import { AphroditeDrawer } from './drawer'

import Input from './Input.vue'

export default {
  name: 'Block',

  props: {
    drawer: {
      type: AphroditeDrawer,
      required: true,
    },
  },

  components: { Input },

  computed: {
    block() {
      return this.drawer.block
    },

    position() {
      return `translate(${this.block.x} ${this.block.y})`
    },

    relativeBlocks() {
      const blocks = []

      const next = this.block.nextConnection?.getTargetBlock()
      if (next) blocks.push(next)

      for (const input of this.block.inputs) {
        if (!input.connection?.isConnected()) continue

        blocks.push(input.connection.getTargetBlock())
      }

      return blocks.map((b) => this.drawer.renderer.getDrawer(b))
    },
  },
}
</script>
