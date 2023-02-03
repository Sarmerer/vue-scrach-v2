<template>
  <div
    v-if="isShown"
    class="block__dropzone"
    @mouseover="setTarget"
    @mouseout="clearTarget"
  ></div>
</template>

<script>
import mixins from './mixins'

export default {
  name: 'BlockDropzone',

  mixins: [mixins],

  props: {
    type: {
      type: String,
    },

    target: {
      default: null,
    },
  },

  computed: {
    isShown() {
      return (
        this.scratch.activeBlock &&
        this.scratch.activeBlock.id !== this.block.id &&
        this.scratch.activeBlock.id !== this.block.childOf
      )
    },
  },

  methods: {
    setTarget() {
      const block = this.scratch.activeBlock
      if (!block) return

      block.setTarget(this.type, this.block, this.component)
    },

    clearTarget() {
      const block = this.scratch.activeBlock
      if (!block) return

      block.setTarget(null, null)
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
</style>
