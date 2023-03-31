<template>
  <div class="scratch">
    <Toolbox v-bind="{ scratch }" />

    <BlocksRenderer v-bind="{ scratch }" />

    <CodePreview v-bind="{ scratch }" />
  </div>
</template>

<script>
import { Scratch } from './types/scratch'

import Toolbox from './Toolbox.vue'
import CodePreview from './CodePreview.vue'

export default {
  name: 'Scratch',

  props: {
    scratch: {
      type: Scratch,
      required: true,
    },
  },

  components: { Toolbox, CodePreview },

  created() {
    this.$options.components.BlocksRenderer =
      this.scratch.renderer.BlocksContainerComponent
  },

  mounted() {
    const s = this.scratch.spawnBlock('strings:print', 100, 200)
    const s1 = this.scratch.spawnBlock('strings:print', 100, 200)
    s.nextConnection.connect(s1.previousConnection)

    const l = this.scratch.spawnBlock('lists:new', 200, 200)
    const l2 = this.scratch.spawnBlock('lists:new', 200, 200)
    l.inputs[0].connection.connect(l2.outputConnection)

    const p = this.scratch.spawnBlock('loops:repeat', 100, 100)
    p.inputs[0].connection.connect(l.outputConnection)
    p.inputs[1].connection.connect(s.previousConnection)
  },
}
</script>

<style lang="scss">
.scratch {
  position: relative;
  width: 100%;
  height: 100%;

  display: flex;
}

.scratch__blocks {
  &.dionysus {
    position: relative;
    flex: 1 1 auto;
    overflow: scroll;
  }
}
</style>
