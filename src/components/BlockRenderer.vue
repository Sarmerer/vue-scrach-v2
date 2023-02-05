<template>
  <div
    :id="block.id"
    class="scratch__block"
    :class="{ relative: isRelative, dragged: block.isDragged }"
    :style="{ transform }"
    @mousedown.stop="block.dragStart($event)"
  >
    <Dropzone
      v-if="block.hasPrev"
      v-bind="{ block, type: 'prev' }"
      :class="{ absolute: !isRelative }"
    />

    <div
      v-for="(group, index) of block.getInputGroups()"
      :key="index"
      class="scratch__block__inputs-group"
    >
      <component
        v-for="input of group"
        :key="input.id"
        :is="input.type"
        v-bind="{ block, input }"
      ></component>
    </div>

    <Dropzone
      v-if="block.hasNext && !nextBlock"
      v-bind="{ block, type: 'next' }"
    />

    <BlockRenderer v-else :block="nextBlock" class="stack-offset" />
  </div>
</template>

<script>
import { Block } from '../types/block'

import Value from './block-inputs/Value.vue'
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
    Dummy: Value,
    Statement,
    Value,
    Dropzone,
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
    opacity: 0.5;
    pointer-events: none;
  }

  &.stack-offset {
    margin-top: 3px;
  }
}

.scratch__block__inputs-group {
  position: relative;
  width: fit-content;
}
</style>
