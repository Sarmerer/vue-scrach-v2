<template>
  <span class="block__value__wrapper">
    <div
      class="block__value"
      :class="classes"
      v-bind="{ id: externalId, style: { ...style, ...fieldsStyle } }"
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
      if (this.block.hasOutput) return {}

      return {
        'block--border-tl': this.input.isFirst(),
        'block--border-bl': this.input.isLast(),
        'block--border-tr': this.input.isFirst() && !this.inputBlock,
        'block--border-br':
          (this.input.isLast() || this.nextInputIs('Statement')) &&
          !this.inputBlock,
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
  min-width: 15px;
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
  background-color: white;
}

.block--border-tl {
  border-top-left-radius: 6px;
}

.block--border-tr {
  border-top-right-radius: 6px;
}

.block--border-br {
  border-bottom-right-radius: 6px;
}

.block--border-bl {
  border-bottom-left-radius: 6px;
}
</style>
