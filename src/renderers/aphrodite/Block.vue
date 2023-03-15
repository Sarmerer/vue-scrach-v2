<template>
  <g :transform="position" @mousedown.stop="block.dragStart($event)">
    <path :id="block.id" :fill="block.colors.background" :d="body"></path>
    <Block v-if="nextBlock" :drawer="nextBlock" />
  </g>
</template>

<script>
import { Drawer } from './renderer'

export default {
  name: 'Block',

  props: {
    drawer: {
      type: Drawer,
      required: true,
    },
  },

  computed: {
    block() {
      return this.drawer.block
    },

    position() {
      if (this.block.isRelative()) return 'translate(0, 0)'

      return `translate(${this.block.x} ${this.block.y})`
    },

    body() {
      return this.drawer.path
    },

    nextBlock() {
      const block = this.block.nextConnection?.getTargetBlock()
      if (!block) return null

      return this.drawer.renderer.getDrawer(block)
    },
  },
}
</script>
