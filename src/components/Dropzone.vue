<template>
  <div
    v-if="isShown"
    class="block__dropzone"
    :class="{ vertical: isInput }"
  ></div>
</template>

<script>
import { Block } from '../types/block'
import { BlockInput } from '../types/block-input'

export default {
  name: 'BlockDropzone',

  props: {
    block: { type: Block, required: true },
    index: { type: Number, default: -1 },
    input: { type: BlockInput },
    type: String,
  },

  computed: {
    scratch() {
      return this.block.scratch
    },

    isInput() {
      return this.type == 'input'
    },

    isShown() {
      return this.isSatisfied && !this.block.isActive()
    },

    isSatisfied() {
      const rules = {
        statement: () => this.scratch.proximity.input?.id == this.input?.id,
        input: () => this.scratch.proximity.input?.id == this.input?.id,
        prev: () => this.scratch.proximity.next?.id == this.block.id,
        next: () => this.scratch.proximity.prev?.id == this.block.id,
      }

      const rule = rules[this.type]
      if (!rule) return false

      return rule()
    },
  },
}
</script>

<style lang="scss" scoped>
.block__dropzone {
  width: 100%;
  height: 10px;
  z-index: 10;

  display: flex;
  flex-direction: column;
  justify-content: center;

  &.absolute {
    position: absolute;
    top: -10px;
  }

  &::after {
    content: '';
    display: inline-block;
    border-radius: 2px;
    background-color: black;
    opacity: 0.2;
    width: 100%;
    height: 6px;
  }
}

.block__dropzone.vertical {
  position: absolute;
  width: 10px;
  height: 100%;
  right: -13px;
  top: 0px;

  &::after {
    width: 7px;
    height: 90%;
  }
}
</style>
