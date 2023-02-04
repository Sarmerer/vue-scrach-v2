<template>
  <div
    :id="block.id"
    class="scratch__block"
    :class="{ relative, stacked, active: block.isActive }"
    :style="{ transform }"
    @mousedown.stop="block.dragStart($event)"
  >
    <slot name="top-dropzone">
      <Dropzone v-bind="{ block, type: 'before' }" />
    </slot>

    <component
      v-for="(component, index) of block.template.components"
      :key="index"
      :is="component.type"
      v-bind="{ block, component }"
    ></component>

    <slot name="bottom-dropzone">
      <Dropzone v-bind="{ block, type: 'after' }" />
    </slot>
  </div>
</template>

<script>
import { Block } from '../types/block'

import Header from './block-components/Header.vue'
import Children from './block-components/Children.vue'
import Footer from './block-components/Footer.vue'
import Dropzone from './block-components/Dropzone.vue'

export default {
  name: 'BlockRenderer',

  props: {
    block: {
      type: Block,
      required: true,
    },

    relative: {
      type: Boolean,
      default: false,
    },

    stacked: {
      type: Boolean,
      default: false,
    },
  },

  components: {
    Header,
    Children,
    Footer,
    Dropzone,
  },

  computed: {
    transform() {
      if (this.block.isChild()) return null

      return `translate(${this.block.x}px, ${this.block.y}px)`
    },
  },
}
</script>

<style lang="scss" scoped>
.scratch__block {
  transform-origin: 0 0;
  position: absolute;
  z-index: 1;

  &.relative {
    position: relative;
  }

  &.stacked {
    margin-top: 5px;
  }

  &.active {
    opacity: 0.5;
    pointer-events: none;
  }
}
</style>
