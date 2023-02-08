<template>
  <div
    v-if="connection.isHighlighted"
    class="block__dropzone"
    :class="{ vertical: isVertical, inline: isInline, absolute }"
  ></div>
</template>

<script>
import { Connection } from '../types/connection'

export default {
  name: 'BlockDropzone',

  props: {
    connection: { type: Connection, required: true },
    absolute: Boolean,
    inline: Boolean,
  },

  computed: {
    block() {
      return this.connection.block
    },

    isInput() {
      return this.connection.type == Connection.Input
    },

    isVertical() {
      return this.isInput && !this.block.isInline
    },

    isInline() {
      return this.isInput && this.block.isInline
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

  &::after {
    content: '';
    display: inline-block;
    border-radius: 2px;
    background-color: black;
    opacity: 0.35;
    width: 100%;
    height: 6px;
  }
}

.block__dropzone.absolute {
  position: absolute;
  top: -10px;
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

.block__dropzone.inline {
  position: absolute;
  width: 100%;
  height: 100%;

  &::after {
    width: 100%;
    height: 100%;
  }
}
</style>
