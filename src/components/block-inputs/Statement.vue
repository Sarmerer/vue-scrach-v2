<template>
  <div class="block__statement">
    <div class="block__statement__vertical-section">
      <div class="block__statement__bar" :style="style"></div>
      <div :id="input.id" class="block__statement__children">
        <BlockRenderer v-if="inputBlock" :block="inputBlock" />

        <Dropzone v-else v-bind="{ block, input, type: 'statement' }" />
      </div>
    </div>
    <div
      v-if="input.isLast() || nextInputIs('Statement')"
      class="block__statement__footer"
      :class="borderClasses"
      :style="style"
    ></div>
  </div>
</template>

<script>
import mixins from './mixins'

import Dropzone from '../Dropzone.vue'

export default {
  name: 'InputStatement',

  mixins: [mixins],

  components: {
    BlockRenderer: () => import('../BlockRenderer.vue'),
    Dropzone,
  },

  computed: {
    inputBlock() {
      return this.scratch.blocks.find((block) => {
        return block.inputOf?.id == this.input.id
      })
    },

    borderClasses() {
      return { 'block--border-last': this.input.isLast() }
    },
  },
}
</script>

<style lang="scss" scoped>
.block__statement {
  min-width: 20px;
  min-height: 10px;
}

.block__statement__vertical-section {
  display: flex;
  gap: 3px;
}

.block__statement__bar {
  flex: 1 1 100%;
  min-width: 20px;
}

.block__statement__children {
  position: relative;
  min-height: 10px;
  min-width: 100%;
  padding: 3px 0;

  &.empty {
    padding: 0;
  }
}

.block__statement__footer {
  height: 15px;
  width: 70px;
  border-top-right-radius: 6px;
  border-bottom-right-radius: 6px;
}

.block__statement__footer.block--border-last {
  border-bottom-left-radius: 6px;
}
</style>
