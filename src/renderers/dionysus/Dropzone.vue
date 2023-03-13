<template>
  <div
    v-if="connection.isHighlighted"
    class="block__dropzone"
    :class="{ vertical: isVertical, inline: isInline, absolute }"
  ></div>
</template>

<script>
import { Connection } from '../../types/connection'

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
  position: relative;
  width: 100%;
  height: 6px;
  margin: 2px 0;
  z-index: 10;

  border-radius: 2px;
  background-color: black;
  opacity: 0.35;
}

.block__dropzone.absolute {
  position: absolute;
  top: -10px;
}

.block__dropzone.vertical {
  margin: 0 2px;
  width: 6px;
  height: unset;
  align-self: stretch;
}

.block__dropzone.inline {
  position: absolute;
  width: 100%;
  height: 100%;
  margin: 0;
  border-radius: 0;
}
</style>
