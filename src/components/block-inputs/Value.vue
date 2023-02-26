<template>
  <span class="block__value__wrapper">
    <div
      :id="externalId"
      class="block__value"
      :class="classes"
      :style="{ ...style, ...fieldsStyle }"
    >
      <BlockField
        v-for="(field, index) in input.fields"
        :key="index"
        v-bind="{ field }"
      />

      <div
        v-if="block.isInline && !isDummy"
        :id="inlineId"
        class="block__value__inline-input"
        :class="{ empty: !inputBlock }"
      >
        <Dropzone
          v-if="input.hasValue() && block.isInline"
          :connection="input.connection"
          inline
        />
        <BlockRenderer
          v-if="block.isInline && inputBlock"
          :block="inputBlock"
        />
      </div>
    </div>

    <Dropzone
      v-if="input.hasValue() && !block.isInline"
      :connection="input.connection"
    />

    <BlockRenderer v-if="!block.isInline && inputBlock" :block="inputBlock" />
  </span>
</template>

<script>
import { BlockInput } from '../../types/block-input'
import BlockField from '../BlockField.vue'
import Dropzone from '../Dropzone.vue'
import mixins from './mixins'

export default {
  name: 'InputValue',

  mixins: [mixins],

  components: {
    BlockRenderer: () => import('../BlockRenderer.vue'),
    BlockField,
    Dropzone,
  },

  computed: {
    isDummy() {
      return this.input.type == BlockInput.Dummy
    },

    externalId() {
      if (this.block.isInline) return null

      return this.input.id
    },

    inlineId() {
      if (!this.block.isInline) return null

      return this.input.id
    },

    classes() {
      if (this.block.hasOutput() || this.block.isInline) return { inline: true }

      return {
        'block--border-tl': this.input.isFirst(),
        'block--border-bl': this.input.isLast(),
        'block--border-tr': this.input.isFirst() && this.isDummy,
        'block--border-br':
          (this.input.isLast() || this.nextInputIsStatement) && this.isDummy,
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
  align-items: flex-start;
  gap: 7px;

  &.inline {
    align-items: center;
  }
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
