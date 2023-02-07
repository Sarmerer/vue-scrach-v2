<template>
  <span class="block__value__wrapper">
    <div
      class="block__value"
      :class="classes"
      v-bind="{ style, id: externalId }"
    >
      <component
        v-for="(field, index) in input.fields"
        :key="index"
        :is="field.type"
        v-bind="{ field }"
      ></component>

      <div
        v-if="block.isInline"
        :id="inlineId"
        class="block__value__inline-input"
        :class="{ empty: !inputBlock }"
      >
        <BlockRenderer
          v-if="inputBlock && block.isInline"
          :block="inputBlock"
        />

        <Dropzone
          v-if="!inputBlock && block.isInline"
          v-bind="{ block, input, type: Block.Connection.Input, inline: true }"
        />
      </div>

      <Dropzone
        v-if="!inputBlock && !block.isInline"
        v-bind="{ block, input, type: Block.Connection.Input }"
      />
    </div>

    <BlockRenderer v-if="inputBlock && !block.isInline" :block="inputBlock" />
  </span>
</template>

<script>
import Dropzone from '../Dropzone.vue'
import mixins from './mixins'

export default {
  name: 'InputValue',

  mixins: [mixins],

  components: {
    BlockRenderer: () => import('../BlockRenderer.vue'),
    Dropzone,
  },

  computed: {
    externalId() {
      if (this.block.isInline) return null

      return this.input.id
    },

    inlineId() {
      if (!this.block.isInline) return null

      return this.input.id
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
  padding: 7px;

  display: flex;
  align-items: center;
  gap: 7px;
}

.block__value__inline-input {
  position: relative;
  min-width: 15px;
  min-height: 25px;
  border-radius: 7px;
  background-color: white;

  &.empty {
    border-radius: 3px;
  }
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
