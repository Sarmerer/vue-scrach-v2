<template>
  <div class="block__children">
    <div class="block__children__bar" :style="componentStyle"></div>
    <div class="block__children__container" :class="{ empty: isEmpty }">
      <BlockRenderer
        v-for="(child, index) in children"
        :key="`block-${child.id}`"
        :block="child"
        relative
      >
        <template #top-dropzone>
          <Dropzone
            :key="`dropzone-${child.id}`"
            v-bind="{ block, component, index, type: 'child' }"
          />
        </template>

        <template #bottom-dropzone>
          <span></span>
        </template>
      </BlockRenderer>

      <Dropzone v-bind="{ block, component, type: 'child' }" />
    </div>
  </div>
</template>

<script>
import Dropzone from './Dropzone.vue'
import mixins from './mixins'

export default {
  name: 'BlockChildren',

  mixins: [mixins],

  components: {
    BlockRenderer: () => import('../BlockRenderer.vue'),
    Dropzone,
  },

  computed: {
    isEmpty() {
      return this.component.children.length == 0
    },

    children() {
      return this.component.children.map((childId) => {
        return this.scratch.blocks.find((b) => b.id == childId)
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.block__children {
  position: relative;
  width: 100px;
  display: flex;
  flex-direction: row;
}

.block__children__bar {
  flex: 1 1 100%;
  min-width: 20px;
  margin-right: 5px;
}

.block__children__container {
  position: relative;
  min-height: 10px;
  min-width: 100%;
  padding: 5px 0;

  &.empty {
    padding: 0;
  }
}
</style>
