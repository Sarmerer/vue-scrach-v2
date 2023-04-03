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

    <Block v-for="relative in relativeBlocks" :block="relative" />
  </g>
</template>

<script>
import { Block } from '../../types/block'

import Input from './Input.vue'

export default {
  name: 'Block',

  props: {
    block: {
      type: Block,
      required: true,
    },
  },

  components: { Input },

  watch: {
    'block.id': {
      immediate: true,
      handler() {
        this.drawer = this.block.scratch.renderer.getDrawer(this.block)
      },
    },
  },

  data() {
    return {
      drawer: null,
    }
  },

  computed: {
    position() {
      const position = this.block.isRelative()
        ? this.block.relativePosition
        : this.block.position

      return `translate(${position.x} ${position.y})`
    },

    relativeBlocks() {
      const blocks = []

      if (this.block.nextConnection?.isConnected()) {
        blocks.push(this.block.nextConnection.getTargetBlock())
      }

      for (const input of this.block.inputs) {
        if (!input.connection?.isConnected()) continue

        blocks.push(input.connection.getTargetBlock())
      }

      return blocks
    },
  },

  mounted() {
    if (this.drawer.didMount) return
    this.drawer.didMount = true
    this.block.scratch.renderer.update(this.block, {})
  },
}
</script>
