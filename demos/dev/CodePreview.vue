<template>
  <div class="scratch--code-preview">
    <ScratchRenderer v-bind="{ scratch }" />
    <CodePreview v-bind="{ code }" />
  </div>
</template>

<script>
import { Scratch } from '../../src/types/scratch'
import toolbox from '../../toolboxes/scripting'

import ScratchRenderer from '../../src/index.vue'
import CodePreview from '../../src/renderers/common/CodePreview.vue'

export default {
  props: {
    scratch: {
      type: Scratch,
      required: true,
    },
  },

  components: { ScratchRenderer, CodePreview },

  computed: {
    code() {
      if (!this.scratch?.generator) return ''

      return this.scratch.generator.code
    },
  },

  created() {
    this.scratch.setToolbox(toolbox)
  },

  mounted() {
    const s = this.scratch.spawnBlock('strings:print', 100, 200)
    const s1 = this.scratch.spawnBlock('strings:print', 100, 200)
    s.nextConnection.connect(s1.previousConnection)

    const l = this.scratch.spawnBlock('lists:new', 200, 200)
    const l2 = this.scratch.spawnBlock('math:operation', 200, 200)
    l.inputs[0].connection.connect(l2.outputConnection)

    const p = this.scratch.spawnBlock('loops:repeat', 100, 100)
    p.inputs[0].connection.connect(l.outputConnection)
    p.inputs[1].connection.connect(s.previousConnection)
  },
}
</script>

<style scoped>
.scratch--code-preview {
  height: 100%;
  display: flex;
}
</style>
