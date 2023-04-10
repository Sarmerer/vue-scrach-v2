<template>
  <g
    class="scratch__block"
    v-bind="{ transform }"
    @mousedown.stop="block.dragStart($event)"
  >
    <path
      :id="block.id"
      :fill="block.colors.background"
      :d="drawer.path"
    ></path>

    <Block
      v-for="relative in relativeBlocks"
      :key="relative.id"
      :block="relative"
    />

    <LabelField
      v-for="field of textFields"
      :key="field.id"
      v-bind="{ field }"
    />
  </g>
</template>

<script>
import { Block } from '../../types/block'
import { BlockField } from '../../types/block-field'

import LabelField from './fields/Label.vue'

export default {
  name: 'Block',

  props: {
    block: {
      type: Block,
      required: true,
    },
  },

  components: { LabelField },

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
    transform() {
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

    textFields() {
      const fields = []
      for (const input of this.block.inputs) {
        for (const field of input.fields) {
          if (field.type !== BlockField.Label) continue

          fields.push(field)
        }
      }

      return fields
    },
  },

  mounted() {
    if (this.drawer.didMount) return
    this.drawer.didMount = true
    this.block.scratch.renderer.update(this.block, {})
  },
}
</script>
