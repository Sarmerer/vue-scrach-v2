<template>
  <g :transform="position" @mousedown.stop="block.dragStart($event)">
    <path
      :id="block.id"
      :fill="block.colors.background"
      :d="drawer.path"
    ></path>
    <Block v-for="block in relativeBlocks" :drawer="block" />
  </g>
</template>

<script>
import { AphroditeDrawer } from './drawer'

export default {
  name: 'Block',

  props: {
    drawer: {
      type: AphroditeDrawer,
      required: true,
    },
  },

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
