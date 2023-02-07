<template>
  <div
    :id="block.id"
    class="scratch__block"
    :class="{ relative: isRelative, dragged: block.isDragged }"
    :style="{ transform }"
    @mousedown.stop="block.dragStart($event)"
  >
    <slot v-if="block.hasPrev" name="top-zone">
      <Dropzone
        v-bind="{ block, type: Block.Connection.Prev }"
        :class="{ absolute: !isRelative }"
      />
    </slot>

    <div
      v-for="(group, index) of block.getInputGroups()"
      :key="index"
      class="scratch__block__inputs-group"
      :class="{ inline: block.isInline }"
    >
      <component
        v-for="input of group"
        :key="input.id"
        :is="input.type"
        v-bind="{ block, input }"
      ></component>
    </div>

    <slot v-if="block.hasNext && !nextBlock" name="bottom-zone">
      <Dropzone v-bind="{ block, type: Block.Connection.Next }" />
    </slot>

    <BlockRenderer v-else-if="nextBlock" :block="nextBlock" />
  </div>
</template>

<script>
import { Block } from '../types/block'

import Value from './block-inputs/Value.vue'
import Dummy from './block-inputs/Dummy.vue'
import Statement from './block-inputs/Statement.vue'
import Dropzone from './Dropzone.vue'

export default {
  name: 'BlockRenderer',

  props: {
    block: {
      type: Block,
      required: true,
    },
  },

  components: {
    Statement,
    Dummy,
    Value,
    Dropzone,
  },

  data() {
    this.Block = Block
    return {}
  },

  computed: {
    isRelative() {
      return this.block.isRelative()
    },

    transform() {
      if (this.isRelative) return null

      return `translate(${this.block.x}px, ${this.block.y}px)`
    },

    nextBlock() {
      return this.block.nextBlock
    },
  },
}
</script>

<style lang="scss" scoped>
.scratch__block {
  position: absolute;
  transform-origin: 0 0;
  user-select: none;
  width: fit-content;
  z-index: 1;

  &.relative {
    position: relative;
  }

  &.dragged {
    pointer-events: none;
  }
}

.scratch__block__inputs-group {
  position: relative;
  width: fit-content;

  &.inline {
    display: flex;
    flex-direction: row;
  }
}
</style>
