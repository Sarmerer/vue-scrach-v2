<template>
  <div
    class="block__dummy"
    :class="classes"
    :style="{ ...style, ...fieldsStyle }"
  >
    <component
      v-for="(field, index) in input.fields"
      :key="index"
      :is="field.type"
      v-bind="{ field }"
    ></component>
  </div>
</template>

<script>
import mixins from './mixins'

export default {
  name: 'InputValue',

  mixins: [mixins],

  computed: {
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
.block__dummy {
  position: relative;
  min-width: 15px;
  min-height: 20px;
  width: fit-content;
  padding: 7px;

  display: flex;
  align-items: center;
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
