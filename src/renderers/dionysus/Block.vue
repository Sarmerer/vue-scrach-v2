<template>
  <div
    class="scratch__block__overlay"
    :class="{ relative: isRelative, dragged: block.isDragged }"
    :style="{ transform }"
  >
    <div
      :id="block.id"
      class="scratch__block"
      @mousedown.stop="block.dragStart($event)"
    >
      <slot v-if="block.hasPrev()" name="top-zone">
        <Dropzone
          :connection="block.previousConnection"
          :absolute="!isRelative"
        />
      </slot>

      <div
        v-for="(group, index) of drawer.getInputGroups()"
        :key="index"
        class="scratch__block__inputs-group"
        :class="{ inline: block.isInline }"
      >
        <BlockInput
          v-for="input of group"
          :key="input.id"
          v-bind="{ block, input }"
        />
      </div>

      <slot v-if="block.hasNext()" name="bottom-zone">
        <Dropzone :connection="block.nextConnection" />
      </slot>
    </div>

    <Block v-if="nextBlock" :drawer="nextBlock" />
  </div>
</template>

<script>
import { Block } from '../../types/block'
import { DionysusDrawer } from '../dionysus/drawer'

import Dropzone from './Dropzone.vue'
import BlockInput from './BlockInput.vue'

export default {
  name: 'Block',

  props: {
    drawer: {
      type: DionysusDrawer,
      required: true,
    },
  },

  components: {
    Dropzone,
    BlockInput,
  },

  computed: {
    renderer() {
      return this.drawer.renderer
    },

    block() {
      return this.drawer.block
    },

    isRelative() {
      return this.block.isRelative()
    },

    transform() {
      if (this.isRelative) return null

      return `translate(${this.block.position.x}px, ${this.block.position.y}px)`
    },

    nextBlock() {
      return this.renderer.getDrawer(
        this.block.nextConnection?.getTargetBlock()
      )
    },
  },
}
</script>

<style lang="scss" scoped>
.scratch__block__overlay {
  position: absolute;
  transform-origin: 0 0;
  user-select: none;
  z-index: 1;

  &.relative {
    position: relative;
  }

  &.dragged {
    pointer-events: none;
  }
}

.scratch__block {
  position: relative;
  width: fit-content;
  font-size: 14px;
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
