<template>
  <span class="block__value__wrapper">
    <div :id="input.id" class="block__value" :class="classes" :style="style">
      <component
        v-for="(field, index) in fields"
        :key="index"
        :is="field.type"
        v-bind="{ field }"
      ></component>

      <Dropzone
        v-if="!isDummy && !inputBlock"
        v-bind="{ block, input, type: 'input' }"
        vertical
      />
    </div>

    <BlockRenderer v-if="inputBlock" :block="inputBlock" />
  </span>
</template>

<script>
import Dropzone from '../Dropzone.vue'
import mixins from './mixins'

export default {
  name: 'InputValue',

  mixins: [mixins],

  components: { Dropzone, BlockRenderer: () => import('../BlockRenderer.vue') },

  computed: {
    isDummy() {
      return this.input.type == 'Dummy'
    },

    inputBlock() {
      return this.scratch.blocks.find(
        (block) => block.inputOf?.id == this.input.id
      )
    },

    classes() {
      return {
        'block--border-first': this.input.isFirst(),
        'block--border-last': this.input.isLast(),
        'block--border-before-statement': this.nextInputIs('Statement'),
        'block--border-after-statement': this.prevInputIs('Statement'),
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.block__value__wrapper {
  display: flex;
}

.block__value {
  position: relative;
  min-width: 70px;
  min-height: 20px;
  width: fit-content;
  height: fit-content;
  padding: 7px;

  display: flex;
  gap: 7px;
}

.block--border-first {
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
}

.block--border-last {
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
}

.block--border-before-statement {
  border-bottom-right-radius: 6px;
}

.block--border-after-statement {
  border-top-right-radius: 6px;
}
</style>
