<template>
  <div
    v-if="isShown"
    class="block__dropzone"
    :class="{ vertical: isInput }"
    @mouseover="setTarget"
    @mouseout="clearTarget"
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

    activeBlock() {
      return this.scratch.activeBlock
    },

    isInput() {
      return this.type == 'input'
    },

    isPrev() {
      return this.type == 'prev'
    },

    isNext() {
      return this.type == 'next'
    },

    isStatement() {
      return this.type == 'statement'
    },

    isShown() {
      return this.isSatisfied && !this.block.isActive()
    },

    isSatisfied() {
      if (!this.activeBlock) return false
      if (this.activeBlock.hasOutput && this.isInput) return true
      if (this.activeBlock.hasPrev && this.isPrev) return true
      if (this.activeBlock.hasNext && this.isNext) return true
      if (
        (this.activeBlock.hasPrev || this.activeBlock.hasNext) &&
        this.isStatement
      )
        return true
    },
  },

  methods: {
    setTarget() {
      if (!this.activeBlock) return

      this.activeBlock.target.set(this.type, {
        block: this.block,
        input: this.input,
        index: this.index,
      })
    },

    clearTarget() {
      const block = this.scratch.activeBlock
      if (!block) return

      block.target.reset()
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

  &:hover::after {
    opacity: 1;
    background-color: #3880e6;
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
