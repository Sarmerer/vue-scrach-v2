<template>
  <div
    class="scratch__toolbox"
    @mouseenter="mouseEnter"
    @mouseleave="mouseLeave"
    @mouseup="mouseUp"
  >
    <div v-if="showTrash" class="toolbox__trash"></div>
    <div
      v-for="(category, name) in blockCategories"
      :key="name"
      class="toolbox__category"
    >
      <div
        class="toolbox__category__name"
        @click="category.collapsed = !category.collapsed"
      >
        {{ name }}
      </div>

      <div v-show="!category.collapsed" class="toolbox__category__options">
        <div
          class="toolbox__option"
          v-for="block in category.blocks"
          :key="block.id"
          @mousedown.stop="spawnBlock(block, $event)"
        >
          <BlockRenderer
            class="toolbox__block"
            v-bind="{ block }"
            :style="{ position: 'relative' }"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Scratch } from '../types/scratch'
import BlockRenderer from './BlockRenderer.vue'

export default {
  name: 'ScratchToolbox',

  props: {
    scratch: {
      type: Scratch,
      required: true,
    },
  },

  components: { BlockRenderer },

  data() {
    return {
      toolbox: new Scratch(),
      blockCategories: {},
      hoveringAfterSpawn: false,
      hovering: false,
    }
  },

  computed: {
    showTrash() {
      return this.hovering && this.scratch.getActiveBlock()
    },
  },

  mounted() {
    Object.keys(Scratch.Blocks).map((type) => {
      const block = this.toolbox.spawnBlock(type)
      block.isFrozen = true
    })

    this.blockCategories = this.toolbox.blocks.reduce((acc, b) => {
      const category = b.type.split(':')[0]
      if (!acc[category]) acc[category] = { blocks: [], collapsed: false }

      acc[category].blocks.push(b)
      return acc
    }, {})
  },

  methods: {
    spawnBlock(typeInstance, event) {
      this.hoveringAfterSpawn = true

      event = this.scratch.normalizeMouseEvent(event)
      const block = this.scratch.spawnBlock(
        typeInstance.type,
        event.clientX,
        event.clientY
      )

      block.dragStart(event)
    },

    mouseEnter() {
      if (this.hoveringAfterSpawn) return

      this.hovering = true
    },

    mouseLeave() {
      this.hoveringAfterSpawn = false
      this.hovering = false
    },

    mouseUp() {
      this.scratch.removeBlock(this.scratch.getActiveBlock())
    },
  },
}
</script>

<style lang="scss" scoped>
.scratch__toolbox {
  position: relative;
  flex: 0 0 auto;
  border-right: 1px solid grey;
  overflow-y: auto;
}

.toolbox__category__name {
  user-select: none;
  background-color: lightgrey;
  padding: 5px 10px;
}

.toolbox__option {
  position: relative;
  height: fit-content;
  padding: 10px 10px;
}

.toolbox__block {
  pointer-events: none;
  z-index: 0;
}

.toolbox__trash {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgb(255, 142, 142);
  opacity: 0.5;
  z-index: 1;
}
</style>
